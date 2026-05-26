#!/usr/bin/env python3
"""
GOLDEN RESPONSE: Production-Quality Reference Implementation for LLM Benchmarking
Domain: Fintech Real-Time Sliding-Window Counter Rate Limiter & Geo-Velocity Fraud Risk Engine

Features:
- Pure Python standard library implementation (highly portable, no external dependencies).
- Thread-safe sliding-window rate limiting using fine-grained lock striping (per-client locks).
- Geodetic distance and velocity checks (Haversine formula).
- Robust exception hierarchy for input and schema validations.
- Optimized sliding window eviction using collections.deque (O(K) amortized time complexity).
- Dual-mode execution: Running directly launches unit tests; running with --simulate triggers an active concurrent multi-threaded simulation.
"""

import sys
import math
import uuid
import time
import logging
import threading
from datetime import datetime, timezone
from collections import deque
from typing import Dict, List, Tuple, Any, Optional

# Configure robust and informative logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] (%(threadName)s) %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("RiskEngine")

# =========================================================================
# 1. Custom Exceptions
# =========================================================================

class RiskEngineException(Exception):
    """Base exception for all risk engine related issues."""
    pass

class MalformedPayloadError(RiskEngineException):
    """Raised when the transaction dictionary is missing fields or has invalid types."""
    pass

class InvalidAmountError(RiskEngineException):
    """Raised when the transaction amount is negative, infinite, or not a float/int."""
    pass

class InvalidCoordinateError(RiskEngineException):
    """Raised when latitude is outside [-90, 90] or longitude is outside [-180, 180]."""
    pass

class InvalidTimestampError(RiskEngineException):
    """Raised when the timestamp string does not follow the valid ISO 8601 UTC schema."""
    pass

# =========================================================================
# 2. Domain Data Structures
# =========================================================================

class Transaction:
    """Represents a validated financial transaction."""
    __slots__ = ('transaction_id', 'client_id', 'amount', 'timestamp', 'lat', 'lon', 'ip_address')

    def __init__(self, payload: Dict[str, Any]):
        self.validate_schema(payload)
        
        self.transaction_id: str = payload["transaction_id"]
        self.client_id: str = payload["client_id"]
        self.amount: float = float(payload["amount"])
        self.timestamp: datetime = self.parse_timestamp(payload["timestamp"])
        self.lat: float = float(payload["location"]["latitude"])
        self.lon: float = float(payload["location"]["longitude"])
        self.ip_address: str = payload["ip_address"]

    @staticmethod
    def parse_timestamp(ts_str: str) -> datetime:
        """Parses ISO 8601 strings to UTC datetime objects with defensive validation."""
        try:
            # Standard ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
            if ts_str.endswith('Z'):
                clean_str = ts_str[:-1] + '+00:00'
            else:
                clean_str = ts_str
            dt = datetime.fromisoformat(clean_str)
            # Ensure it is timezone-aware and in UTC
            return dt.astimezone(timezone.utc)
        except (ValueError, TypeError) as e:
            raise InvalidTimestampError(f"Timestamp '{ts_str}' is malformed. Must be ISO 8601 UTC (e.g. YYYY-MM-DDTHH:MM:SSZ)") from e

    @staticmethod
    def validate_schema(payload: Dict[str, Any]) -> None:
        """Validates payload keys, nesting structure, and numeric/coordinate values."""
        if not isinstance(payload, dict):
            raise MalformedPayloadError("Payload must be a dictionary.")

        required_fields = ["transaction_id", "client_id", "amount", "timestamp", "location", "ip_address"]
        for field in required_fields:
            if field not in payload:
                raise MalformedPayloadError(f"Missing required field: '{field}'")

        # Validate transaction UUID
        try:
            uuid.UUID(str(payload["transaction_id"]))
        except ValueError as e:
            raise MalformedPayloadError("Field 'transaction_id' must be a valid UUID string.") from e

        # Validate amount
        try:
            amt = payload["amount"]
            if not isinstance(amt, (int, float)) or isinstance(amt, bool):
                raise InvalidAmountError("Field 'amount' must be a float or integer.")
            if math.isnan(amt) or math.isinf(amt):
                raise InvalidAmountError("Field 'amount' cannot be NaN or Infinite.")
            if amt < 0.0:
                raise InvalidAmountError("Field 'amount' cannot be negative.")
        except TypeError as e:
            raise InvalidAmountError("Field 'amount' is malformed.") from e

        # Validate location coordinates
        loc = payload["location"]
        if not isinstance(loc, dict) or "latitude" not in loc or "longitude" not in loc:
            raise MalformedPayloadError("Field 'location' must be a dictionary containing 'latitude' and 'longitude'.")
        
        try:
            lat = float(loc["latitude"])
            lon = float(loc["longitude"])
            if not (-90.0 <= lat <= 90.0):
                raise InvalidCoordinateError(f"Latitude {lat} out of bounds [-90.0, 90.0].")
            if not (-180.0 <= lon <= 180.0):
                raise InvalidCoordinateError(f"Longitude {lon} out of bounds [-180.0, 180.0].")
        except (ValueError, TypeError) as e:
            raise InvalidCoordinateError("Latitude and longitude must be valid floating point numbers.") from e

        # Validate IP string presence
        if not isinstance(payload["ip_address"], str) or not payload["ip_address"].strip():
            raise MalformedPayloadError("Field 'ip_address' must be a non-empty string.")

