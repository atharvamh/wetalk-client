import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import { ThemeProvider } from './context/themeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
