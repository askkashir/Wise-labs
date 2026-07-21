import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: StrictMode is intentionally omitted — its double-mount can leave
// react-three-fiber's render loop detached, freezing the hero scene.
createRoot(document.getElementById('root')!).render(<App />)
