# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based collection of developer utilities including JSON formatter, SQL formatter, timestamp converter, Markdown/HTML converter, and JSON/YAML converter. Built with Vite, Material UI, and modern React patterns.

## Development Commands

```bash
# Install dependencies (use pnpm, the configured package manager)
pnpm install

# Start development server (runs on http://localhost:3000, auto-opens browser)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code (ESLint with React-specific rules)
pnpm lint

# Deploy to Netlify (build + deploy)
pnpm deploy:netlify
```

## Package Manager Configuration

- **Required**: pnpm (configured in `packageManager` field)
- **Node Version**: 18.18.0 (specified in `.nvmrc`)

## Architecture Overview

### Tech Stack
- **React 18** with functional components and hooks
- **Vite** as build tool with React plugin
- **Material UI (MUI) v5** for consistent UI components and theming
- **React Router DOM** for client-side routing
- **ESLint** with React, hooks, and refresh plugins

### Key Libraries
- `sql-formatter` - SQL dialect formatting
- `marked` - Markdown parsing to HTML
- `js-yaml` - YAML parsing and stringification
- `dayjs` - Lightweight date manipulation
- `dompurify` - HTML sanitization for security

### Project Structure

```
src/
├── main.jsx                    # React app entry point
├── App.jsx                     # Main app with routing and theme provider
├── theme.js                    # MUI theme configuration (light/dark)
├── routes/                     # Page-level components
│   ├── Dashboard.jsx           # Tool overview and navigation
│   ├── JsonFormatter.jsx       # JSON formatting with validation
│   ├── SqlFormatter.jsx        # Multi-dialect SQL formatting
│   ├── TimestampConverter.jsx  # Unix/ISO timestamp conversion
│   ├── MarkdownHtml.jsx        # Bidirectional Markdown ↔ HTML
│   └── JsonYaml.jsx            # Bidirectional JSON ↔ YAML
├── components/
│   ├── Layout/                 # App structure components
│   │   ├── Header.jsx          # Top nav with theme toggle
│   │   ├── Sidebar.jsx         # Tool navigation
│   │   ├── Footer.jsx          # Footer with credits
│   │   └── Layout.jsx          # Main layout wrapper
│   └── Common/                 # Reusable utility components
│       ├── CopyButton.jsx      # Clipboard functionality
│       ├── DownloadButton.jsx  # File download
│       ├── ErrorAlert.jsx      # Error display
│       └── SampleInputButton.jsx # Load sample data
└── lib/                        # Business logic utilities
    ├── formatJson.js           # JSON formatting/minifying
    ├── formatSql.js            # SQL dialect formatting
    ├── convertTime.js          # Timestamp conversions
    ├── convertMarkdownHtml.js  # Markdown/HTML bidirectional
    └── convertJsonYaml.js      # JSON/YAML bidirectional
```

### State Management Patterns
- **Theme State**: App-level state with localStorage persistence and system preference detection
- **Tool State**: Local component state using `useState` hooks
- **Form Handling**: Controlled components with validation
- **Error Boundaries**: Material UI error alerts for user feedback

### Common Patterns

#### Tool Component Structure
Each tool follows this pattern:
1. Input textarea with configurable options
2. Processing function with error handling
3. Output display with copy/download actions
4. Sample data button for testing

#### Error Handling
- Use `ErrorAlert` component for user-friendly error display
- Parse library-specific errors (JSON, YAML, SQL syntax)
- Provide actionable error messages with line/column info when available

#### Utility Functions
- Business logic isolated in `src/lib/` modules
- Pure functions that accept input and options, return formatted output
- Consistent error throwing for component error boundaries

### Material UI Integration
- Custom theme with light/dark mode support (`src/theme.js`)
- Responsive breakpoints for mobile/desktop layouts
- Consistent spacing using MUI's spacing system
- Proper ARIA labels and accessibility features

### Performance Considerations
- Components use React.memo where appropriate
- Large text processing is handled synchronously (consider workers for huge files)
- State updates are batched to prevent excessive re-renders
- Material UI components are tree-shaken automatically by Vite

## Development Environment

### Vite Configuration
- Development server configured on port 3000 with auto-open browser
- React plugin with fast refresh enabled
- ESM modules with React 18 support

### Theme System
- Dual theme support (light/dark) with system preference detection
- Theme state persisted in localStorage
- Material UI theming with custom component defaults
- Responsive design breakpoints for mobile/desktop

### Key Development Patterns

#### Adding New Tools
1. Create utility function in `src/lib/` following existing patterns
2. Create route component in `src/routes/` with consistent UI structure
3. Add route to `src/App.jsx` router configuration
4. Update sidebar navigation in `src/components/Layout/Sidebar.jsx`
5. Follow existing patterns for options, error handling, and actions

#### Utility Function Pattern (src/lib/)
All utility functions follow a consistent return pattern:
```javascript
// Success case
{ success: true, result: "formatted output" }

// Error case
{ success: false, error: "Error message", line: "optional position info" }
```

#### Common Component Props
- All tools accept `input` and options via controlled components
- Use Material UI `TextField` with `minRows={12}` for multiline text areas (Material UI automatically enables multiline mode when minRows/maxRows is set)
- Use `ErrorAlert` for consistent error messaging
- Include `CopyButton`, `DownloadButton`, and `SampleInputButton` actions
- Maintain keyboard shortcut support (Ctrl/Cmd+Enter) using `useEffect` with keydown event listener

## Commit Message Guidelines

When making changes to this codebase, always generate conventional commit messages that:

1. **Follow conventional commit format**: `type(scope): description`
2. **Keep messages concise**: Maximum 2 lines, short and to the point
3. **Understand project context**: This is a React + Material-UI developer tools collection with JSON, SQL, timestamp, Markdown/HTML, and JSON/YAML converters
4. **Use appropriate types**:
   - `feat`: New features (components, tools, UI enhancements)
   - `fix`: Bug fixes (UI issues, formatting errors, conversion problems)
   - `style`: UI/styling changes (Material-UI components, responsive design)
   - `refactor`: Code restructuring without functionality changes
   - `docs`: Documentation updates (README, CLAUDE.md, comments)
   - `chore`: Build tools, dependencies, configuration changes

**Examples**:
- `feat(ui): add footer with copyright and GitHub link`
- `fix(layout): improve responsive design for mobile devices`
- `style(footer): position footer at bottom of screen`
- `refactor(components): extract Footer component from App.jsx`

Always consider the app's core features (JSON/SQL formatting, timestamp conversion, Markdown/HTML conversion, JSON/YAML conversion, theme customization) when crafting commit messages.