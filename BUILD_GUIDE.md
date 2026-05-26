# BUILD GUIDE: Risk Scoring & Rate Limiter Engine

This guide details the architectural decisions, structural components, and mathematical models that elevate `golden_response.py` to a production-grade, highly performant reference benchmark solution.

---

## 🏛️ System Architecture

The engine adopts a decoupled, object-oriented design where responsibilities are separated into distinct modules:

```mermaid
graph TD
    Payload[Transaction JSON Payload] --> Validator[Transaction Data & Schema Validator]
    Validator -->|Success| Engine[Risk Engine Controller]
    Validator -->|Raises Custom Error| Client[Client Response / Exception Handler]
    
    Engine -->|Fetch/Create State| StripedLocks{Registry Lock Striping}
    StripedLocks -->|Return Client State| ClientState[Client State Log & Lock]
    
    subgraph Client State Evaluation (Thread-Safe)
        ClientState --> Eviction[O(K) Sliding-Window Eviction]
        Eviction --> RateLimit[Rate Limit Evaluation]
        RateLimit --> AmountChecks[Individual & Cumulative Volume checks]
        AmountChecks --> GeoVelocity[Haversine Speed Verification]
    end
    
    ClientState -->|Commit Allowed Transaction| History[Deque Transaction Log]
    Engine -->|Update Stats| Metrics[Thread-Safe Metrics Collector]
```

---

## ⚙️ Technical Deep-Dives

### 1. Fine-Grained Concurrency (Lock Striping)
- **Problem**: A single global lock in multi-threaded ingestion causes severe resource contention and slow execution times.
- **Solution**: We implemented **Lock Striping**. An outer registry lock (`self._registry_lock`) is only used briefly when registering a new `client_id` for the first time. All subsequent operations on client state use a local reentrant lock (`threading.RLock`) bound directly to the target `ClientState` instance.
- **Why RLock?**: Reentrant locks allow the same thread to acquire the lock multiple times without self-deadlocking, which is useful when helper routines within `ClientState` need to execute safe sub-routines while already locked.

### 2. $O(K)$ Sliding-Window Eviction
- **Problem**: Keeping historical transactions in a standard Python `list` forces $O(N)$ iterations to filter active items. As time passes, lookup time degrades.
- **Solution**: The transaction history for each merchant is stored in a `collections.deque`. Since transactions are ingested chronologically, we are guaranteed that any items violating the time boundaries reside at the left-hand index of the queue.
- **Algorithm**:
  ```python
  while self.history and self.history[0].timestamp < cutoff:
      self.history.popleft()
  ```
  This guarantees that we only traverse and pop exactly $K$ stale elements. Thus, eviction runs in $O(K)$ time. If ingestion is steady, $K \approx 1$ per lookup, achieving $O(1)$ amortized complexity.

### 3. Geodetic Distance and Velocity Stability (Haversine)
- **Problem**: Flat Euclidean math (`sqrt((x2-x1)^2 + (y2-y1)^2)`) fails on spherical earth dimensions, producing critical inaccuracies for long distances.
- **Solution**: We calculate geodesic distance using the **Haversine Formula**:
  $$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
  $$c = 2\cdot\text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
  $$d = R\cdot c$$
- **Numerical Edge Cases Handled**:
  - **Floating-point rounding overflow**: In extreme cases, float multiplication can make $a > 1.0$, which causes `math.sqrt(1 - a)` to raise a mathematical domain exception. We solve this with explicit clipping: `a = max(0.0, min(1.0, a))`.
  - **Simultaneous transactions (divide-by-zero)**: If two transactions occur in different locations at the exact same second, the elapsed time is `0.0`. Standard division would crash the program. We catch `time_delta == 0.0` and flag it immediately as an impossible travel speed if coordinates differ.

---

## 🚀 Execution & Verification

### Running Unit Tests
To verify all core validations, rate limiting thresholds, mathematical calculations, and multi-threaded locks, run the embedded unit test suite:
```bash
python golden_response.py
```

### Running High-Throughput Live Simulation
To launch a multi-threaded workload simulator that spawns concurrent threads generating transactions with varying amounts, intervals, and changing geodetic coordinates:
```bash
python golden_response.py --simulate
```
The simulator will output logs displaying transaction statuses, rate limit decisions, impossible travel alerts, and final aggregated processing metrics.
