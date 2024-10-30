import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { stylex } from 'vite-plugin-stylex-dev'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact(), stylex()],
});
