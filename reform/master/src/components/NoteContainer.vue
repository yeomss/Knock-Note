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
			<span>{{ note.title }}</span>

			<!-- 삭제 버튼 -->
			<span class="delete" @click.prevent="deleteNote(key)">
				<i class="fas fa-times"></i>
			</span>

			<!-- 노트 테마 -->
			<span
				class="material-icons"
				@click="noteThemeOpen(key, note.theme)"
			>
				palette
			</span>
			<span v-show="note.theme.isOpen" class="note-theme-modal">
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

			<!-- 노트 서브 -->
			<div>{{ note.createDate }} {{ note.category }}</div>

			<!-- 노트 본문 -->
			<div class="note-contents">
				<!-- 노트 이미지 -->
				<img :src="note.img.url" />

				<!-- 노트 텍스트 내용-->
				<p class="note-text">{{ note.text }}</p>
			</div>

			<!-- 노트 버튼 기능 -->
			<div class="note-btns">
				<!-- 이미지 업로드 -->
				<div class="note-img-wrapper" @click="setImgExploer(key)">
					<form>
						<input
							class="imgInput"
							:class="key"
							type="file"
							accept="image/*"
							@change="setImg($event, key)"
						/>
					</form>
					<span class="material-icons"> image </span>
				</div>

				<!-- 음성 인식 -->
				<div @click="voiceNote(key)">
					음성인식<span class="material-icons"> mic </span>
				</div>

				<!-- 노트 읽기 -->
				<div @click="speakNote(note.text)">
					노트읽기
					<span class="material-icons"> volume_up </span>
				</div>

				<!-- 번역 -->
				<div>번역<span class="material-icons"> g_translate </span></div>

				<!-- 표정 인식 -->
				<div>표정인식<span class="material-icons"> mood </span></div>
			</div>
		</div>
	</div>
</template>

<script>
// import { doc, getDoc } from "firebase/firestore";
import {
	ref as StorageRef,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import { update, ref } from "firebase/database";

export default {
	props: ["notes", "selectedCategory", "searchTxt", "db", "user", "storage"],

	data() {
		return {
			themes: ["#F4CCCC", "#EB9F9F", "#E7D9E7", "#FFF2CC", "#F2F2F2"],
			filterNotes: null,
		};
	},

	methods: {
		// 노트 삭제
		deleteNote(key) {
			this.$emit("deleteNote", key);
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
			recognition.start();
			recognition.onresult = (e) => {
				let uid = this.user.uid;
				const updates = {};

				// 음성인식 된 텍스트
				let text =
					this.notes[key].text + " " + e.results[0][0].transcript;

				// 해당 데이터의 위치
				updates["/notes/" + uid + "/" + key + "/text"] = text;

				// 해당 데이터만 업데이트
				update(ref(this.db), updates);
			};
		},

		// 노트 내용 읽기
		speakNote(text) {
			console.log("speak");
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

		// 노트 이미지 가져오기
		// getImg(note) {
		// firestore 사용하는 방법
		// const imgRef = doc(this.store, "images", "8eGMuxesOGAgg7FsFAO8");
		// const imgSnap = await getDoc(imgRef);
		// if (imgSnap.exists()) {
		// 	console.log("Document data:", imgSnap.data());
		// } else {
		// 	console.log("No such document!");
		// }
		// let uid = this.user.uid;
		// const imgRef = ref(this.storage, `images/${uid}/${note.img}`);
		// getDownloadURL(imgRef)
		// 	.then((url) => {
		// 		return url;
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
		// },
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
	height: 25rem;
	background: #fff;
	border-radius: 3px;

	box-sizing: border-box;
	margin: 10px;
	padding: 25px;
	word-break: break-word;
	cursor: pointer;
	overflow-x: hidden;

	img {
		width: 200px;
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
	height: 100%;
}
</style>