# =========================================================================
# 3. Client State Manager (Thread-Safe Sliding Window)
# =========================================================================

class ClientState:
    """Manages thread-safe historical window transactions and geographical tracking for a single client."""
    
    def __init__(self, client_id: str, window_seconds: float = 10.0):
        self.client_id = client_id
        self.window_seconds = window_seconds
        self.lock = threading.RLock() # Reentrant lock per-client (Fine-grained lock striping)
        self.history: deque[Transaction] = deque()
        self.last_transaction: Optional[Transaction] = None

    def evict_stale_transactions(self, current_time: datetime) -> int:
        """
        Evicts transactions older than (current_time - window_seconds).
        Complexity: O(K) where K is the number of stale transactions evicted.
        Must be called while holding self.lock.
        """
        evicted_count = 0
        cutoff_time = current_time - timezone.utc.utcoffset(current_time) if current_time.tzinfo is None else current_time
        cutoff_time = cutoff_time - datetime.timedelta(seconds=self.window_seconds) if hasattr(datetime, "timedelta") else cutoff_time - datetime.timedelta(seconds=self.window_seconds)
        
        # In Python datetime math:
        cutoff = current_time - datetime.timedelta(seconds=self.window_seconds)
        
        while self.history and self.history[0].timestamp < cutoff:
            self.history.popleft()
            evicted_count += 1
        return evicted_count

    def add_transaction(self, tx: Transaction) -> None:
        """Appends a new transaction to history and updates last known state."""
        self.history.append(tx)
        self.last_transaction = tx

    def get_cumulative_amount(self) -> float:
        """Computes current cumulative amount in the active sliding window."""
        return sum(tx.amount for tx in self.history)

    def get_window_size(self) -> int:
        """Returns the number of active transactions in the sliding window."""
        return len(self.history)

# =========================================================================
# 4. Metrics Collector (Thread-Safe Global Stats)
# =========================================================================

class MetricsCollector:
    """Tracks performance and operational analytics across the entire application thread-safely."""
    
    def __init__(self):
        self._lock = threading.Lock()
        self.total_processed = 0
        self.total_rate_limited = 0
        self.total_fraud_flagged = 0
        self.cumulative_amount_usd = 0.0
        self.latencies: List[float] = []

    def record(self, amount: float, rate_limited: bool, flagged: bool, duration_ms: float) -> None:
        with self._lock:
            self.total_processed += 1
            if rate_limited:
                self.total_rate_limited += 1
            if flagged:
                self.total_fraud_flagged += 1
            if not rate_limited:
                self.cumulative_amount_usd += amount
            self.latencies.append(duration_ms)

    def get_stats(self) -> Dict[str, Any]:
        with self._lock:
            avg_latency = sum(self.latencies) / len(self.latencies) if self.latencies else 0.0
            return {
                "total_processed": self.total_processed,
                "total_rate_limited": self.total_rate_limited,
                "total_fraud_flagged": self.total_fraud_flagged,
                "cumulative_amount_usd": round(self.cumulative_amount_usd, 2),
                "average_latency_ms": round(avg_latency, 3)
            }

# =========================================================================
# 5. Core Risk Engine Implementation
# =========================================================================

