# Manifold

> Manage multiple Linear workspaces from one place. Built for freelancers and software studios.

## Overview

Manifold provides unified access to all your Linear workspaces through:
- **Raycast Extension**: Quick keyboard access to issues across all workspaces
- **MCP Server**: Integrate Linear with AI assistants for automated workflows

## Project Structure

This is a monorepo containing:

```
apps/
├── web/              # Landing page (Next.js)
├── raycast-extension/  # Raycast extension for Linear
└── mcp-server/        # MCP server for Linear integration

packages/
├── ui/               # Shared UI components (shadcn/ui)
├── eslint-config/    # Shared ESLint configuration
└── typescript-config/ # Shared TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 10.4.1
- Raycast (for the extension)

### Installation

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev
```

### Development

- **Web**: http://localhost:3000
- **Raycast**: `pnpm dev` in apps/raycast-extension
- **MCP Server**: `pnpm dev` in apps/mcp-server

## Features

### Raycast Extension
- OAuth authentication for multiple Linear workspaces
- Search issues across all workspaces
- Create issues with smart workspace detection
- Workspace aliases for quick access (@client1, @personal)

### MCP Server
- Full Linear API coverage
- Secure credential management
- Cross-workspace operations
- Compatible with any MCP client (Claude, etc.)

## License

MIT