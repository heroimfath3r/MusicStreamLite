import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 8080,
  path: '/health',
  timeout: 5000,
  method: 'GET'
};

const request = http.request(options, (res) => {
  console.log(`HEALTH CHECK STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('HEALTH CHECK ERROR:', err);
  process.exit(1);
});

request.on('timeout', () => {
  console.error('HEALTH CHECK TIMEOUT');
  request.destroy();
  process.exit(1);
});

request.end();