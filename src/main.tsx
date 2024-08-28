import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url"

import './app.css'

GlobalWorkerOptions.workerSrc = pdfjsWorker

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
