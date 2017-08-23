fh-millicore-client
===================
Standalone js client for interacting with

##Usage
   
   var millicore = require('fh-millicore-client')({
     "url": "https://localhost",
      "serviceKey": "1a",
      "apiKey": "2b",
      "scheme": "http://"
   }); 
   // example millicore app props read. Req is express request obj
   millicore.appprops.read(req, guid, function(err, appProps){
     
   });
   

## Tests
###Unit
    
    npm test
    
###Acceptance
    
    export FH_COOKIE="get this from the studio";
    export NODE_TLS_REJECT_UNAUTHORIZED=0; 
    ./node_modules/.bin/mocha -A -u exports --recursive -t 10000 ./test/accept;
    
