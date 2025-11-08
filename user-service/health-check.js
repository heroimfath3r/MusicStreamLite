import http from 'http';

const options = {
  host: 'localhost',
  port: 3002,
  path: '/health',
  timeout: 2000
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

request.end();