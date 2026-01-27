// Week 3 - Node.js Runtime Configuration
// Noah Falla
// CS31103

// Identification Header
console.log("========================================");
console.log("Name: Noah Falla");
console.log("Course: CS31103");
console.log("Week 3");
console.log("========================================\n");

// Runtime Information
console.log("Runtime Information:");
console.log("Node Version:", process.version);
console.log("Current Date/Time:", new Date());
console.log();

// Configuration via Environment Variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

console.log("Environment Configuration:");
console.log("PORT:", PORT);
console.log("NODE_ENV:", NODE_ENV);
console.log();

// Create appConfig object
const appConfig = {
  port: PORT,
  environment: NODE_ENV,
  startedAt: new Date()
};

// Print appConfig as formatted JSON
console.log("Application Configuration:");
console.log(JSON.stringify(appConfig, null, 2));
