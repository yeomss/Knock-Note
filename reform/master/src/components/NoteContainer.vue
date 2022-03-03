<template>
	<div class="noteContainer">
		<div
			v-for="(note, key) in notesFilter(selectedCategory, searchTxt)"
			:key="`note-${key}`"
			class="note shadow"
			:style="{ 'background-color': note.theme.theme }"
		>
			<!-- 노트 서브 -->
			<div class="note-meta-wrapper">
				<!-- 노트 날짜-->
				<div class="note-date">
					{{ note.createDate }}
				</div>
			</div>

			<!-- 노트 제목 -->
			<div class="note-title-wrapper">
				<div v-if="!note.title.isEdit">
					<textarea
						v-if="note.title.text !== ''"
						v-model="note.title.text"
						rows="1"
						@click="openEditTitle(key)"
					>
					</textarea>
					<textarea v-else rows="1" placeholder="Knock Note 👋"></textarea>
				</div>
				<textarea
					id="note-title-area"
					v-model="editTitle"
					rows="1"
					v-else
					@change="editNoteTitle(key)"
					@blur="editNoteTitle(key)"
				></textarea>
			</div>

			<!-- 삭제 버튼 -->
			<span class="delete" @click.prevent="deleteNote(key)">
				<i class="fas fa-times"></i>
			</span>

			<!-- 노트 모달 -->
			<NoteModal :showModal="note.detected.isOpen" @closeModal="closeNoteModal(key)">
				<template #header>탐지된 객체는 🔎</template>
				<template #body v-if="note.detected.text !== 'none'">
					✨ {{ note.detected.text }} ✨
				</template>
				<template #body v-else>😥</template>
			</NoteModal>

			<!-- 노트 본문 -->
			<div class="note-contents">
				<!-- 노트 이미지 -->
				<img class="note-img" :class="key" :src="note.img.url" v-if="note.img.url !== ''" />

				<!-- 노트 텍스트 내용-->
				<div class="note-text-wrapper">
					<div v-if="!note.text.isEdit" @click="openEditText(key)">
						<p
							class="note-text"
							v-if="note.text.text != ''"
							v-html="note.text.html"
						></p>
						<textarea v-else placeholder="Knock Note 👋"></textarea>
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

			<hr class="note-line" />

			<!-- 노트 버튼 기능 -->
			<div class="note-btns">
				<div class="note-btns-wrapper-1">
					<div>
						<!-- 노트 테마 -->
						<HelpModal v-if="note.helps.theme" :message="'테마 설정'" />
						<span
							class="material-icons note-btn"
							@click="noteThemeOpen(key, note.theme)"
							@mouseover="openHelpTheme(key)"
							@mouseout="closeHelpTheme(key)"
						>
							palette
						</span>
						<span v-show="note.theme.isOpen" class="note-theme-modal">
							<ul>
								<li
									class="theme1 shadow note-btn"
									@click="setTheme(key, themes[0])"
								></li>
								<li
									class="theme2 shadow note-btn"
									@click="setTheme(key, themes[1])"
								></li>
								<li
									class="theme3 shadow note-btn"
									@click="setTheme(key, themes[2])"
								></li>
								<li
									class="theme4 shadow note-btn"
									@click="setTheme(key, themes[3])"
								></li>
								<li
									class="theme5 shadow note-btn"
									@click="setTheme(key, themes[4])"
								></li>
							</ul>
						</span>

						<!-- 이미지 업로드 -->
						<span
							class="note-img-wrapper"
							@click="setImgExploer(key)"
							@mouseover="openHelpImg(key)"
							@mouseout="closeHelpImg(key)"
						>
							<HelpModal v-if="note.helps.img" :message="'이미지 업로드'" />
							<input
								class="imgInput"
								:class="key"
								type="file"
								accept="image/*"
								@change="setImg($event, key)"
							/>
							<span class="material-icons note-btn"> image </span>
						</span>

						<!-- 음성 인식 -->
						<span
							@click="voiceNote(key)"
							@mouseover="openHelpVoice(key)"
							@mouseout="closeHelpVoice(key)"
						>
							<HelpModal v-if="note.helps.voice" :message="'음성인식'" />
							<span class="material-icons note-btn"> mic </span>
						</span>

						<!-- 노트 읽기 -->
						<span
							@click="speakNote(note.text.text)"
							@mouseover="openHelpSpeak(key)"
							@mouseout="closeHelpSpeak(key)"
						>
							<HelpModal v-if="note.helps.speak" :message="'노트 읽기'" />
							<span class="material-icons note-btn"> volume_up </span>
						</span>

						<!-- 이미지 객체 인식 -->
						<span
							class="note-detect"
							:class="key"
							@click="detectImg(key)"
							@mouseover="openHelpDetect(key)"
							@mouseout="closeHelpDetect(key)"
						>
							<HelpModal v-if="note.helps.detect" :message="'이미지 객체 탐지'" />
							<span class="material-icons note-btn"> auto_fix_high </span>
						</span>

						<!-- 표정 인식 -->
						<span
							@click.prevent="detectMood(key)"
							@mouseover="openHelpMood(key)"
							@mouseout="closeHelpMood(key)"
						>
							<HelpModal v-if="note.helps.mood" :message="'이미지 감정 탐지'" />
							<span class="material-icons note-btn"> mood </span>
						</span>

						<!-- 번역 -->
						<span
							@click="translateNote(key)"
							@mouseover="openHelpTranslate(key)"
							@mouseout="closeHelpTranslate(key)"
						>
							<HelpModal v-if="note.helps.translate" :message="'번역'" />
							<span class="material-icons note-btn"> g_translate </span>
						</span>
					</div>
				</div>

				<!-- 노트 카테고리 -->
				<div class="note-category">
					<!-- 노트 카테고리 설정 -->
					<select
						v-model="notesCategory[key]"
						@change="setNoteCategory(key)"
						@blur="setNoteCategory(key)"
					>
						<option v-for="category in categorys" :key="category">
							{{ category }}
						</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { update, ref } from "firebase/database";
