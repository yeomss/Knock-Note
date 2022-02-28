<template>
	<div class="noteContainer">
		<!-- <div @click="temp">하이루</div> -->
		<div
			v-for="(note, key) in notes"
			:key="`note-${key}`"
			class="note shadow"
			:style="{ 'background-color': note.theme.theme }"
		>
			<!-- 노트 제목 -->
			<div class="note-title-wrapper">
				<div v-if="!note.title.isEdit" @click="openEditTitle(key)">
					{{ note.title.text }}
				</div>
				<textarea
					id="note-title-area"
					v-model="editTitle"
					v-else
					rows="1"
					@change="editNoteTitle(key)"
					@blur="editNoteTitle(key)"
				></textarea>
			</div>

			<!-- 삭제 버튼 -->
			<span class="delete" @click.prevent="deleteNote(key)">
				<i class="fas fa-times"></i>
			</span>

			<!-- 노트 서브 -->
			<div class="note-date">
				{{ note.createDate }} {{ note.category }}
			</div>

			<!-- 노트 모달 -->
			<NoteModal
				:showModal="note.detected.isOpen"
				@closeModal="closeNoteModal(key)"
			>
				<template #header>탐지된 객체는 🔎</template>
				<template #body v-if="note.detected.text !== 'none'">
					✨ {{ note.detected.text }} ✨
				</template>
				<template #body v-else>😥</template>
			</NoteModal>

			<!-- 노트 본문 -->
			<div class="note-contents">
				<!-- 노트 이미지 -->
				<img
					class="note-img"
					:class="key"
					:src="note.img.url"
					v-if="note.img.url !== ''"
				/>

				<!-- 노트 텍스트 내용-->
				<div class="note-text-wrapper">
					<div v-if="!note.text.isEdit" @click="openEditText(key)">
						<p class="note-text" v-html="note.text.html"></p>
					</div>
					<textarea
						type="text"
						id="note-text-area"
						v-else
						rows="10"
						v-model="editText"
						@change="editNoteText(key)"
						@blur="editNoteText(key)"
					>
					</textarea>
				</div>

				<span>{{ note.translated }}</span>
			</div>

			<!-- 노트 버튼 기능 -->
			<div class="note-btns">
				<div class="note-btns-wrapper-1">
					<div>
						<!-- 노트 테마 -->
						<span
							class="material-icons"
							@click="noteThemeOpen(key, note.theme)"
						>
							palette
						</span>
						<span
							v-show="note.theme.isOpen"
							class="note-theme-modal"
						>
							<ul>
								<li
									class="theme1 shadow"
									@click="setTheme(key, themes[0])"
								></li>
								<li
									class="theme2 shadow"
									@click="setTheme(key, themes[1])"
								></li>
								<li
									class="theme3 shadow"
									@click="setTheme(key, themes[2])"
								></li>
								<li
									class="theme4 shadow"
									@click="setTheme(key, themes[3])"
								></li>
								<li
									class="theme5 shadow"
									@click="setTheme(key, themes[4])"
								></li>
							</ul>
						</span>

						<!-- 이미지 업로드 -->
						<span
							class="note-img-wrapper"
							@click="setImgExploer(key)"
						>
							<input
								class="imgInput"
								:class="key"
								type="file"
								accept="image/*"
								@change="setImg($event, key)"
							/>
							<span class="material-icons"> image </span>
						</span>
					</div>
					<div>
						<!-- 음성 인식 -->
						<span @click="voiceNote(key)">
							<span class="material-icons"> mic </span>
						</span>

						<!-- 노트 읽기 -->
						<span @click="speakNote(note.text.text)">
							<span class="material-icons"> volume_up </span>
						</span>
					</div>
				</div>

				<div class="note-btns-wrapper-2">
					<!-- 이미지 객체 인식 -->
					<span
						class="note-detect"
						:class="key"
						@click="detectImg(key)"
					>
						<span class="material-icons"> auto_fix_high </span>
					</span>

					<!-- 번역 -->
					<span @click="translateNote(key)">
						<span class="material-icons"> g_translate </span>
					</span>

					<!-- 표정 인식 -->
					<span @click.prevent="detectEmotion(key)">
						<span class="material-icons"> mood </span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	ref as StorageRef,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import { update, ref } from "firebase/database";
