module.exports = {
  apps: [
    {
      name: 'demo-api',
      script: 'dist/main.js',
      // Cluster usa todos los cores (bueno para APIs sin estado)
      exec_mode: 'cluster',
      instances: 'max',
      // Puerto por env (Nest lee process.env.PORT)
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        // Habilita sourcemaps en logs si compilaste con maps
        NODE_OPTIONS: '--enable-source-maps'
      },
      // Salud y autorestart
      watch: false,
      max_memory_restart: '512M',
      // Retraso entre restart para evitar loops
      exp_backoff_restart_delay: 200
    }
  ]
}
