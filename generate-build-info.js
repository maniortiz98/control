const fs = require("fs");
const path = require("path");
const packageJson = require("./package.json");

const environment = process.env.BUILD_ENV || "development";
const buildTimestampUtc = process.env.BUILD_TIMESTAMP
  ? new Date(process.env.BUILD_TIMESTAMP)
  : new Date();

if (isNaN(buildTimestampUtc.getTime())) {
  console.warn("Invalid BUILD_TIMESTAMP. Using current date.");
}

let buildDateCdmx;
try {
  buildDateCdmx = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Mexico_City",
  }).format(buildTimestampUtc);
} catch {
  buildDateCdmx = buildTimestampUtc.toISOString();
}

const buildInfo = {
  appVersion: packageJson.version,
  buildDate: buildDateCdmx,
  environment
};

const assetsDir = path.join(__dirname, "src", "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const outPath = path.join(assetsDir, "build-info.json");
fs.writeFileSync(outPath, JSON.stringify(buildInfo, null, 2), "utf8");

console.log(
  `build-info.json generated:\n` +
    `Version: ${buildInfo.appVersion}\n` +
    `Date: ${buildInfo.buildDate}\n` +
    `Environment: ${buildInfo.environment}\n`
);