class RiskEngine:
    """
    Highly performant, thread-safe Fintech Risk Scoring and Rate Limiter.
    Utilizes lock striping across clients to ensure maximum scalability under load.
    """
    
    def __init__(self, 
                 rate_limit_max: int = 5, 
                 rate_limit_window: float = 10.0,
                 global_amount_limit: float = 10000.0,
                 cumulative_amount_limit: float = 25000.0,
                 max_travel_velocity_kmh: float = 800.0):
        
        self.rate_limit_max = rate_limit_max
        self.rate_limit_window = rate_limit_window
        self.global_amount_limit = global_amount_limit
        self.cumulative_amount_limit = cumulative_amount_limit
        self.max_travel_velocity_kmh = max_travel_velocity_kmh

        # Storage & Lock structures
        self._registry_lock = threading.Lock()
        self.clients: Dict[str, ClientState] = {}
        self.metrics = MetricsCollector()

    def _get_or_create_client(self, client_id: str) -> ClientState:
        """Thread-safe registration fetch to avoid write-race bottlenecks."""
        with self._registry_lock:
            if client_id not in self.clients:
                self.clients[client_id] = ClientState(client_id, self.rate_limit_window)
            return self.clients[client_id]

    @staticmethod
    def compute_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Computes geodetic distance in kilometers between two sets of GPS coordinates
        using the numerically stable Haversine formula.
        """
        # Convert decimal degrees to radians
        rad_lat1, rad_lon1, rad_lat2, rad_lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

        dlon = rad_lon2 - rad_lon1
        dlat = rad_lat2 - rad_lat1

        a = math.sin(dlat / 2.0)**2 + math.cos(rad_lat1) * math.cos(rad_lat2) * math.sin(dlon / 2.0)**2
        # Use numerical clipping to prevent out-of-range float precision errors in asin/sqrt
        a = max(0.0, min(1.0, a))
        
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        earth_radius_km = 6371.0
        return earth_radius_km * c

    def evaluate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses and evaluates risk conditions on the given transaction payload.
        Ensures strict thread-safety using localized granular client locks.
        """
        start_time = time.perf_counter()
        
        # 1. Parse and Validate Schema (Raises exceptions on validation failure)
        tx = Transaction(payload)
        
        client_state = self._get_or_create_client(tx.client_id)
        
        # Initialize response defaults
        allowed = True
        flagged = False
        reasons: List[str] = []
        scores: Dict[str, float] = {
            "rate_window_transactions": 0.0,
            "individual_amount_usd": tx.amount,
            "cumulative_window_amount_usd": 0.0,
            "travel_velocity_kmh": 0.0
        }

        # Thread-safe local client operation
        with client_state.lock:
            # A. Prune expired logs
            import datetime as dt_module
            client_state.evict_stale_transactions(tx.timestamp)

            # B. Evaluate Rate Limiting
            # (Note: we check count BEFORE appending the current transaction to represent window load accurately)
            current_window_count = client_state.get_window_size()
            scores["rate_window_transactions"] = float(current_window_count)

            if current_window_count >= self.rate_limit_max:
                allowed = False
                reasons.append("RATE_LIMIT_EXCEEDED")

            # C. Evaluate Fraud Rules
            # Fraud Rule 1: Individual Amount Check
            if tx.amount > self.global_amount_limit:
                flagged = True
                reasons.append("AMOUNT_EXCEEDS_GLOBAL_LIMIT")

            # Fraud Rule 2: Cumulative Window Volume Check
            cumulative_amount = client_state.get_cumulative_amount() + tx.amount
            scores["cumulative_window_amount_usd"] = cumulative_amount
            if cumulative_amount > self.cumulative_amount_limit:
                flagged = True
                reasons.append("CUMULATIVE_LIMIT_EXCEEDED")

            # Fraud Rule 3: Geo-Velocity Impossible Travel Speed
            prev_tx = client_state.last_transaction
            if prev_tx is not None:
                # Distance in km
                distance = self.compute_haversine_distance(prev_tx.lat, prev_tx.lon, tx.lat, tx.lon)
                # Time delta in seconds
                time_delta = (tx.timestamp - prev_tx.timestamp).total_seconds()
                
                # Check for backwards or simultaneous temporal submissions
                if time_delta < 0.0:
                    # Ingestion drift or timestamp tampering
                    flagged = True
                    reasons.append("OUT_OF_ORDER_TIMESTAMP")
                elif time_delta == 0.0:
                    # Instantaneous execution in two different physical coordinates is impossible
                    if distance > 0.05: # Permit minor coordinate flutter (e.g. 50 meters)
                        flagged = True
                        reasons.append("IMP_TRAVEL_SPEED")
                        scores["travel_velocity_kmh"] = float('inf')
                else:
                    # Velocity in km/h
                    hours = time_delta / 3600.0
                    velocity = distance / hours
                    scores["travel_velocity_kmh"] = round(velocity, 2)

                    if velocity > self.max_travel_velocity_kmh:
                        flagged = True
                        reasons.append("IMP_TRAVEL_SPEED")

            # D. Commit State (If allowed by rate limiter)
            if allowed:
                client_state.add_transaction(tx)

        # 2. Record Operational Metrics
        duration_ms = (time.perf_counter() - start_time) * 1000.0
        self.metrics.record(tx.amount, not allowed, flagged, duration_ms)

        return {
            "allowed": allowed,
            "flagged": flagged,
            "reasons": reasons,
            "scores": scores
        }

