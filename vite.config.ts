import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

function preserveClientDirectives(): Plugin {
  return {
    name: 'preserve-client-directives',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue;

        const isClientEntry =
          chunk.facadeModuleId?.endsWith('/src/index.ts') ||
          chunk.facadeModuleId?.endsWith('/src/layout/index.ts');
        const hasClientLayoutModule = chunk.moduleIds.some(
          (id) =>
            id.includes('/src/layout/PolicyEngine') ||
            id.includes('/src/layout/header/'),
        );

        if ((isClientEntry || hasClientLayoutModule) && !chunk.code.startsWith('"use client";')) {
          chunk.code = `"use client";\n${chunk.code}`;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), preserveClientDirectives()],
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
