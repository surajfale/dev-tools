# Netlify Deployment Guide

This static React application is optimized for deployment on Netlify.

## Automatic Deployment (Recommended)

1. **Connect GitHub Repository**:
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Connect your GitHub account and select this repository
   - Netlify will automatically detect the configuration from `netlify.toml`

2. **Build Settings** (auto-configured):
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Node version: 18

## Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (from project root)
pnpm deploy:netlify
```

## Environment Variables

This application doesn't require any environment variables. All processing happens client-side in the browser.

## Build Process

1. Install dependencies with `pnpm install`
2. Build static assets with `pnpm build`
3. Serve from `dist` directory

## Features

- **Automatic HTTPS** - SSL certificates automatically provisioned
- **Custom Domains** - Easy custom domain configuration
- **Global CDN** - Fast content delivery worldwide
- **SPA Routing** - Configured for React Router client-side routing
- **Deploy Previews** - Automatic preview builds for pull requests

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure Node.js version is 16+
   - Check that all dependencies are properly listed in `package.json`
   - Verify pnpm is available (Netlify supports it natively)

2. **Routing Issues**:
   - The `netlify.toml` configures SPA routing with fallback to `index.html`
   - React Router handles all client-side routing

3. **Performance**:
   - The app is fully static with no server-side processing
   - All developer tools run entirely in the browser
   - Large file processing may hit browser memory limits (10MB+ files)

## Development Preview

Test your deployment locally:

```bash
# Build and preview
pnpm build
pnpm preview

# Or use Netlify dev for local development with functions simulation
netlify dev
```