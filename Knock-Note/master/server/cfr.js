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
	// req.body 로 데이터가 들어온다.
	// 들어온 데이터를 본 폴더에 파일로 저장하기 위해서 writeStream 을 사용한다.
	// 이렇게 하면 본 폴더에 noteImg.jpg 파일이 만들어진다.
	var stream = request(req.body.fileUrl);
	var writeStream = fs.createWriteStream("test.jpg");

	stream.on("data", function (data) {
		writeStream.write(data);
	});

	stream.on("end", function () {
		writeStream.end();
	});

	var _formData = {
		image: "image",
		image: fs.createReadStream(__dirname + "/test.jpg"),
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
		// res.send(body);
		// console.log(_req.body);
		// res.send(_req.body);
		// res.send(body);
	});
});

app.listen(3000, function () {
	console.log("http://127.0.0.1:3000/face app listening on port 3000!");
});
