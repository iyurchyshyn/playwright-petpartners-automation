# Playwright Automation Framework

## Installation
1. Clone the repository:
```sh
    git clone https://github.com/your-repo/playwright-petpartners-automation.git
    cd playwright-petpartners-automation
  ```
2. Install the dependencies:
```sh
    npm install
```
3. Load the environment variables:
```sh
    node loadEnv.js
```

## Running Tests

### Single thread run (use env and tag)
```sh
$env:NODE_ENV="qas"; $env:TAGS="@tag123"; npm run test:env
```
### Parallel run (adjust parallel thread at cucumber.js)
```sh
$env:NODE_ENV="qas"; $env:TAGS="@tag123"; npm run test:env:parallel
```
### Parallel run (or assign at run using global variable $env:PARALLEL_THREADS=2;)
```sh
$env:NODE_ENV="qas"; $env:TAGS="@tag123"; $env:PARALLEL_THREADS=2; npm run test:env:parallel
```

### Specific envitonment (qas, dev, tst only)
```sh
npm run test:tag:qas "@tag123"
npm run test:tag:qas:parallel "@tag123"  --or
$env:PARALLEL_THREADS=2; npm run test:tag:qas:parallel "@tag123"
```

### To generate cucumber report
```sh
npm run report
```
### To clear env variables
```sh
Remove-Item Env:NODE_ENV
Remove-Item Env:TAGS
Remove-Item Env:PARALLEL_THREADS
```