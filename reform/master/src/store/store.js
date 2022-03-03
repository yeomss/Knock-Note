/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import {
	getStorage,
	ref as storageRef,
	deleteObject,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import moment from "moment";

Vue.use(Vuex);

// firebase
const firebaseConfig = {
	apiKey: "AIzaSyB-0Q3f-GlcQcNeGVbpso4o-JAo-BcVosc",
	authDomain: "osp20-25073.firebaseapp.com",
	databaseURL: "https://osp20-25073.firebaseio.com",
	projectId: "osp20-25073",
	storageBucket: "osp20-25073.appspot.com",
	messagingSenderId: "359171034506",
	appId: "1:359171034506:web:d857e168477488b322cc73",
};

// 기본 노트 세팅
const defaultNote = {
	title: { isEdit: false, text: "" }, // 노트 제목
	theme: { isOpen: false, theme: "#f4cccc" }, // 노트 테마
	text: { isEdit: false, text: "", html: "" }, // 노트 본문
	category: "기본", // 카테고리
	createDate: moment().format("YYYY-MM-DD ddd"), // 생성일자
	img: { isUpload: false, isDel: false, type: "", url: "" }, // 노트 이미지
	detected: { isOpen: false, text: "none" }, // 노트 이미지 객체 탐지
	translated: "", // 노트 번역
	mood: "", // 노트 이미지 감정 인식
	helps: {
		// 노트 버튼 모달
		theme: false,
		img: false,
		voice: false,
		speak: false,
		detect: false,
		translate: false,
		mood: false,
	},
};

export const store = new Vuex.Store({
	// 데이터
	state: {
		// firebase
		app: initializeApp(firebaseConfig),
		db: getDatabase(),
		storage: getStorage(),
		auth: getAuth(),
		user: null,

		// dababase
		note: defaultNote,
		notes: null,
		categorys: null,
		todos: null,
		themes: ["#F4CCCC", "#EB9F9F", "#E7D9E7", "#FFF2CC", "#F2F2F2"],

		// 모달
		editorOpen: false,
	},

	// 동기적 메서드
	mutations: {
		/* 인증 */
		setUser(state, payload) {
			state.user = payload;
		},

		/* 데이터 */
		// Notes
		getNotes(state, payload) {
			const uid = payload.uid;
			const ref_ = ref(state.db, `notes/${uid}`);
			let flag = false;

			onValue(ref_, (data) => {
				if (data.size === 0) {
					flag = true;
				}
				state.notes = data.val();
			});

			if (flag) {
				// 노트가 없다면 새 노트 생성
				push(ref_, state.note);
			}
		},
		// Categorys
		getCategorys(state) {
			const db = state.db;
			const uid = state.user.uid;
			const ref_ = ref(db, `categorys/${uid}`);
			let flag = false;

			onValue(ref_, (data) => {
				if (data.size == 0) {
					flag = true;
				}
				state.categorys = data.val();
			});

			if (flag) {
				push(ref_, "기본");
			}
		},
		// Todos
		getTodos(state) {
			const db = state.db;
			const uid = state.user.uid;
			const ref_ = ref(db, `todos/${uid}`);

			onValue(
				ref_,
				(data) => {
					state.todos = data.val();
				},
				{ onlyOnce: true }
			);
		},

		/* 노트 */
		// 노트 삭제
		deleteNote(state, payload) {
			const uid = state.user.uid;
			const storage = state.storage;
			const db = state.db;

			if (!confirm("노트를 삭제하시겠습니까?")) {
				return;
			} else {
				// storage에서 삭제
				if (state.notes[payload].img.isUpload) {
					const path = `images/${uid}/${payload}/noteImage`;
					const imgRef = storageRef(storage, path);

					deleteObject(imgRef)
						.then(() => {
							console.log("파일 삭제 완료!");
						})
						.catch((error) => {
							console.log(error);
						});
				}

				// db에서 삭제
				const noteRef = ref(db, "notes/" + uid + "/" + payload);
				remove(noteRef);
			}
		},
		// 노트 타이틀 수정
		editNoteTitle(state, payload) {
			const uid = state.user.uid;
			const db = state.db;
			const key = payload.key;

			let edited = {
				isEdit: false,
				text: payload.editTitle,
			};
			const updates = {};
			updates[`/notes/${uid}/${key}/title`] = edited;
			update(ref(db), updates);
		},
		// 노트 내용 수정
		editNoteText(state, payload) {
			const uid = state.user.uid;
			const db = state.db;
			const key = payload.key;
			const htmlText = payload.editText.replace(/(\n|\r\n)/g, "<br/>");

			let editedNote = {
				isEdit: false,
				text: payload.editText,
				html: htmlText,
			};

			const updates = {};
			updates["/notes/" + uid + "/" + key + "/text"] = editedNote;
			update(ref(db), updates);
		},
		// 노트 테마 모달 열기
		noteThemeOpen(state, payload) {
			const uid = state.user.uid;
			const db = state.db;
			const key = payload.key;
			const isOpen = !payload.theme.isOpen; // 해당 노트의 테마 모달 토글

			const updates = {};

			updates["/notes/" + uid + "/" + key + "/theme/isOpen"] = isOpen;
			update(ref(db), updates);
		},
		// 노트 테마 설정
		setTheme(state, payload) {
			const uid = state.user.uid;
			const db = state.db;
			const key = payload.key;
			const theme = payload.theme;
			let newTheme = { isOpen: false, theme: theme };

			const updates = {};

			updates["/notes/" + uid + "/" + key + "/theme"] = newTheme;
			update(ref(db), updates);
		},
		// 노트 이미지 설정
		setImg(state, payload) {
			// 이미지 다시 저장
			const uid = state.user.uid;
			const db = state.db;
			const storage = state.storage;
			const imgFile = payload.e.target.files[0]; // 이미지 파일 객체
			const key = payload.key;

			// 파일 객체 로컬 스토리지에 저장
			// 이거는 나중에 객체 탐지할 때 사용
			let fr = new FileReader(); // 파일 읽기 객체
			fr.readAsDataURL(imgFile); // url로 변경
			fr.onload = (e) => {
				// url로 로컬 스토리지에 저장
				localStorage.setItem(key, e.target.result);
			};

			// 똑같은 파일이름을 사용하며 업로드 할떄는 이를 덮어쓴다.
			// 파일 타입은 다를 수 있기 때문에 파일 타입을 알기 위하여 imgType 을 구한다.
			let imgType = imgFile.type.substr(imgFile.type.indexOf("/") + 1);

			// 이미지 storage에 저장
			const imgRef = storageRef(storage, `images/${uid}/${key}/noteImage`);

			// 이미지 storage에 업로딩 함수: uploadBytes
			uploadBytes(imgRef, imgFile)
				.then(() => {
					// 업로드 완료
					console.log("image upload success");
					// 이미지 url 추출
					getDownloadURL(imgRef)
						.then((url) => {
							const updates = {};

							// 해당 데이터의 위치
							updates["/notes/" + uid + "/" + key + "/img"] = {
								isUpload: true,
								type: imgType,
								url: url,
							};
							// 해당 데이터만 업데이트
							update(ref(db), updates);
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((err) => console.log(err));
		},
		// 노트 음성인식
		voiceNote(state, payload) {
			const uid = state.user.uid;
			const notes = state.notes;
			const db = state.db;

			// 인식 객체
			let recognition = new (window.SpeechRecognition ||
				window.webkitSpeechRecognition ||
				window.mozSpeechRecognition ||
				window.msSpeechRecognition)();

			recognition.lang = "ko-KR"; // 한국어 설정
			recognition.interimResults = false; // 중간 결과를 반환하는가

			// 숫자가 적을수록 발음대로 적어줌. 크다면 그에 적절한 단어 반환
			recognition.maxAlternatives = 100;

			// 인식 시작
			if (confirm("음성인식을 시작하시겠습니까?")) {
				recognition.start();
				recognition.onresult = (e) => {
					const updates = {};

					let text = notes[payload].text.text + " " + e.results[0][0].transcript;
					let htmlText = text.replace(/(\n|\r\n)/g, "<br/>");
					let newText = { isEdit: false, text: text, html: htmlText };

					// 해당 데이터의 위치
					updates["/notes/" + uid + "/" + payload + "/text"] = newText;

					// 해당 데이터만 업데이트
					update(ref(db), updates);
				};
			} else {
				return;
			}
		},
		// 노트 내용 읽기
		speakNote(state, payload) {
			// 예외 처리
			if (
				typeof SpeechSynthesisUtterance === "undefined" ||
				typeof window.speechSynthesis === "undefined"
			) {
				alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
				return;
			}

			// 현재 읽고 있다면 초기화 하기
			window.speechSynthesis.cancel();

			// 옵션
			const opt = { rate: 1, pitch: 1.2, lang: "ko - KR" };
			const opt_ = opt || {};

			// 읽기 객체
			const speaker = new SpeechSynthesisUtterance();

			// 목소리 종류 변경
			// 그렇지만 한국어는 못읽고 영어만 읽음.
			// let voices = window.speechSynthesis.getVoices();
			// speaker.voice = voices.filter(function (voice) {
			// 	return voice.name == "Alex";
			// })[0];

			speaker.rate = opt_.rate || 1; // 속도: 0.1 ~ 10
			speaker.pitch = opt_.pitch || 1; // 음높이: 0 ~ 2
			speaker.lang = opt_.lang || "ko -KR"; // 언어 설정
			speaker.text = payload; // 읽는 텍스트

			window.speechSynthesis.speak(speaker);
		},
		// 노트 이미지 객체 인식 모달
		closeNoteModal(state, key) {
			const uid = state.user.uid;
			const db = state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/detected/isOpen"] = false;
			update(ref(db), updates);
		},
		// 노트 이미지 객체 인식
		async detectImg(state, payload) {
			const key = payload.key;
			const model = payload.model;
			const notes = state.notes;
			const uid = state.user.uid; // uid
			const db = state.db;

			//	 cocoSSD 는 이미지 객체를 인식한다. 매개변수로 이미지 객체를 넣어야함.
			// let noteImg = document.querySelector(`.note-img.${key}`);
			const noteImg = new Image();
			noteImg.src = localStorage.getItem(key);
			noteImg.width = 300;
			noteImg.height = 300;
			const img = noteImg; // 이거 안하면 오류남.. 왜지??

			// 객체 탐지
			let detected = await model.detect(img);
			// 두번해야 한번에 뜬다.
			// 그렇지 않으면 클릭을 두번해야 올바른 객체가 뜬다.
			detected = await model.detect(img);

			const isOpen = notes[key].detected.isOpen;

			// 만약 객체가 탐지가 되면
			if (detected.length != 0) {
				detected = detected[0].class; // 탐지 내용
				const detected_ = { isOpen: !isOpen, text: detected };
				const updates = {};
				updates["/notes/" + uid + "/" + key + "/detected"] = detected_;
				update(ref(db), updates);
			} else {
				detected = "none"; // 탐지 내용
				const detected_ = { isOpen: !isOpen, text: detected };
				const updates = {};
				updates["/notes/" + uid + "/" + key + "/detected"] = detected_;
				update(ref(db), updates);
			}
		},

		/* 카테고리 */
		// 카테고리 추가
		addCategory(state, payload) {
			// 중복 처리
			const uid = state.user.uid;
			const db = state.db;
			const categorys = state.categorys;

			let flag = false; // 중복된 카테고리가 없을 시

			if (payload !== "") {
				for (let i in categorys) {
					if (categorys[i] === payload) {
						alert("중복된 카테고리가 있습니다.");
						flag = true;
						break;
					}
				}

				if (!flag) {
					// 카테고리 저장
					push(ref(db, "categorys/" + uid), payload);
				}
			}
		},
		// 카테고리 삭제
		deleteCategory(state, payload) {
			const uid = state.user.uid;
			const db = state.db;

			// db에서 삭제
			const ref_ = ref(db, `categorys/${uid}/${payload}`);
			remove(ref_);
		},

		/* 투두 리스트 */
		// todo 추가
		addTodo(state, payload) {
			const uid = state.user.uid;
			const db = state.db;

			let newTodo = {
				completed: false,
				text: payload,
			};

			// 데이터 저장
			if (payload !== "") {
				push(ref(db, "todos/" + uid), newTodo);
			}
		},
		// todo 삭제
		deleteTodo(state, payload) {
			const uid = state.user.uid;
			const db = state.db;
			remove(ref(db, "todos/" + uid + "/" + payload));
		},
		// todo 완료
		toggleTodo(state, payload) {
			const uid = state.user.uid;
			const db = state.db;
			const updates = {};

			updates[`/todos/${uid}/${payload}/completed`] = true;

			update(ref(db), updates);
		},

		/* 헤더 */
		openEditor(state) {
			state.editorOpen = !state.editorOpen;
		},
	},

	// 비동기적 메서드
	actions: {
		// GET_NOTES(context, payload) {
		// 	context.commit("getNotes", payload);
		// },
	},
});
