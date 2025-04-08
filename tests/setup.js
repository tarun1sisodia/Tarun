// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Keep error and warning logs for debugging
console.error = console.error;
console.warn = console.warn;
