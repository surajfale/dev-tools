# Developer Tools

A comprehensive collection of essential developer utilities built with React, Vite, and Material UI. This application provides a clean, responsive interface for common development tasks including JSON formatting, SQL formatting, timestamp conversion, and format conversions.

## Features

### 🔧 Available Tools

1. **JSON Formatter**
   - Format and beautify JSON with customizable indentation (2 or 4 spaces)
   - Minify JSON for production use
   - Sort object keys alphabetically
   - Comprehensive error reporting with position information
   - Sample data for quick testing

2. **SQL Formatter**
   - Support for multiple SQL dialects (Standard SQL, MySQL, PostgreSQL, SQLite, PL/SQL, T-SQL)
   - Configurable keyword casing (uppercase/lowercase)
   - Adjustable indentation settings
   - Handles complex queries with joins, subqueries, and CTEs

3. **Timestamp Converter**
   - Convert between Unix seconds, Unix milliseconds, and ISO 8601 formats
   - Display in both local time and UTC
   - Live current timestamp display
   - "Now" button for quick current time insertion
   - Automatic input type detection

4. **Markdown ↔ HTML Converter**
   - Bidirectional conversion between Markdown and HTML
   - Live HTML preview for Markdown input
   - DOMPurify integration for safe HTML sanitization
   - Support for tables, code blocks, lists, and inline formatting

5. **JSON ↔ YAML Converter**
   - Bidirectional conversion between JSON and YAML
   - Configurable JSON formatting options
   - Validation and error reporting for both formats
   - Preserves data types and structure

### ✨ User Experience Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Keyboard Shortcuts**: Ctrl/Cmd+Enter to format/convert in any tool
- **Copy to Clipboard**: One-click copying of results
- **Download Files**: Save results as appropriately named files
- **Sample Data**: Pre-loaded examples for quick testing
- **Error Handling**: Clear, actionable error messages
- **Accessibility**: ARIA labels, focus management, and screen reader support

## Tech Stack

- **Frontend**: React 18 with JSX
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Material UI (MUI) v5 for consistent design
- **Routing**: React Router DOM for client-side navigation
- **Package Manager**: pnpm for efficient dependency management
- **Parsing Libraries**:
  - `sql-formatter` for SQL formatting
  - `marked` for Markdown parsing
  - `js-yaml` for YAML processing
  - `dayjs` for date/time manipulation
  - `dompurify` for HTML sanitization

## Setup and Installation

### Prerequisites

- Node.js 16+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dev-tools

# Install dependencies with pnpm
pnpm install

# Or with npm
npm install
```

### Development

```bash
# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code (if configured)
pnpm lint
```

## Project Structure

```
src/
├── main.jsx                 # Application entry point
├── App.jsx                  # Main app component with routing
├── theme.js                 # Material UI theme configuration
├── routes/                  # Page components
│   ├── Dashboard.jsx        # Homepage with tool overview
│   ├── JsonFormatter.jsx    # JSON formatting tool
│   ├── SqlFormatter.jsx     # SQL formatting tool
│   ├── TimestampConverter.jsx # Timestamp conversion tool
│   ├── MarkdownHtml.jsx     # Markdown/HTML converter
│   └── JsonYaml.jsx         # JSON/YAML converter
├── components/
│   ├── Layout/              # Layout components
│   │   ├── Header.jsx       # Top navigation bar
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Footer.jsx       # Footer component
│   │   └── Layout.jsx       # Main layout wrapper
│   └── Common/              # Reusable components
│       ├── CopyButton.jsx   # Copy to clipboard functionality
│       ├── DownloadButton.jsx # File download functionality
│       ├── ErrorAlert.jsx   # Error display component
│       └── SampleInputButton.jsx # Sample data loader
└── lib/                     # Utility functions
    ├── formatJson.js        # JSON formatting logic
    ├── formatSql.js         # SQL formatting logic
    ├── convertTime.js       # Timestamp conversion logic
    ├── convertMarkdownHtml.js # Markdown/HTML conversion
    └── convertJsonYaml.js   # JSON/YAML conversion
```

## Usage Instructions

1. **Navigate**: Use the sidebar to switch between tools or start from the Dashboard
2. **Input**: Paste or type your data in the input area
3. **Configure**: Adjust formatting options using the controls above the input
4. **Process**: Click the main action button or use Ctrl/Cmd+Enter
5. **Export**: Copy results to clipboard or download as files
6. **Sample**: Use the "Sample" button to load example data for testing

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- High contrast mode support
- Focus management for interactive elements
- Error announcements for assistive technologies

## Performance Considerations

- Code splitting for optimal loading
- Efficient state management with React hooks
- Minimal re-renders through proper memoization
- Optimized Material UI theme configuration
- Lazy loading of heavy parsing libraries where possible

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Limitations

- Large files (>10MB) may cause performance issues in browsers
- HTML to Markdown conversion uses basic regex patterns (not AST-based)
- Some advanced YAML features (anchors, custom tags) may not convert perfectly
- File downloads use browser's default download location

---

Built with ❤️ using React, Vite, and Material UI