import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const envFileKeys = [
  "AIRTABLE_API_KEY",
  "AIRTABLE_BASE_ID",
  "JWT_KEY",
  "JWT_TIME"
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = {};
  envFileKeys.forEach(key => processEnv[key] = env[key]);
  return {
    define: {
      'process.env': processEnv
    },
    plugins: [
      vue(),
    ]
  }
})
