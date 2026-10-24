import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
 base:'./',publicDir:'public',
 build:{outDir:'dist-react',emptyOutDir:true,rollupOptions:{input:fileURLToPath(new URL('./index.react.html',import.meta.url))}}
});