# =========================================================================
# 6. Test Suite & Local Simulation Harness
# =========================================================================

import unittest

class TestRiskEngine(unittest.TestCase):
    """Rigorous standard unit test suite to verify the mathematical and architectural behavior of the RiskEngine."""

    def setUp(self):
        self.engine = RiskEngine(
            rate_limit_max=3, 
            rate_limit_window=5.0, 
            global_amount_limit=1000.0,
            cumulative_amount_limit=2500.0,
            max_travel_velocity_kmh=800.0
        )
        self.client_id = "client_testing_123"

    def make_payload(self, amount: float = 100.0, timestamp: str = "2026-05-26T12:00:00Z", 
                     lat: float = 40.7128, lon: float = -74.0060, client_id: str = None) -> Dict[str, Any]:
        return {
            "transaction_id": str(uuid.uuid4()),
            "client_id": client_id or self.client_id,
            "amount": amount,
            "timestamp": timestamp,
            "location": {
                "latitude": lat,
                "longitude": lon
            },
            "ip_address": "192.168.1.50"
        }

    def test_schema_validations(self):
        """Verify that malformed inputs throw appropriate semantic custom errors."""
        # 1. Missing field
        payload = self.make_payload()
        del payload["amount"]
        with self.assertRaises(MalformedPayloadError):
            self.engine.evaluate(payload)

        # 2. Negative amount
        payload = self.make_payload(amount=-50.0)
        with self.assertRaises(InvalidAmountError):
            self.engine.evaluate(payload)

        # 3. Bad Latitude
        payload = self.make_payload(lat=95.0)
        with self.assertRaises(InvalidCoordinateError):
            self.engine.evaluate(payload)

        # 4. Bad Timestamp
        payload = self.make_payload(timestamp="Not-A-Date")
        with self.assertRaises(InvalidTimestampError):
            self.engine.evaluate(payload)

    def test_sliding_window_rate_limiting(self):
        """Ensure rate limits apply per client within the exact time boundaries."""
        t0 = "2026-05-26T12:00:00Z"
        
        # Max limit is 3 requests per 5-second window
        p1 = self.make_payload(timestamp=t0)
        p2 = self.make_payload(timestamp=t0)
        p3 = self.make_payload(timestamp=t0)
        p4 = self.make_payload(timestamp=t0) # Should be blocked (4th within 5s window)

        self.assertTrue(self.engine.evaluate(p1)["allowed"])
        self.assertTrue(self.engine.evaluate(p2)["allowed"])
        self.assertTrue(self.engine.evaluate(p3)["allowed"])
        
        res4 = self.engine.evaluate(p4)
        self.assertFalse(res4["allowed"])
        self.assertIn("RATE_LIMIT_EXCEEDED", res4["reasons"])

        # Create a fifth payload outside the 5-second sliding window
        p5 = self.make_payload(timestamp="2026-05-26T12:00:06Z")
        self.assertTrue(self.engine.evaluate(p5)["allowed"])

    def test_global_and_cumulative_amount_rules(self):
        """Ensure single limit and rolling window sums trigger appropriate safety flags."""
        # Global amount threshold is $1,000. Send $1,500
        p_high = self.make_payload(amount=1500.0)
        res = self.engine.evaluate(p_high)
        self.assertTrue(res["allowed"])
        self.assertTrue(res["flagged"])
        self.assertIn("AMOUNT_EXCEEDS_GLOBAL_LIMIT", res["reasons"])

        # Cumulative window limit is $2,500. Send two permitted transaction flows totaling $2,600
        engine_cum = RiskEngine(rate_limit_max=5, global_amount_limit=5000.0, cumulative_amount_limit=2500.0)
        c1 = self.make_payload(amount=1200.0, timestamp="2026-05-26T12:00:00Z")
        c2 = self.make_payload(amount=1400.0, timestamp="2026-05-26T12:00:01Z")

        res1 = engine_cum.evaluate(c1)
        self.assertFalse(res1["flagged"])

        res2 = engine_cum.evaluate(c2)
        self.assertTrue(res2["flagged"])
        self.assertIn("CUMULATIVE_LIMIT_EXCEEDED", res2["reasons"])

    def test_geo_velocity_checks(self):
        """Verify Haversine formula and speed calculations flag impossible coordinates."""
        # NYC Coordinates: 40.7128° N, 74.0060° W
        # London Coordinates: 51.5074° N, 0.1278° W
        # Distance is ~5570 km.
        
        nyc = self.make_payload(lat=40.7128, lon=-74.0060, timestamp="2026-05-26T12:00:00Z")
        london = self.make_payload(lat=51.5074, lon=-0.1278, timestamp="2026-05-26T12:30:00Z") # London 30 mins later
        
        # 5570 km / 0.5 hours = ~11,140 km/h (> 800 limit)
        self.assertTrue(self.engine.evaluate(nyc)["allowed"])
        
        res_london = self.engine.evaluate(london)
        self.assertTrue(res_london["flagged"])
        self.assertIn("IMP_TRAVEL_SPEED", res_london["reasons"])
        self.assertGreater(res_london["scores"]["travel_velocity_kmh"], 10000.0)

    def test_multithreaded_concurrency(self):
        """Concurrently fire a batch of requests to verify lock stability under raw parallel workloads."""
        num_threads = 8
        reqs_per_thread = 50
        results = []
        errors = []

        def worker():
            for i in range(reqs_per_thread):
                # Unique clients per thread avoids synthetic rate limit drops to evaluate raw code safety
                cid = f"thread_client_{threading.current_thread().name}"
                p = self.make_payload(client_id=cid, amount=10.0)
                try:
                    res = self.engine.evaluate(p)
                    results.append(res)
                except Exception as e:
                    errors.append(e)

        threads = [threading.Thread(target=worker, name=f"Worker-{i}") for i in range(num_threads)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        self.assertEqual(len(errors), 0, f"Encountered concurrency exceptions: {errors}")
        self.assertEqual(len(results), num_threads * reqs_per_thread)


def run_live_simulation():
    """Generates a high-throughput simulated transaction workload to demo real-time analysis."""
    logger.info("Initializing multi-threaded transaction simulation...")
    
    # 5 transaction threshold per 5 seconds, max velocity limit of 800 km/h
    engine = RiskEngine(
        rate_limit_max=5,
        rate_limit_window=5.0,
        global_amount_limit=8000.0,
        cumulative_amount_limit=15000.0
    )

    simulation_active = True
    clients_list = ["merchant_alpha", "merchant_beta", "merchant_gamma"]

    def simulator_client_worker(client_id: str):
        # Coordinates mapping to locations
        locations = [
            (40.7128, -74.0060), # NYC
            (34.0522, -118.2437), # LA (~3935 km away)
            (51.5074, -0.1278),  # London (~8750 km away)
        ]
        loc_index = 0
        
        while simulation_active:
            # Generate a payload
            lat, lon = locations[loc_index]
            payload = {
                "transaction_id": str(uuid.uuid4()),
                "client_id": client_id,
                "amount": float(round(10.0 + (time.perf_counter() % 100) * 15.0, 2)),
                "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                "location": {
                    "latitude": lat,
                    "longitude": lon
                },
                "ip_address": f"192.168.1.{10 + hash(client_id)%100}"
            }

            try:
                result = engine.evaluate(payload)
                logger.info(
                    f"[{client_id}] Tx Amount: ${payload['amount']} "
                    f"-> Allowed: {result['allowed']}, Flagged: {result['flagged']} (Reasons: {result['reasons']})"
                )
            except Exception as ex:
                logger.error(f"Simulator exception for {client_id}: {ex}")

            # Cycle locations to simulate impossible high-speed travel randomly
            if time.perf_counter() % 3 < 1:
                loc_index = (loc_index + 1) % len(locations)

            time.sleep(0.8) # Trigger fast velocity checks & rate limits

    threads = [threading.Thread(target=simulator_client_worker, args=(cid,), name=f"Sim-{cid}") for cid in clients_list]
    
    for t in threads:
        t.start()

    time.sleep(6.0) # Run simulation for 6 seconds
    simulation_active = False
    
    for t in threads:
        t.join()

    logger.info("Simulation halted. Aggregating system metrics...")
    stats = engine.metrics.get_stats()
    logger.info(f"System Performance Statistics: {stats}")

# =========================================================================
# 7. Main Executor Entry
# =========================================================================

if __name__ == "__main__":
    if "--simulate" in sys.argv:
        run_live_simulation()
    else:
        # Standard fallback to unit testing mode
        logger.info("Executing comprehensive local unit test suite...")
        unittest.main()
