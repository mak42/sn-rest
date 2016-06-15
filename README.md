# sn-rest
NodeJS Rest-Client for Service-Now

# Sample Usage
```javascript
var snRest = require('sn-rest');
var $sn = snRest({
  'host': 'demo01.service-now.com',
  'user': 'admin',
  'pass': 'admin'
});
$sn('incident').getRecord('216930c737bf5600dce1c2f954990eb6', function(error, result) {
  if(error) {
    console.log(error);
    return;
  }
  //result is always an array of objects
  console.log('result-length: ' + result.length);
  console.log('caller_id: ' + result[0].caller_id);

  //Simple dotWalking
  result[0].caller_id.dotWalk('sys_user', function(err, result) {
    console.log('caller_name: ' + result[0].name);
  });
});
```
