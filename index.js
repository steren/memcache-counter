const express = require('express');
const app = express();
const Memcached = require('memcached');
console.log(`connecting to memcache: ${process.env.MEMCACHE_ENDPOINT}`)
const memcached = new Memcached(process.env.MEMCACHE_ENDPOINT);

const counterKey = 'counter'

console.log('Initializing counter');
memcached.add(counterKey, 0, 3600, function (err) { 
  if(err) {
    console.error('Error initializing counter:');
    console.error(err);
  }
 });

app.get('/', (req, res) => {
  console.log('I received a request.');

  memcached.incr(counterKey, 1, function (err) {
    if(err) {console.error(err)};
  });
  memcached.get(counterKey, function (err, data) {
    if(err) {console.error(err);}
    res.send(`This page has been viewed ${data} times in the last hour!`);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('I\'m listening on port', port);
});
