var express = require("express");
var app = express();
var cors = require("cors");
//var fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var client_id = "tsTGKWRX_Nf9Wp_SYMyy";
var client_secret = "y9FiZAMZk8";

app.post("/translate", function(req, res) {
  //const obj = JSON.parse(JSON.stringify(req.body));
  //console.log(obj);
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log(obj);
  console.log(obj.query);
  //var query = "잘가세요";
  var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  var request = require("request");

  var options = {
    url: api_url,
    form: { source: "en", target: "ko", text: obj.query },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };

  request.post(options, function(error, response, body) {
    console.log(body);
    res.send(body);
  });

  // request.post(options, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
  //     res.end(body);
  //     console.log("hi1");
  //     var json = JSON.parse(response.body);
  //     console.log(json.message.result.translatedText);
  //   } else {
  //     res.status(response.statusCode).end();
  //     console.log("error = " + response.statusCode);
  //   }
  // });
});
app.listen(3001, function() {
  console.log("http://127.0.0.1:3001/translate app listening on port 3001!");
});
