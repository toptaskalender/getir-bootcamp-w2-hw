const http        = require('http');
const fsPromises  = require('fs/promises');

const port  = 3000;

const logRequest = (method, path, httpVersion) => {
  const isValidPath   = ['/', '/about-us', '/contact-us'].includes(path);
  const isValidMethod = method === 'GET' ? true : false;

  let statusCode = 404;
  if (isValidPath && isValidMethod) {
    statusCode = 200;
  }

  const requestedAt = new Date().toISOString();
  const log         = `${method} '${path}' HTTP${httpVersion} ${statusCode} ${requestedAt}\n\n`

  return fsPromises.appendFile(`${__dirname}/log.txt`, log);
}

const printLoggingInfo = err => {
  err 
    ? console.error(`Request Logging Error: ${err.message}`) 
    : console.log('Logged successfuly')
}

const doOnIncoming = (req, res) => {
  const { method, url: path, httpVersion } = req;

  logRequest(method, path, httpVersion)
    .then(printLoggingInfo)
    .catch(printLoggingInfo)

  if (method === 'GET' && path === '/') {
    res
      .writeHead(200, {
        'Content-Type': 'text/plain'
      })
      .end('This is homepage...')
  } 
  else if (method === 'GET' && path === '/about-us') {
    res
      .writeHead(200, {
        'Content-Type': 'text/plain'
      })
      .end('This is about-us page...')
  } 
  else if (method === 'GET' && path === '/contact-us') {
    res
      .writeHead(200, {
        'Content-Type': 'text/plain'
      })
      .end('This is contact-us page...')
  } 
  else {
    res
      .writeHead(404, {
        'Content-Type': 'text/plain'
      })
      .end('Cannot find the page...')
  }
}

const server = http.createServer(doOnIncoming);

server.listen(port, () => {
  console.log(`Server listening on port: ${port} 🖐`);
});