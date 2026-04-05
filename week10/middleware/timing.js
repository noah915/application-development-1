"use strict";

function timing(req, res, next) {
  const startTime = Date.now();

  // Override res.json and res.send to capture when response is sent
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  const originalStatus = res.status.bind(res);

  function logTiming() {
    const elapsed = Date.now() - startTime;
    console.log(`[${req.method} ${req.originalUrl}] completed in ${elapsed}ms`);
  }

  // Handle res.json()
  res.json = function (data) {
    logTiming();
    return originalJson(data);
  };

  // Handle res.send()
  res.send = function (data) {
    logTiming();
    return originalSend(data);
  };

  // Handle res.status().json() or res.status().send()
  res.status = function (code) {
    const statusRes = originalStatus(code);
    statusRes.json = function (data) {
      logTiming();
      return originalJson(data);
    };
    statusRes.send = function (data) {
      logTiming();
      return originalSend(data);
    };
    return statusRes;
  };

  next();
}

module.exports = timing;