import axios from "axios";

import NoteModal from "./common/NoteModal.vue";

export default {
	props: [
		"notes",
		"selectedCategory",
		"searchTxt",
		"db",
		"user",
		"storage",
		"model",
	],

	components: { NoteModal },

	data() {
		return {
			// 노트 색상 테마들
			themes: ["#F4CCCC", "#EB9F9F", "#E7D9E7", "#FFF2CC", "#F2F2F2"],

			// 노트 정보
			editTitle: "", // 수정 제목
			editText: "", // 수정 내용
			file: null, //test
		};
	},

	methods: {
		// 노트 삭제
		deleteNote(key) {
			this.$emit("deleteNote", key);
		},

		// 노트 타이틀 수정
		editNoteTitle(key) {
			let uid = this.user.uid;

			let editedNote = {
				isEdit: false,
				text: this.editTitle,
			};

			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/title"] = editedNote;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);
		},
		// 노트 타이틀 수정 열기
		openEditTitle(key) {
			let uid = this.user.uid;

			let editTitle = !this.notes[key].title.isEdit;

			// title 에 수정 전의 텍스트가 뜨도록
			this.editTitle = this.notes[key].title.text;

			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/title/isEdit"] = editTitle;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);

			// textarea 에 포커싱
			setTimeout(() => {
				document.getElementById("note-title-area").focus();
			}, 400);
		},
		// 노트 본문 수정
		editNoteText(key) {
			let uid = this.user.uid;
			let htmlText = this.editText.replace(/(\n|\r\n)/g, "<br/>");

			let editedNote = {
				isEdit: false,
				text: this.editText,
				html: htmlText,
			};

			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/text"] = editedNote;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);
		},
		// 노트 본문 수정 열기
		openEditText(key) {
			let uid = this.user.uid;

			let isEdit = !this.notes[key].text.isEdit;

			// textarea 에 수정 전의 텍스트가 뜨도록
			this.editText = this.notes[key].text.text;

			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/text/isEdit"] = isEdit;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);

			// textarea 에 포커싱
			setTimeout(() => {
				document.getElementById("note-text-area").focus();
			}, 350);
		},

		// 노트 이미지 객체 인식 모달
		closeNoteModal(key) {
			console.log(key);
			let uid = this.user.uid;
			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/detected/isOpen"] = false;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);
		},
		// 노트 이미지 객체 인식
		async detectImg(key) {
			//	 cocoSSD 는 이미지 객체를 인식한다. 매개변수로 이미지 객체를 넣어야함.
			// let noteImg = document.querySelector(`.note-img.${key}`);
			const noteImg = new Image();
			noteImg.src = localStorage.getItem(key);
			noteImg.width = 300;
			noteImg.height = 300;
			const img = noteImg; // 이거 안하면 오류남.. 왜지??

			let uid = this.user.uid; // uid

			// 객체 탐지
			let detected = await this.model.detect(img);
			// 두번해야 한번에 뜬다.
			// 그렇지 않으면 클릭을 두번해야 올바른 객체가 뜬다.
			detected = await this.model.detect(img);

			let isOpen = this.notes[key].detected.isOpen;

			// 만약 객체가 탐지가 되면
			if (detected.length != 0) {
				detected = detected[0].class; // 탐지 내용
				let detected_ = { isOpen: !isOpen, text: detected };

				const updates = {};

				// 해당 데이터의 위치
				updates["/notes/" + uid + "/" + key + "/detected"] = detected_;

				// 해당 데이터만 업데이트
				update(ref(this.db), updates);
			} else {
				detected = "none"; // 탐지 내용
				let detected_ = { isOpen: !isOpen, text: detected };

				const updates = {};

				// 해당 데이터의 위치
				updates["/notes/" + uid + "/" + key + "/detected"] = detected_;

				// 해당 데이터만 업데이트
				update(ref(this.db), updates);
			}
		},

		// 노트 사진 감정 인식
		detectEmotion(key) {
			console.log("emition", key);

			let url = "http://127.0.0.1:3000/face";
			// let img_ =
			// "/Users/yeomss/Repository/Github/Toy-Project/Open-Source-Note-App/reform/master/src/assets/smile2.jpeg";
			let data = { fileUrl: this.notes[key].img.url };
			// let img_ =
			// "gs://osp20-25073.appspot.com/images/f3teg5RS6fdxeAI43bycELJ99nR2/-MwwVafyiJp-7Pg6O2La/noteImage.jpeg";
			// let data = { fileUrl: img_ };

			// let formData = new FormData();

			// if (this.file) {
			// 	console.log(this.file.length);
			// 	for (let i = 0; i < this.file.length; i++) {
			// 		formData.append("image", this.file[i]);
			// 	}
			// }
			// formData.append("hihi", 123);
			// console.log("hehe:", formData.get("image"));

			// console.log("formData:", formData);
			// console.log(typeof formData);

			// let data = { ho: "hi" };
			// let data = JSON.parse(JSON.stringify(formData));
			// let data = formData;
			// let data = localStorage.getItem(key);
			axios.post(url, data).then((res) => {
				console.log(res.data);
				// console.log("emotion:", res.data["faces"][0]);

				// let emotion = res.data["faces"][0]; // 감정 인식
				// let uid = this.user.uid; // uid

				// const updates = {};

				// // 해당 데이터의 위치
				// updates["/notes/" + uid + "/" + key + "/emotion"] = emotion;

				// // 해당 데이터만 업데이트
				// update(ref(this.db), updates);
			});
		},

		// 노트 번역
		async translateNote(key) {
			let url = "http://127.0.0.1:3001/translate";
			let data = { query: this.notes[key].text.text };

			await axios.post(url, data).then((res) => {
				// 번역 내용
				let translated = res.data["message"]["result"].translatedText;
				let uid = this.user.uid; // uid

				const updates = {};

				// 해당 데이터의 위치
				updates["/notes/" + uid + "/" + key + "/translated"] =
					translated;

				// 해당 데이터만 업데이트
				update(ref(this.db), updates);
			});
		},

		// 노트 테마 모달 열기
		noteThemeOpen(key, theme) {
			let uid = this.user.uid; // uid
			let isOpen = !theme.isOpen; // 해당 노트의 테마 모달 토글

			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/theme/isOpen"] = isOpen;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);
		},
		// 노트 테마 설정
		setTheme(key, theme) {
			let uid = this.user.uid; // uid
			let newTheme = theme;

			const updates = {};

			// 해당 데이터의 위치
			updates["/notes/" + uid + "/" + key + "/theme/theme"] = newTheme;

			// 해당 데이터만 업데이트
			update(ref(this.db), updates);
		},

		// 노트 이미지 파일 탐색기 열기
		setImgExploer(key) {
			document.querySelector(`.imgInput.${key}`).click();
		},
		// 노트 이미지 설정
		setImg(e, key) {
			// 이미지 다시 저장
			const uid = this.user.uid;
			let imgFile = e.target.files[0]; // 이미지 파일 객체
			this.file = e.target.files;

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
			const imgRef = StorageRef(
				this.storage,
				`images/${uid}/${key}/noteImage.${imgType}`
			);

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
							update(ref(this.db), updates);
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((err) => console.log(err));
		},

		// 노트 음성인식
		voiceNote(key) {
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
					let uid = this.user.uid;
					const updates = {};

					// 음성인식 된 텍스트
					let text =
						this.notes[key].text.text +
						" " +
						e.results[0][0].transcript;

					// 해당 데이터의 위치
					updates["/notes/" + uid + "/" + key + "/text/text"] = text;

					// 해당 데이터만 업데이트
					update(ref(this.db), updates);
				};
			} else {
				return;
			}
		},

		// 노트 내용 읽기
		speakNote(text) {
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
			let opt = { rate: 1, pitch: 1.2, lang: "ko - KR" };
			let opt_ = opt || {};

			// 읽기 객체
			let speaker = new SpeechSynthesisUtterance();

			// 목소리 종류 변경
			// 그렇지만 한국어는 못읽고 영어만 읽음.
			// let voices = window.speechSynthesis.getVoices();
			// speaker.voice = voices.filter(function (voice) {
			// 	return voice.name == "Alex";
			// })[0];

			speaker.rate = opt_.rate || 1; // 속도: 0.1 ~ 10
			speaker.pitch = opt_.pitch || 1; // 음높이: 0 ~ 2
			speaker.lang = opt_.lang || "ko -KR"; // 언어 설정
			speaker.text = text; // 읽는 텍스트

			window.speechSynthesis.speak(speaker);
		},

		// 노트 검색 필터링
		notesFilter(selectedCategory, searchTxt) {
			let note_ = JSON.parse(JSON.stringify(this.notes));

			Object.filter = function (obj, filterFunc) {
				return Object.keys(obj)
					.filter(function (key) {
						return filterFunc(obj[key]);
					})
					.reduce(function (result, key) {
						result[key] = obj[key];
						return result;
					}, {});
			};

			return Object.filter(note_, (note) => {
				return (
					(note.category == selectedCategory ||
						selectedCategory == "") &&
					(note.text.includes(searchTxt) ||
						note.title.includes(searchTxt) ||
						searchTxt == "")
				);
			});
		},
	},

	watch: {
		// 카테고리
		selectedCategory() {
			console.log("category:", this.selectedCategory);
		},

		// 검색 키워드
		searchTxt() {
			console.log("search:", this.searchTxt);
		},
	},
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar-thumb {
	background-color: transparent;
	width: 0.5px;
}

