# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based collection of developer utilities including JSON formatter, SQL formatter, timestamp converter, Markdown/HTML converter, JSON/YAML converter, HTML preview with cloud sharing, and math calculator. Built with Vite, Material UI, and modern React patterns.

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

# Run the unit test suite (Vitest, jsdom environment)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Deploy to Netlify (build + deploy)
pnpm deploy:netlify
```

## Package Manager Configuration

- **Required**: pnpm (configured in `packageManager` field)
- **Node Version**: 20.20.2 (specified in `.nvmrc`; required by react-router-dom v7)

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
│   ├── JsonYaml.jsx            # Bidirectional JSON ↔ YAML
│   ├── HtmlPreview.jsx         # HTML preview with cloud upload
│   ├── MathCalculator.jsx      # Math calculator for summing numbers
│   └── SharedPreview.jsx       # Shareable HTML preview page
├── components/
│   ├── Layout/                 # App structure components
│   │   ├── Header.jsx          # Top nav with theme toggle
│   │   ├── Sidebar.jsx         # Tool navigation
│   │   ├── Footer.jsx          # Footer with credits
│   │   ├── toolRegistry.jsx    # Single source of truth for tool metadata
│   │   ├── BootSequence.jsx    # Once-per-session intro overlay
│   │   ├── SettingsMenu.jsx    # Header settings menu (output typing mode)
│   │   └── Layout.jsx          # Main layout wrapper
│   └── Common/                 # Reusable utility components
│       ├── CopyButton.jsx      # Clipboard functionality
│       ├── DownloadButton.jsx  # File download
│       ├── ErrorAlert.jsx      # Error display
│       ├── PageHeader.jsx      # Spec-sheet tool header (T/0n, title, kbd hint)
│       ├── CodeBlock.jsx       # Syntax-highlighted output with typing reveal
│       ├── OrbitRings.jsx      # Decorative orbit diagram (dashboard hero)
│       ├── SettingsProvider.jsx # User settings state + localStorage sync
│       ├── settingsContext.js  # SettingsContext + useSettings() hook
│       └── SampleInputButton.jsx # Load sample data
└── lib/                        # Business logic utilities
    ├── formatJson.js           # JSON formatting/minifying
    ├── formatSql.js            # SQL dialect formatting
    ├── convertTime.js          # Timestamp conversions
    ├── convertMarkdownHtml.js  # Markdown/HTML bidirectional
    ├── convertJsonYaml.js      # JSON/YAML bidirectional
    ├── previewHtml.js          # HTML sanitization for preview
    ├── minifyHtml.js           # HTML minification (30-60% reduction)
    ├── uploadHtml.js           # Cloud upload to pastebin services
    ├── calculateSum.js         # Math calculation utilities
    ├── settings.js             # Settings defaults, validation, persistence
    └── typewriter.js           # Output reveal timing + reduced-motion check
```

### State Management Patterns
- **Theme State**: App-level state with localStorage persistence and system preference detection
- **User Settings**: `SettingsProvider` (wraps the router in `App.jsx`) holds non-theme preferences, persisted to localStorage under `devtools-settings`; read them with `useSettings()` from `components/Common/settingsContext.js`. Validation/persistence helpers are pure functions in `src/lib/settings.js`. UI lives in `Layout/SettingsMenu.jsx` (header). Add new preferences to `normalizeSettings()` so bad stored values fall back to defaults
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

### Visual Design System ("Mission Control")
- Restrained HUD look defined in `src/theme.js`: graphite (dark) / blueprint (light) grounds, 1px hairline rules, 0px radii, bracketed corners (`bracketBackground()` helper) instead of full boxes, 32px plotting-grid body background, no drop shadows except on overlays
- Fonts (loaded in `index.html`): Saira variable (display, condensed via `fontStretch`), IBM Plex Sans (body), JetBrains Mono (labels, buttons, code) — exported as `FONT_DISPLAY` / `FONT_BODY` / `FONT_MONO`
- Palette: `primary` = ink, `secondary` = amber safe for text, `accent` = amber `#FFB020` for FILLS ONLY (always with `accent.contrastText`), raw tokens on `theme.palette.tokens` (usable in `sx`, e.g. `borderColor: 'tokens.rule'`)
- Motion lives in three components only, and all of them respect `prefers-reduced-motion`:
  - `Layout/BootSequence.jsx` — ~1s intro, once per browser session (sessionStorage), any key/click skips
  - `Common/OrbitRings.jsx` — decorative orbit diagram on the dashboard (aria-hidden)
  - `Common/CodeBlock.jsx` — new output types in line by line; timing planned by `src/lib/typewriter.js` (≈700ms, ≤40 re-renders, skipped above 200 lines). Governed by the user's **Output typing** setting (`auto` follows reduced-motion, `always`, `off`)
- Tool metadata (number, tag, title, description, icon) lives in `src/components/Layout/toolRegistry.jsx` — consumed by Sidebar, Dashboard and `PageHeader`
- Every tool page starts with `<PageHeader title="…">description</PageHeader>` (`src/components/Common/PageHeader.jsx`)
- Copy uses dry system-status wording (`SYS.NOMINAL · 0 uplinks`)
- Don't hardcode colors/radii/shadows in components; check new color pairs for WCAG AA in both modes

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
4. Register the tool in `src/components/Layout/toolRegistry.jsx` (drives sidebar, dashboard grid, and page header numbering)
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
3. **Understand project context**: This is a React + Material-UI developer tools collection with JSON, SQL, timestamp, Markdown/HTML, JSON/YAML converters, HTML preview with cloud sharing, and math calculator
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

Always consider the app's core features (JSON/SQL formatting, timestamp conversion, Markdown/HTML conversion, JSON/YAML conversion, HTML preview with cloud sharing, math calculator, theme customization) when crafting commit messages.

## Additional Tool-Specific Patterns

### HTML Preview Tool
- 100% client-side: nothing is ever sent to a server or a third party. Do not reintroduce a cloud-upload/pastebin feature — it was deliberately removed for this reason.
- Uses iframe with `sandbox="allow-scripts"` (no `allow-same-origin`) so previewed HTML runs in an isolated opaque origin and cannot reach into the app's own origin/storage
- Shareable links embed minified HTML directly in the URL (`/preview?content=<base64>`) via `src/lib/minifyHtml.js` — reduces size 30-60% to fit the ~8000 char URL limit
- Privacy notice displayed to users: content lives entirely in the URL, so anyone with the link can see it

### Math Calculator
- Parses numbers separated by comma, space, or newline
- Returns object with sum, count, average, min, max, and numbers array
- All calculations handled in `src/lib/calculateSum.js`
- Results displayed in card-based UI with copy functionality