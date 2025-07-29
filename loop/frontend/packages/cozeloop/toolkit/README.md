# @cozeloop/toolkit

Toolkit For Devops

## Overview

This package is part of the Coze Loop monorepo and provides utilities functionality. It serves as a core component in the Coze Loop ecosystem.

## Getting Started

### Installation

Add this package to your `package.json`:

```json
{
  "dependencies": {
    "@cozeloop/toolkit": "workspace:*"
  }
}
```

Then run:

```bash
rush update
```

### Usage

```typescript
import { /* exported functions/components */ } from '@cozeloop/toolkit';

// Example usage
// TODO: Add specific usage examples
```

## Features

- Core functionality for Coze Loop
- TypeScript support
- Modern ES modules

## API Reference

### Exports

- `openWindow, relaunchWindow, getFullURL`
- `notEmpty`
- `getSafeFileName`
- `formatTimestampToString,
  safeParseJson,
  formateMsToSeconds,`
- `CozeLoopStorage`
- `type LocalStorageKeys`
- `formatNumberWithCommas,
  formatNumberInThousands,
  formatNumberInMillions,`
- `safeJsonParse`
- `fileDownload`


For detailed API documentation, please refer to the TypeScript definitions.

## Development

This package is built with:

- TypeScript
- Modern JavaScript
- Vitest for testing
- ESLint for code quality

## Contributing

This package is part of the Coze Loop monorepo. Please follow the monorepo contribution guidelines.

## License

Apache-2.0
