/* eslint-disable no-unused-vars */
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var request = require("request");
// var { apiKey } = require("../config/apiKey");
var client_id = "92iZUSj8wBJoqjCWRB7j";
var client_secret = "mm5WgNn8l7";

// cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// face
app.post("/face", function (req, res) {
	// API 주소
	//var api_url = "https://openapi.naver.com/v1/vision/celebrity"; // 유명인 인식
	var api_url = "https://openapi.naver.com/v1/vision/face"; // 얼굴 감지

	// res 데이터
	var obj = JSON.parse(JSON.stringify(req.body));

	var _formData = {
		// image: "image",
		image: fs.createReadStream(obj.fileUrl),
		// image: fs.createReadStream(__dirname + "/images/iu.jpg"), // FILE 이름
		// image: obj.fileUrl,
	};

	var data = {
		url: api_url,
		formData: _formData,
		headers: {
			"X-Naver-Client-Id": client_id,
			"X-Naver-Client-Secret": client_secret,
		},
	};

	var _req = request.post(data, (err, response, body) => {
		console.log(body);
		res.send(body);
		// console.log(_req.body);
		// res.send(_req.body);
		// res.send(body);
	});
});

app.listen(3000, function () {
	console.log("http://127.0.0.1:3000/face app listening on port 3000!");
});
