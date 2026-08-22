import { useState, useMemo, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Layout from './components/Layout/Layout';
import Dashboard from './routes/Dashboard';

const JsonFormatter = lazy(() => import('./routes/JsonFormatter'));
const SqlFormatter = lazy(() => import('./routes/SqlFormatter'));
const TimestampConverter = lazy(() => import('./routes/TimestampConverter'));
const MarkdownHtml = lazy(() => import('./routes/MarkdownHtml'));
const JsonYaml = lazy(() => import('./routes/JsonYaml'));
const HtmlPreview = lazy(() => import('./routes/HtmlPreview'));
const MathCalculator = lazy(() => import('./routes/MathCalculator'));
const SharedPreview = lazy(() => import('./routes/SharedPreview'));

function RouteFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
      <CircularProgress size={32} />
    </Box>
  );
}

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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/preview" element={<SharedPreview />} />
            <Route path="*" element={
              <Layout isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle}>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/json-formatter" element={<JsonFormatter />} />
                    <Route path="/sql-formatter" element={<SqlFormatter />} />
                    <Route path="/timestamp-converter" element={<TimestampConverter />} />
                    <Route path="/markdown-html" element={<MarkdownHtml />} />
                    <Route path="/json-yaml" element={<JsonYaml />} />
                    <Route path="/html-preview" element={<HtmlPreview />} />
                    <Route path="/math-calculator" element={<MathCalculator />} />
                  </Routes>
                </Suspense>
              </Layout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
