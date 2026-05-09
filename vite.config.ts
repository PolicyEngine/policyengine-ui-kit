import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        primitives: resolve(__dirname, 'src/primitives/index.ts'),
        charts: resolve(__dirname, 'src/charts/index.ts'),
        visualization: resolve(__dirname, 'src/visualization/index.ts'),
        layout: resolve(__dirname, 'src/layout/index.ts'),
        inputs: resolve(__dirname, 'src/inputs/index.ts'),
        display: resolve(__dirname, 'src/display/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts'),
        assets: resolve(__dirname, 'src/assets/index.ts'),
        // Legacy compat surface mirroring @policyengine/design-system. See
        // src/legacy/index.ts for the migration map.
        legacy: resolve(__dirname, 'src/legacy/index.ts'),
        'legacy/tokens': resolve(__dirname, 'src/legacy/tokens/index.ts'),
        'legacy/tokens/colors': resolve(__dirname, 'src/legacy/tokens/colors.ts'),
        'legacy/tokens/typography': resolve(__dirname, 'src/legacy/tokens/typography.ts'),
        'legacy/tokens/spacing': resolve(__dirname, 'src/legacy/tokens/spacing.ts'),
        'legacy/charts': resolve(__dirname, 'src/legacy/charts/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'recharts',
      ],
    },
    cssCodeSplit: false,
  },
});
