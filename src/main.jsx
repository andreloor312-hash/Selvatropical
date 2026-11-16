import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './index.css';
import './styles/animations.css';
import App from './App';

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'lg',
  fontFamily:
    "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  headings: {
    fontFamily:
      "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontWeight: '800',
  },
  colors: {
    teal: [
      '#e6f6ef',
      '#d0ecdf',
      '#a3d9c1',
      '#74c5a2',
      '#4fb489',
      '#36a878',
      '#099268',
      '#087f5b',
      '#06694c',
      '#04523c',
    ],
  },
  components: {
    Button: {
      defaultProps: { radius: 'xl' },
    },
    Card: {
      defaultProps: { radius: 'lg' },
    },
    Paper: {
      defaultProps: { radius: 'lg' },
    },
    Modal: {
      defaultProps: { radius: 'lg', overlayProps: { blur: 4, backgroundOpacity: 0.45 } },
    },
    Badge: {
      defaultProps: { radius: 'sm' },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
