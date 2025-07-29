module.exports = {
  apps: [{
    name: 'courseware-generator-backend',
    script: './backend/enhanced-server.js',
    cwd: '/var/www/courseware-generator',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: './backend/.env',
    log_file: '/var/www/courseware-generator/logs/app.log',
    out_file: '/var/www/courseware-generator/logs/out.log',
    error_file: '/var/www/courseware-generator/logs/error.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    user: 'courseware',
    
    // 重启策略
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};