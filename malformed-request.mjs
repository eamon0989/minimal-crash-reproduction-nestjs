import { request } from 'http';

const port = 3000;
const boundary = 'AaB03x';
const body = [
  '--' + boundary,
  'Content-Disposition: form-data; name="file"; filename="test.txt"',
  'Content-Type: text/plain',
  '',
  'test without end boundary',
].join('\r\n');
const options = {
  hostname: 'localhost',
  port,
  path: '/upload',
  method: 'POST',
  headers: {
    'content-type': 'multipart/form-data; boundary=' + boundary,
    'content-length': body.length,
  },
};
const req = request(options, (res) => {
  console.log(res.statusCode);
});
req.on('error', (err) => {
  console.error(err);
});
req.write(body);
req.end();
