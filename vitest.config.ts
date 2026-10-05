import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},test:{environment:'jsdom',include:['tests/**/*.test.{ts,tsx}'],setupFiles:['tests/setup.ts']}});
