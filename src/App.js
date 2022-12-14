// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import Messages from "./components/Messages/Messages";
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
        <Messages />
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
