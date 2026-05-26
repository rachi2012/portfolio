# Coding Prompt: Real-Time Sliding-Window Transaction Rate Limiter & Geo-Velocity Fraud Risk Engine

## Context & Domain
In modern fintech and payment processing systems, high-throughput transaction ingestion engines must evaluate risk checks and rate limits in real-time. These engines must handle massive concurrency, perform complex geographical and temporal distance checks, track statistical metrics, and reject high-risk actions before transactions are sent to downstream ledger processors.

Your task is to build a self-contained, production-ready **Real-Time Sliding-Window Transaction Rate Limiter & Geo-Velocity Fraud Risk Engine** in Python.

---

## Technical Specifications & Requirements

You must implement a Python class structure representing the `RiskEngine` along with its auxiliary validation, scoring, and collection subsystems.

### 1. Ingestion Payload Schema
Each transaction is submitted as a dictionary matching this schema:
```python
{
    "transaction_id": str,   # Unique UUID
    "client_id": str,        # Identifier for the merchant/client API key
    "amount": float,         # Value in USD
    "timestamp": str,        # ISO 8601 format: "YYYY-MM-DDTHH:MM:SSZ" (UTC)
    "location": {
        "latitude": float,   # Range: [-90.0, 90.0]
        "longitude": float   # Range: [-180.0, 180.0]
    },
    "ip_address": str        # IPv4 string
}
```

### 2. Core Subsystems to Implement

1. **Input Validator**:
   - Parses the payload and validates all constraints.
   - Raises custom descriptive exceptions for:
     - `MalformedPayloadError`: Missing fields or incorrect data types.
     - `InvalidAmountError`: Negative or non-numeric amount.
     - `InvalidCoordinateError`: Latitude or longitude outside valid mathematical bounds.
     - `InvalidTimestampError`: Incorrect date-time formats.

2. **Sliding-Window Rate Limiter**:
   - Limit: Restrict transactions per `client_id` (e.g., maximum of 5 transactions per 10-second sliding window).
   - Dynamic Eviction: Old transaction records outside the sliding window must be pruned dynamically on each lookup to save memory.

3. **Multi-Rule Fraud Risk Engine**:
   - **Velocity Check**: Detect high-frequency transactions for a client.
   - **Amount Limit Rule**: Flag any transaction where amount exceeds a global threshold (e.g., $10,000) or if a client's cumulative transaction amount in their sliding window exceeds a limit (e.g., $25,000).
   - **Geo-Velocity Rule**: Track consecutive locations for a client. Compute the shortest geodetic distance between the current transaction and the client's immediately preceding transaction using the **Haversine Formula**. Calculate travel velocity (distance / time delta). If the computed speed exceeds **800 km/h** (commercial flight speed), flag the transaction as fraud due to "impossible travel speed".

4. **Thread-Safe Metrics Accumulator**:
   - Track aggregate counts: `total_processed`, `total_rate_limited`, `total_fraud_flagged`, `cumulative_amount_usd`.
   - Maintain thread-safe latency statistics for risk evaluation times.

---

## Explicit Constraints

1. **Standard Library Only**: You must use **only** Python's standard library. Third-party packages (e.g., `numpy`, `pandas`, `requests`, `geopy`, `redis`, `pytest`) are strictly forbidden.
2. **Strict Thread-Safety**: The engine must support highly concurrent ingestion from multiple simulator threads. You must manage synchronization safely, avoiding global bottlenecks by using fine-grained locks or reentrant locks (`threading.RLock`) per client context, ensuring no race conditions occur on shared state.
3. **Algorithmic Efficiency (Time Complexity)**: 
   - Eviction of stale transactions from the sliding-window log must be optimized. 
   - Do **not** iterate over a client's full history to evict old items. Use a data structure like `collections.deque` and evict items from the left side until the head is within the sliding window, achieving $O(K)$ time where $K$ is the number of expired transactions.
4. **Output Formatting**: The `RiskEngine.evaluate(transaction_payload)` function must return a strictly structured dictionary:
   ```python
   {
       "allowed": bool,        # True if not rate-limited
       "flagged": bool,        # True if any fraud rule is triggered
       "reasons": list[str],   # List of violated rules (e.g., ["RATE_LIMIT_EXCEEDED", "IMP_TRAVEL_SPEED"])
       "scores": dict[str, float] # Rule-specific score values (e.g., {"amount_score": 0.0, "travel_velocity_kmh": 1250.5})
   }
   ```
5. **Self-Contained Runnable Harness**:
   - Include a robust suite of unit tests using Python's standard `unittest` library at the bottom of the script.
   - Provide a simulated multi-threaded workload generator demonstrating parallel risk analysis and prints final aggregated statistics.
