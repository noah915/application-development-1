
console.log('=== Identification Header ===');
console.log('Name: Noah (noah915)');
console.log('Course: CS31103');
console.log('Week: 3');
console.log();

console.log('=== Runtime Information ===');
console.log('Node version:', process.version);
console.log('Current date/time:', new Date().toString());
console.log();

// Read environment variables with defaults
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Simple app config object
const appConfig = {
  port: Number(PORT),
  environment: NODE_ENV,
  startedAt: new Date().toString(),
};

console.log('=== Configuration via Environment Variables ===');
console.log('PORT:', PORT);
console.log('NODE_ENV:', NODE_ENV);
console.log();

console.log('=== A Simple Data Object ===');
console.log(JSON.stringify(appConfig, null, 2));
