// Vercel Node.js serverless entry point.
// Express handles the REST routes defined in backend/app.js.
const app = require("../backend/app");

module.exports = app;