# MCP Agent Automation - Playwright Project

This is a Playwright automation testing project for MCP Agent testing.

## Installation

1. Install dependencies:
```bash
npm install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in UI mode:
```bash
npm run test:ui
```

### Run tests in headed mode (see browser):
```bash
npm run test:headed
```

### Debug tests:
```bash
npm run test:debug
```

### Generate tests with Codegen:
```bash
npm run codegen
```

## Project Structure

- `tests/` - Test files (*.spec.ts)
- `playwright.config.ts` - Playwright configuration
- `package.json` - Project dependencies and scripts

## Configuration

Edit `playwright.config.ts` to customize:
- Browser types (Chromium, Firefox, WebKit)
- Test retries and parallelization
- Base URL
- Reporters and trace collection

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Framework](https://playwright.dev/docs/intro)
