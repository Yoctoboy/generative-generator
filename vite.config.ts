import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: '127.0.0.1',
        strictPort: true,
        hmr: { host: '127.0.0.1', clientPort: 5173, port: 5173 },
    },
    plugins: [react()],
});
