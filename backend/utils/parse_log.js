const fs = require("fs");

const logs = fs.readFileSync("request.log", "utf8").split("\n");

logs.forEach((log) => {
  if (log) {
    const parsed = JSON.parse(log);
    console.log(`Level: ${parsed.level}`);
    console.log(`Message: ${parsed.message}`);
    console.log(`Method: ${parsed.meta.req.method}`);
    console.log(`URL: ${parsed.meta.req.originalUrl}`);
    console.log(`Status: ${parsed.meta.res.statusCode}`);
    console.log("---");
  }
});