.noteContainer {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-auto-flow: dense;
	// border-left: 1px solid black;
	height: 100%;
}

.note {
	display: flex;
	flex-direction: column;
	position: relative;
	height: 26rem;
	background: #fff;
	border-radius: 3px;

	box-sizing: border-box;
	margin: 10px;
	padding: 25px;
	word-break: break-word;
	overflow-x: hidden;

	transition: all 0.3s ease;

	img {
		width: 200px;
	}

	textarea {
		width: 100%;
		height: auto;
		border: none;
		resize: none;
		cursor: text;
		padding: 0px;
		margin: 0px;

		background-color: transparent;
		font-family: "Jua", "SUIT Variable", "Apple SD Gothic", "Open Sans",
			sans-serif;
		font-size: 1.1rem;
		color: #654b52;

		&:hover {
			outline: none;
		}
		&:focus {
			outline: none;
		}
	}

	.note-date {
		font-size: 0.2rem;
	}
}
.note-title-wrapper {
	font-size: 1.2rem;
	// height: 2rem;
	cursor: pointer;

	textarea {
		font-size: 1.2rem;
		// height: auto;
		padding: 0;
		margin: 0;
	}
}
.note-text-wrapper {
	cursor: pointer;

	.note-text {
		margin: 0;
	}
}
.note-img-wrapper {
	input[type="file"] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
}