import axios from "axios";

import NoteModal from "./common/NoteModal.vue";
import HelpModal from "./common/HelpModal.vue";

export default {
	props: ["categorys", "selectedCategory", "searchTxt", "model"],

	components: { NoteModal, HelpModal },

	data() {
		return {
			editTitle: "", // 수정 제목
			editText: "", // 수정 내용
			themes: this.$store.state.themes,
			notesCategory: {},
			file: null, //test
		};
	},

	methods: {
		// 노트 삭제
		deleteNote(key) {
			const user = this.$store.state.user;
			this.$store.commit("deleteNote", key);
			this.$store.commit("getNotes", user);
		},

		// 노트 카테고리 설정
		setNoteCategory(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/category"] = this.notesCategory[key];
			update(ref(db), updates);
		},

		// 노트 타이틀 수정
		editNoteTitle(key) {
			const user = this.$store.state.user;

			let data = {
				key: key,
				editTitle: this.editTitle,
			};

			this.$store.commit("editNoteTitle", data);
			this.$store.commit("getNotes", user);
		},
		// 노트 타이틀 수정 열기
		openEditTitle(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const notes = this.$store.state.notes;

			// title 에 수정 전의 텍스트가 뜨도록
			this.editTitle = notes[key].title.text;

			const updates = {};
			updates["/notes/" + uid + "/" + key + "/title/isEdit"] = true;
			update(ref(db), updates);

			// textarea 에 포커싱
			setTimeout(() => {
				document.getElementById("note-title-area").focus();
			}, 400);
		},
		// 노트 본문 수정
		editNoteText(key) {
			const user = this.$store.state.user;

			const data = {
				key: key,
				editText: this.editText,
			};

			this.$store.commit("editNoteText", data);
			this.$store.commit("getNotes", user);
		},
		// 노트 본문 수정 열기
		openEditText(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const notes = this.$store.state.notes;

			let isEdit = !notes[key].text.isEdit;

			// textarea 에 수정 전의 텍스트가 뜨도록
			this.editText = notes[key].text.text;

			const updates = {};
			updates["/notes/" + uid + "/" + key + "/text/isEdit"] = isEdit;
			update(ref(db), updates);

			// textarea 에 포커싱
			setTimeout(() => {
				document.getElementById("note-text-area").focus();
			}, 350);
		},

		// 노트 이미지 객체 인식 모달
		closeNoteModal(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/detected/isOpen"] = false;
			update(ref(db), updates);
		},
		// 노트 이미지 객체 인식
		async detectImg(key) {
			const data = { key, model: this.model };
			this.$store.commit("detectImg", data);
		},

		// 노트 사진 감정 인식
		detectMood(key) {
			const notes = this.$store.state.notes;
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			console.log("emition", key);

			let url = "http://127.0.0.1:3000/face";
			let data = { fileUrl: notes[key].img.url };

			axios
				.post(url, data)
				.then((res) => {
					console.log(res.data);
					let mood = res.data["faces"][0]; // 감정 인식
					const updates = {};
					updates["/notes/" + uid + "/" + key + "/mood"] = mood;
					update(ref(db), updates);
				})
				.catch(() => {
					alert("지금은 감정 인식 기능을 사용할 수 없습니다.");
				});
		},

		// 노트 번역
		async translateNote(key) {
			const notes = this.$store.state.notes;
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			let url = "http://127.0.0.1:3001/translate";
			let data = { query: notes[key].text.text };

			await axios
				.post(url, data)
				.then((res) => {
					// 번역 내용
					let translated = res.data["message"]["result"].translatedText;
					const updates = {};
					updates["/notes/" + uid + "/" + key + "/translated"] = translated;
					update(ref(db), updates);
				})
				.catch(() => {
					alert("지금은 번역 기능을 사용할 수 없습니다.");
				});
		},

		// 노트 테마 모달 열기
		noteThemeOpen(key, theme) {
			const data = { key, theme };
			this.$store.commit("noteThemeOpen", data);
		},
		// 노트 테마 설정
		setTheme(key, theme) {
			const data = { key, theme };
			this.$store.commit("setTheme", data);
		},

		// 노트 이미지 파일 탐색기 열기
		setImgExploer(key) {
			document.querySelector(`.imgInput.${key}`).click();
		},
		// 노트 이미지 설정
		setImg(e, key) {
			const data = { e, key };
			this.$store.commit("setImg", data);
		},

		// 노트 음성인식
		voiceNote(key) {
			this.$store.commit("voiceNote", key);
		},

		// 노트 내용 읽기
		speakNote(text) {
			this.$store.commit("speakNote", text);
		},

		// 노트 헬프 버튼
		openHelpTheme(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/helps/theme"] = true;
			update(ref(db), updates);
		},
		closeHelpTheme(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/helps/theme"] = false;
			update(ref(db), updates);
		},
		openHelpImg(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/helps/img"] = true;
			update(ref(db), updates);
		},
		closeHelpImg(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/helps/img"] = false;
			update(ref(db), updates);
		},
		openHelpVoice(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/voice"] = true;

			update(ref(db), updates);
		},
		closeHelpVoice(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/voice"] = false;

			update(ref(db), updates);
		},
		openHelpSpeak(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/speak"] = true;

			update(ref(db), updates);
		},
		closeHelpSpeak(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/speak"] = false;

			update(ref(db), updates);
		},
		openHelpDetect(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/detect"] = true;

			update(ref(db), updates);
		},
		closeHelpDetect(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/detect"] = false;

			update(ref(db), updates);
		},
		openHelpTranslate(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/translate"] = true;

			update(ref(db), updates);
		},
		closeHelpTranslate(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};

			updates["/notes/" + uid + "/" + key + "/helps/translate"] = false;

			update(ref(db), updates);
		},
		openHelpMood(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/helps/mood"] = true;
			update(ref(db), updates);
		},
		closeHelpMood(key) {
			const uid = this.$store.state.user.uid;
			const db = this.$store.state.db;
			const updates = {};
			updates["/notes/" + uid + "/" + key + "/helps/mood"] = false;
			update(ref(db), updates);
		},

		// 노트 검색 필터링
		notesFilter(selectedCategory, searchTxt) {
			const notes = this.$store.state.notes;
			let note_ = JSON.parse(JSON.stringify(notes));

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
					(note.category == selectedCategory || this.selectedCategory == "") &&
					(note.text.text.includes(searchTxt) ||
						note.title.text.includes(searchTxt) ||
						this.searchTxt == "")
				);
			});
		},
	},

	created() {
		const notes = this.$store.state.notes;
		// 카테고리만 가져와서 배열 만듦
		// 노트 select 에서 사용
		for (let i in notes) {
			this.notesCategory[i] = notes[i].category;
		}
	},

	watch: {
		notes() {
			const notes = this.$store.state.notes;
			for (let i in notes) {
				this.notesCategory[i] = notes[i].category;
			}
		},
		categorys() {
			const notes = this.$store.state.notes;
			for (let i in notes) {
				this.notesCategory[i] = notes[i].category;
			}
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
	grid-template-columns: repeat(4, 1fr);
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
		font-family: "Jua", "SUIT Variable", "Apple SD Gothic", "Open Sans", sans-serif;
		font-size: 1rem;
		color: #654b52;

		&:hover {
			outline: none;
		}
		&:focus {
			outline: none;
		}
	}

	.note-date {
		font-family: "Jua", "SUIT Variable", "Apple SD Gothic", "Open Sans", sans-serif;
		font-size: 0.3rem;
		color: #654b5252;
		font-weight: bold;
	}

	.note-line {
		width: 100%;
	}

	.note-category {
		select {
			width: 100%;
			border: 1px solid #654b52;
		}
	}
}
.note-title-wrapper {
	font-size: 1.15rem;
	cursor: pointer;

	textarea {
		font-size: 1.15rem;
		border: none;
	}
}
.note-meta-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
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
	// background-color: #654b52;

	position: absolute;
	width: 100%;
	bottom: 5.3rem;
	right: 0px;
	z-index: 1;
	opacity: 0.95;
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
		border: 1px solid #654b52;

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
	margin-top: 0.5rem;
	margin-bottom: 0;
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
		align-items: flex-start;
		align-content: center;

		div {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
		}
	}
}

// 삭제 버튼
.delete {
	cursor: pointer;
}

/* 리스트 트랜지션 */
.note-enter-active,
.note-leave-active {
	transition: all 0.35s;
}
.note-enter, .note-leave-to /* .list-leave-active below version 2.1.8 */ {
	opacity: 0;
	transform: translateY(30px) scale(1.1);
}
</style>
