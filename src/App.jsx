import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Layout from './components/Layout/Layout';
import Dashboard from './routes/Dashboard';
import JsonFormatter from './routes/JsonFormatter';
import SqlFormatter from './routes/SqlFormatter';
import TimestampConverter from './routes/TimestampConverter';
import MarkdownHtml from './routes/MarkdownHtml';
import JsonYaml from './routes/JsonYaml';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
           (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const theme = useMemo(() => isDarkMode ? darkTheme : lightTheme, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/sql-formatter" element={<SqlFormatter />} />
            <Route path="/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/markdown-html" element={<MarkdownHtml />} />
            <Route path="/json-yaml" element={<JsonYaml />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;