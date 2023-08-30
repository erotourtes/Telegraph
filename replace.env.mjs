import fs from "fs";

const envFile = "./backend/.env"
const templateFile = "./docker-compose.yml"
const outputFile = "./docker-compose.local.yml"

// Read .env file
const envData = fs.readFileSync(envFile, "utf8");
const envVariables = envData.split("\n").reduce((acc, line) => {
  const [key, value] = line.split("=");
  if (key && value) acc[key] = value;
  return acc;
}, {});

// Read template file
const template = fs.readFileSync(templateFile, "utf8");

// Replace placeholders
const replacedTemplate = template.replace(/\${(.*?)}/g, (match, variable) => {
  return envVariables[variable] || match;
});

// Write replaced template to a new file
fs.writeFileSync(outputFile, replacedTemplate, "utf8");

console.log(`Template replaced and saved to ${outputFile}`);
