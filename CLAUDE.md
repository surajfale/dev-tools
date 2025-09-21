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
```

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