console.log('Identification Header');
console.log('Name: noah915');
console.log('Course: CS31103');
console.log('Week 3');
console.log();
console.log('Runtime Information');
console.log('Node version:', process.version);
console.log('Current date/time:', new Date().toString());
console.log();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const startedAt = new Date().toString();
const appConfig = {
  port: Number(port),
  environment: env,
  startedAt,
};
console.log('Configuration via Environment Variables');
console.log('PORT:', port);
console.log('NODE_ENV:', env);
console.log();
console.log('A Simple Data Object');
console.log(JSON.stringify(appConfig, null, 2));
