module.exports = {
  apps: [{
    name: 'webkoth',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/webkoth',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Prefer IPv4 in DNS resolution — outgoing IPv6 to api.telegram.org
      // is blocked from RU hosting; default Happy Eyeballs sometimes picks
      // v6 first and ETIMEDOUT'es the Telegram lead-form delivery.
      NODE_OPTIONS: '--dns-result-order=ipv4first'
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
