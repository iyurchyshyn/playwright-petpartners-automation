```sh
# Playwright Automation Framework

## Installation

1. Clone the repository:
    git clone https://github.com/your-repo/playwright-petpartners-automation.git
    cd playwright-petpartners-automation

2. Install the dependencies:
    npm install
    

3. Load the environment variables:
    node loadEnv.js
    

## Running Tests

### Single thread run (use env and tag)
$env:NODE_ENV="qas"; $env:TAGS="@tag123"; npm run test:env

### Parallel run (adjust parallel thread at cucumber.js)
$env:NODE_ENV="qas"; $env:TAGS="@tag123"; npm run test:env:parallel

### Specific envitonment (qas, dev, tst only)
npm run test:tag:qas "@tag123"
npm run test:tag:qas:parallel "@tag123"