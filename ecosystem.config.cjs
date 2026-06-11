module.exports = {
  apps: [
    {
      name: 'drwa-frontend',
      exec_mode: 'cluster', // Wykorzysta zasoby Twojego VPS-1
      instances: 'max',
      script: './.output/server/index.mjs', // Ścieżka do zbudowanego Nuxt 4
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
        DIRECTUS_URL: 'http://127.0.0.1:8055' // Adres do Directusa na tym samym VPS
      }
    }
  ]
}