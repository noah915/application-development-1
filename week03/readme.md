# Week 3 - Node.js Runtime Configuration

## How I Completed This Assignment

For this assignment, I used a combination of the course materials and GitHub Copilot to help me understand the Node.js basics and troubleshoot any issues I ran into.

### Resources Used:
- Course lecture notes on Node.js fundamentals
- GitHub Copilot AI assistant for code suggestions and troubleshooting
- Node.js official documentation (https://nodejs.org/docs/)

## Conceptual Questions

### What does package.json do?

The `package.json` file is basically the configuration file for a Node.js project. It keeps track of important information like:
- The project name and version
- What dependencies (external packages) the project needs
- Scripts that can be run with npm commands
- Metadata like the author, license, and description

Think of it as the "ID card" for your Node project - it tells npm and other developers everything they need to know about your project.

### What is process.env?

`process.env` is an object in Node.js that contains all the environment variables from the system where the program is running. Environment variables are useful for:
- Storing configuration that changes between different environments (development vs production)
- Keeping sensitive information (like API keys) out of the code
- Allowing the same code to behave differently based on where it's running

For example, in this assignment we use `process.env.PORT` to get the port number and `process.env.NODE_ENV` to know if we're in development or production mode.

### What does npm start run?

When you run `npm start`, npm looks in the `package.json` file for the "start" script and executes whatever command is defined there. In our case, it runs `node index.js`, which tells Node to execute our index.js file.

It's basically a shortcut - instead of typing `node index.js` every time, we can just type `npm start`. This is helpful when projects get more complex and the start command might include multiple steps.

### Bugs and Errors

I didn't run into any major bugs while completing this assignment. The setup was pretty straightforward:

1. Running `npm init -y` created the package.json file automatically
2. Creating index.js and adding the required code worked on the first try
3. The only thing I had to remember was to use the macOS version of the dev script (with `NODE_ENV=development` before the command) since I'm on a Mac

One thing I learned is that environment variables work differently on Windows vs Mac/Linux, which is why there are two different versions of the dev script in the instructions.

## Output

The program successfully displays:
- My identification information (name, course, week)
- The Node.js version being used
- The current date and time
- The PORT and NODE_ENV values (with defaults if not set)
- The appConfig object as formatted JSON
