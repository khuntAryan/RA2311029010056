Vehicle Scheduler with Knapsack Optimization

This project fetches depot and vehicle data from an API and computes the maximum impact for each depot using the 0/1 Knapsack algorithm, while logging all operations via a custom logging middleware.

Project Structure
vehicle_scheduler/
logging_middleware/
notification_app_be/
auth.js
README.md
Features
API integration (Depots & Vehicles)
Token-based authentication
Knapsack optimization (max impact)
Custom logging middleware
Clean error handling
How to Run
node vehicle_scheduler/scheduler.js
📸 Output Screenshots
Scheduler Output

Logging Middleware

Algorithm Used
0/1 Knapsack
Maximizes total Impact within MechanicHours
Notes
No hardcoded depots or vehicles
Data is fully API-driven
Logging follows required format (stack, level, package, message)
Sample Output
Depot 2 → Max Impact: 157
Depot 3 → Max Impact: 157
Depot 4 → Max Impact: 143
Depot 5 → Max Impact: 157

<img width="996" height="352" alt="Screenshot 2026-05-02 at 12 21 35 PM" src="https://github.com/user-attachments/assets/457858cb-c645-47d7-968e-68975f6c571f" />
