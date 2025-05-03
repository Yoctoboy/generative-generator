import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

const doc = document.getElementById('root');

if (doc === null) {
    throw new Error("Could not find element with id 'root'");
}

createRoot(doc).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
