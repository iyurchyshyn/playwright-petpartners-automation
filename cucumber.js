// require('ts-node/register');
// const { loadEnvironmentVariables } = require('./loadEnv');
// loadEnvironmentVariables();

// const common = {
//   requireModule: ['ts-node/register'],
//   require: [
//     'src/common/helper/*.ts',
//     'src/test/steps/**/*.ts'
//   ],
//   formatOptions: {
//     snippetInterface: 'async-await'
//   },
//   dryRun: false,
//   strict: true,
//   paths: ['src/test/features/**/*.feature']
// };

// const PARALLEL_THREADS = 4;
// const TIMEOUT = 6 * 60 * 1000;

// module.exports = {
//   default: {
//     ...common,
//     format: [
//       'progress-bar',
//       `json:reports/cucumber-report.json`,
//       `html:reports/cucumber-report.html`
//     ],
//     parallel: 1,
//     worldParameters: {
//       baseUrl: process.env.BASE_URL,
//       environment: process.env.ENVIRONMENT,
//       timeout: TIMEOUT
//     }
//   },
//   parallel: {
//     ...common,
//     format: [
//       'progress-bar',
//       `json:reports/parallel-report.json`,
//       `html:reports/parallel-report.html`
//     ],
//     parallel: PARALLEL_THREADS || 3,
//     worldParameters: {
//       baseUrl: process.env.BASE_URL,
//       environment: process.env.ENVIRONMENT,
//       timeout: TIMEOUT
//     }
//   }
// };
require('ts-node/register');
const { loadEnvironmentVariables } = require('./loadEnv');
loadEnvironmentVariables();

const common = {
  requireModule: ['ts-node/register'],
  require: [
    'src/common/helper/*.ts',
    'src/test/steps/**/*.ts'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  dryRun: false,
  strict: true,
  paths: ['src/test/features/**/*.feature'],
  tags: process.env.TAGS || ''  // Add support for tags from environment variable
};

const PARALLEL_THREADS = 4;
const TIMEOUT = 6 * 60 * 1000;

module.exports = {
  default: {
    ...common,
    format: [
      'progress-bar',
      `json:reports/cucumber-report.json`,
      `html:reports/cucumber-report.html`
    ],
    parallel: 1,
    worldParameters: {
      baseUrl: process.env.BASE_URL,
      environment: process.env.ENVIRONMENT,
      timeout: TIMEOUT
    }
  },
  parallel: {
    ...common,
    format: [
      'progress-bar',
      `json:reports/parallel-report.json`,
      `html:reports/parallel-report.html`
    ],
    parallel: PARALLEL_THREADS || 3,
    worldParameters: {
      baseUrl: process.env.BASE_URL,
      environment: process.env.ENVIRONMENT,
      timeout: TIMEOUT
    }
  }
};