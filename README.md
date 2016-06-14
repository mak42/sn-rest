# sn-rest
NodeJS Rest-Client for Service-Now

# Sample Usage
```javascript
var snRest = require('sn-rest');
var snClient = snRest({
  'host': 'demo01.service-now.com',
  'user': 'admin',
  'pass': 'admin',
  'protocol': 'https'
});
snClient('incident').getRecord('yourSysId', function(error, result) {
  if(error) {
    console.log(error);
    return;
  }
  console.log(result);
});
```
