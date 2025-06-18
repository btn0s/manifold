# Manifold for Linear - Raycast Extension

Manage multiple Linear workspaces from a single Raycast command palette.

## Setup

### 1. Create a Linear OAuth Application

1. Go to [Linear API Settings](https://linear.app/settings/api)
2. Click "Create new OAuth2 application"
3. Fill in the following:
   - **Application name**: Manifold for Linear
   - **Description**: Manage multiple Linear workspaces from Raycast
   - **Redirect URI**: Use this URL:
     - `https://raycast.com/redirect/extension`
     - Note: Linear may not accept query parameters in redirect URIs
   - **Webhook URL**: (leave empty)
4. Click "Create" and copy the **Client ID**

### 2. Configure the Extension

1. Open `src/add-workspace.tsx`
2. Replace `YOUR_LINEAR_CLIENT_ID` with your actual Client ID:
   ```typescript
   const clientId = "your-actual-client-id-here";
   ```

### 3. Build and Install

```bash
npm install
npm run build
```

Then open the extension in Raycast.

## Features

- **Create Issue**: Type `create <title>` to quickly create issues
- **Multiple Workspaces**: Connect and manage multiple Linear workspaces
- **Workspace Aliases**: Set aliases like `@client1` for quick access
- **Recent Issues**: View recent issues across all workspaces
- **Automatic URL Copy**: Created issue URLs are copied to clipboard

## Usage

1. **Add Workspace**: Run "Add Linear Workspace" command
2. **Create Issue**: Type `create Fix the bug` and fill the form
3. **Manage Workspaces**: Edit aliases or remove workspaces

## Development

```bash
npm run dev  # Start in development mode
npm run build  # Build for production
```