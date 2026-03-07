# Middleware Lifecycle Analysis

## Scenario 1: Valid POST request to /tasks with correct API key

### Request Body:
```json
{
  "title": "Complete assignment",
  "description": "Finish the middleware assignment"
}
```

### Header:
```
x-api-key: 12345
```

### Execution Order:

1. **Request arrives at Express app**
   - Express receives the POST /tasks request with headers and body

2. **express.json() middleware**
   - Parses the JSON request body
   - Makes body data available as req.body

3. **logger middleware**
   - Logs: `[2025-03-06T...] POST /tasks`
   - Receives the request with timestamp
   - Calls next() to continue

4. **timing middleware**
   - Records startTime = Date.now()
   - Wraps res.json(), res.send(), and res.status()
   - Stores these wrapped functions to measure response time
   - Calls next() to continue

5. **apiKeyAuth middleware**
   - Checks req.method === "POST" (not GET, so validation applies)
   - Reads req.headers["x-api-key"] = "12345"
   - Validates: apiKey === "12345" ✓ (VALID)
   - Calls next() to continue

6. **Router matches /tasks route**
   - Express Router finds the POST /tasks route handler
   - Route has middleware: validateTask, then tasksController.createTask

7. **validateTask middleware**
   - Checks req.method === "POST"
   - Extracts { title: "Complete assignment", description: "..." } from req.body
   - Validates: title is truthy, is a string, and is not empty ✓ (VALID)
   - Calls next() to continue to controller

8. **tasksController.createTask() executes**
   - Controller receives the request
   - Validates title (again) - always performs defensive checks
   - Creates task object with id, title, description, completed
   - Pushes task to tasks array
   - Returns res.status(201).json(task)

9. **Response sent via timing middleware wrapper**
   - The wrapped res.status(201).json() is called
   - timing middleware's logTiming() function executes
   - Logs: `[POST /tasks] completed in 5ms` (elapsed time)
   - Original res.json() sends the response with 201 status

10. **Response delivery**
    - HTTP 201 Created response sent to client with task object
    - Connection closes

## Scenario 2: POST /tasks without required field

### Request Body:
```json
{
  "description": "Missing title"
}
```

### Header:
```
x-api-key: 12345
```

### Execution Order:

1. **Request arrives at Express app**

2. **express.json() middleware**
   - Parses JSON body: { description: "Missing title" }

3. **logger middleware**
   - Logs request with timestamp
   - Calls next()

4. **timing middleware**
   - Records start time and wraps response methods
   - Calls next()

5. **apiKeyAuth middleware**
   - Checks req.method === "POST" (applies validation)
   - Reads x-api-key = "12345" ✓ (VALID)
   - Calls next()

6. **Router matches /tasks POST route**

7. **validateTask middleware (STOPS HERE)**
   - Checks req.method === "POST"
   - Extracts { description: "Missing title" } from req.body
   - Validates: title field is missing or falsy
   - Returns res.status(400).json({...validation error...})
   - **Response is sent here**
   - **next() is NOT called - controller never executes**

8. **Response sent via timing middleware wrapper**
   - The wrapped res.status(400).json() is called
   - timing middleware's logTiming() executes
   - Logs: `[POST /tasks] completed in 2ms`
   - Sends error response

9. **Response delivery**
   - HTTP 400 Bad Request sent to client with validation error
   - Controller (tasksController.createTask) **was never called**

## Scenario 3: POST /tasks with missing API key

### Request Body:
```json
{
  "title": "Complete assignment"
}
```

### Header:
```
(no x-api-key header)
```

### Execution Order:

1. **Request arrives at Express app**

2. **express.json() middleware**
   - Parses JSON body: { title: "Complete assignment" }

3. **logger middleware**
   - Logs request
   - Calls next()

4. **timing middleware**
   - Records start time and wraps response methods
   - Calls next()

5. **apiKeyAuth middleware (STOPS HERE)**
   - Checks req.method === "POST" (applies validation)
   - Reads req.headers["x-api-key"] = undefined
   - Validates: !apiKey (missing) → condition fails
   - Returns res.status(401).json({...unauthorized error...})
   - **Response is sent here**
   - **next() is NOT called - router never matches, controller never executes**

6. **Response sent via timing middleware wrapper**
   - The wrapped res.status(401).json() is called
   - timing middleware's logTiming() executes
   - Logs: `[POST /tasks] completed in 1ms`
   - Sends unauthorized response

7. **Response delivery**
   - HTTP 401 Unauthorized sent to client with error
   - Router, validateTask middleware, and tasksController.createTask **were never called**

---

## Key Insights

### Order Matters
- **Global middleware** (logger, timing, apiKeyAuth) runs for ALL requests
- **Route-specific middleware** (validateTask) runs only for matched routes
- **Middleware that returns res.status/json()** stops the chain - next() must be called to continue

### Response Timing
- timing middleware wraps response methods BEFORE validators run
- even if request is rejected, timing logs the response duration
- timing includes middleware execution time, not just controller time

### Why Controller Executes
- Controller only executes if:
  1. ALL global middleware calls next()
  2. Router finds a matching route
  3. ALL route-specific middleware calls next()
  4. If any middleware sends a response, controller is skipped