.note-theme-modal {
	// background-color: #fff;
	background-color: #654b52;

	position: absolute;
	width: 100%;
	top: 0;
	right: 0px;
	z-index: 1;
	// opacity: 0.6;
	transition: 0.2s;
	padding: 5px;

	ul {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: nowrap;
		margin: 0;
		padding: 0;
	}

	&:hover {
		opacity: 1;
	}
	li {
		display: inline-block;
		border-radius: 5px;
		width: 2rem;
		height: 2rem;
		margin: 1px;
		transition: 0.3s;
		border: #000;
		opacity: 0.7;
		background-color: #fff;

		&.theme1 {
			background-color: #f4cccc;
			opacity: 1;
			&:hover {
				opacity: 1;
				transform: scale(1.02, 1.02);
			}
		}

		&.theme2 {
			background-color: #eb9f9f;
			&:hover {
				opacity: 1;
				transform: scale(1.02, 1.02);
			}
		}

		&.theme3 {
			background-color: #e7d9e7;
			&:hover {
				opacity: 1;
				transform: scale(1.02, 1.02);
			}
		}

		&.theme4 {
			background-color: #fff2cc;
			&:hover {
				opacity: 1;
				transform: scale(1.02, 1.02);
			}
		}

		&.theme5 {
			background-color: #f2f2f2;
			&:hover {
				opacity: 1;
				transform: scale(1.02, 1.02);
			}
		}
	}
}

.note-contents {
	overflow-y: scroll;
	margin-top: 1rem;
	margin-bottom: 1.3rem;
	height: 100%;

	img {
		width: 100%;
	}
}

.note-btns {
	display: flex;
	flex-direction: column;

	.note-btns-wrapper-1 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		align-content: center;
	}
	.note-btns-wrapper-2 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
