const fs = require('fs');
const path = require('path');

function loadEnvironmentVariables() {
  const env = process.env.NODE_ENV || 'QAS';
  const envFilePath = path.resolve(__dirname, 'environments', `.env.${env}`);

  if (fs.existsSync(envFilePath)) {
    const envConfig = fs.readFileSync(envFilePath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
    console.log(`Loaded environment variables from ${envFilePath}`);
    console.log(`BASE_URL: ${process.env.BASE_URL}`);
  } else {
    console.error(`Environment file for ${env} not found: ${envFilePath}`);
    process.exit(1);
  }
}

module.exports = { loadEnvironmentVariables };