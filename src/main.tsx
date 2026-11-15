import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerAppServiceWorker} from './pwa/registerSW.ts';

registerAppServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
