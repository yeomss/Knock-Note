var express = require("express");
var cors = require("cors");
var app = express();
var client_id = "92iZUSj8wBJoqjCWRB7j";
var client_secret = "mm5WgNn8l7";
var fs = require("fs");

// cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/face", function(req, res) {
  var request = require("request");
  const obj = JSON.parse(JSON.stringify(req.body));
  //var api_url = "https://openapi.naver.com/v1/vision/celebrity"; // 유명인 인식
  var api_url = "https://openapi.naver.com/v1/vision/face"; // 얼굴 감지

  var _formData = {
    //image: "image",
    image: fs.createReadStream(obj.fileUrl),
    // image: fs.createReadStream(__dirname + "/images/iu.jpg"), // FILE 이름
    // image: obj.fileUrl,
  };

  //var result;

  var _req = request.post(
    {
      url: api_url,
      formData: _formData,
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    },
    function(error, response, body) {
      console.log(body);
      console.log(_req.body);
      res.send(body);
    }
  );
  // _req.pipe(res); // 브라우저로 출력
  // res.send(result);
});

app.listen(3000, function() {
  console.log("http://127.0.0.1:3000/face app listening on port 3000!");
});
