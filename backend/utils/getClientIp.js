const ipaddr = require('ipaddr.js');

function getClientIp(ip) {

  if (ipaddr.isValid(ip) && ipaddr.parse(ip).kind() === 'ipv6') {
    const addr = ipaddr.parse(ip);
    if (addr.isIPv4MappedAddress()) {
      ip = addr.toIPv4Address().toString();
    }
  }

  if (ip === '::1') ip = '127.0.0.1';

  return ip;
}

module.exports = getClientIp;