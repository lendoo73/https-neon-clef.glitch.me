// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require("cors");
app.use(cors({
  optionSuccessStatus: 200
}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// create result object which is what will be returned by our API:
const createResultObject = () => {
  return {
    "unix": null, 
    "utc": null
  };
};

// 1. Set the API endpoint:
const endpoint = "/api/timestamp/";

const sendResult = (timestamp, response) => {
  
  const result = createResultObject();
   // create a new Date object using  the above timestamp:
  const date = new Date(timestamp);
    
  // set "unix" value in our result object:
  result.unix = timestamp;
    
  // build "utc" value in result object:
  result.utc = date.toUTCString();

  // send this response back to the browser:
  response.send(result);
};

// 3. If the date_string is empty... :
app.get(endpoint, (request, response) => {
  sendResult(Date.now(), response);
});

app.get(`${endpoint}:date_string`, (request, response) => {
  //console.log(request.headers);
  const ip = request.headers["x-forwarded-for"].split(",")[0];
  console.log(ip);
// 2. Check for valid date_string:
  // set timestamp to a variable: sended as a string, so we have to change the type to Number
  let timestamp = + request.params.date_string;
  
  // check if the timestamp is invalid:
  if (!(timestamp) && timestamp !== 0) {
    timestamp = Date.parse(request.params.date_string); // set the timestamp from ISO format
  }
  
  // 5. check if the timestamp still invalid (neighter number nor ISO format...)
  if (!(timestamp) && timestamp !== 0) {
    response.send({
      error: "Invalid Date"
    });
    //console.log(request.params.date_string);
    return;
  }
  
  // 4. From here we have a valid timestamp:
  sendResult(timestamp, response);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
