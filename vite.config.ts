import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

// Plugin to copy GeoJSON data files to dist/data
function copyGeoJSONPlugin(): Plugin {
  return {
    name: 'copy-geojson',
    closeBundle() {
      const dataDir = resolve(__dirname, 'dist/data');
      mkdirSync(dataDir, { recursive: true });

      const geoFiles = [
        'congressionalDistrictsGeo.json',
        'congressionalDistrictsHex.json',
        'ukConstituenciesGeo.json',
        'ukConstituenciesHex.json',
        'stateSenateDistrictsGeo.json',
        'stateHouseDistrictsGeo.json',
      ];

      for (const file of geoFiles) {
        const src = resolve(__dirname, 'src/visualization/data/json', file);
        const dest = resolve(dataDir, file);
        copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), copyGeoJSONPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
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
