import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme.css' // optional: for custom Bootstrap overrides
import './index.css'        // optional: your own styles

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
