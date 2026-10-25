import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // *.network.test.ts files read other repositories over the internet, so
    // `bun run test` skips them; `bun run test:network` runs them.
    exclude: process.env.VITEST_NETWORK
      ? configDefaults.exclude
      : [...configDefaults.exclude, '**/*.network.test.ts'],
  },
});
