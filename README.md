# Vehicle Scheduler with Knapsack Optimization

A Node.js application that fetches depot and vehicle data from an external API and computes the maximum impact for each depot using the 0/1 Knapsack algorithm. All operations are tracked through a custom logging middleware.

---

## Features

- Token-based authentication via client credentials
- API integration for fetching depot and vehicle data
- 0/1 Knapsack optimization to maximize impact per depot
- Custom logging middleware with structured log formatting
- Error handling and input validation throughout all stages

---

## Project Structure

```
vehicle_scheduler/
logging_middleware/
notification_app_be/
auth.js
README.md
```

---

## Execution Flow

### Stage 1 — Authentication

Generates an access token using client credentials before any API calls are made.

### Stage 2 — Data Fetching

Fetches depot and vehicle records from the configured API endpoints using the authenticated token.

### Stage 3 — Validation

Validates the fetched data for completeness and correctness. Empty or malformed records are flagged and handled gracefully before processing begins.

### Stage 4 — Processing

Applies the 0/1 Knapsack algorithm to each depot. The algorithm selects the optimal subset of vehicles that maximizes total impact within the depot's available mechanic hours constraint.

### Stage 5 — Logging

Each stage emits structured log entries via the logging middleware in the following format:

```
(stack, level, package, message)
```

---

## Algorithm

**0/1 Knapsack**

- Capacity: MechanicHours available per depot
- Items: Vehicles, each with a weight (hours required) and value (impact score)
- Goal: Select a subset of vehicles that maximizes total impact without exceeding available mechanic hours
- Each vehicle is either included or excluded — no fractional selection

---

## How to Run

```bash
node vehicle_scheduler/scheduler.js
```

---

## Notes

- No depots or vehicles are hardcoded; all data is fetched from the API at runtime
- Logging follows the required structured format at every stage
- Each stage is cleanly separated for readability and maintainability

## Output
<img width="885" height="355" alt="Screenshot 2026-05-02 at 12 31 22 PM" src="https://github.com/user-attachments/assets/87cd99b2-8fee-4f5e-a7d2-20aa7344c98c" />
