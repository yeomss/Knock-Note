<template>
	<Transition name="editor">
		<div class="note-editor-mask" v-if="this.$store.state.editorOpen">
			<div class="note-editor-container">
				<div class="note-editor" :style="{ 'background-color': theme.theme }">
					<!-- <div @click="uploadImg">load</div> -->
					<div class="note-editor-main-title text-shadow">New Knock 👋</div>

					<!-- 노트 제목 입력 창 -->
					<input
						class="title-input"
						type="text"
						v-model="title.text"
						placeholder="노트 제목을 입력해주세요"
					/>

					<!-- 노트 본문 입력 창 -->
					<textarea
						rows="10"
						v-model="text.text"
						placeholder="똑똑 노트를 두드립시다 📝"
					></textarea>

					<!-- 노트 카테고리 선택 -->
					<div class="note-editor-category">
						<select v-model="category">
							<option value="기본">기본</option>
							<option v-for="c in this.$store.state.categorys" :key="c">
								{{ c }}
							</option>
						</select>

						<AddCategory />
					</div>

					<!-- 노트 테마 선택-->
					<div class="note-theme">
						<ul>
							<li class="theme1 shadow" @click="setTheme(themes[0])"></li>
							<li class="theme2 shadow" @click="setTheme(themes[1])"></li>
							<li class="theme3 shadow" @click="setTheme(themes[2])"></li>
							<li class="theme4 shadow" @click="setTheme(themes[3])"></li>
							<li class="theme5 shadow" @click="setTheme(themes[4])"></li>
						</ul>
					</div>
					<!-- 노트 생성 버튼-->
					<div class="note-editor-bottom">
						<span @click="editorClose">
							<i class="fa-solid fa-circle-xmark text-shadow"></i>
						</span>
						<span @click="createNew">
							<i class="checkBtn fa-solid fa-circle-check text-shadow"> </i>
						</span>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
import { push, ref } from "firebase/database";
import moment from "moment";

import AddCategory from "./common/AddCategory.vue";

export default {
	components: { AddCategory },

	data: function () {
		return {
			title: { isEdit: false, text: "" }, // 노트 제목
			theme: { isOpen: false, theme: "#f4cccc" }, // 노트 테마
			text: { isEdit: false, text: "", html: "" }, // 노트 본문
			category: "기본", // 카테고리
			createDate: "", // 생성일자
			img: { isUpload: false, isDel: false, type: "", url: "" }, // 노트 이미지
			detected: { isOpen: false, text: "none" }, // 노트 이미지 객체 탐지
			translated: "", // 노트 번역
			mood: "", // 노트 이미지 감정 인식
			// help 모달 창 띄우기
			helps: {
				theme: false,
				img: false,
				voice: false,
				speak: false,
				detect: false,
				translate: false,
				mood: false,
			},

			// 노트 테마 색상
			themes: this.$store.state.themes,
		};
	},

	methods: {
		// 새 노트 생성
		createNew() {
			// 데이터 저장
			let text = {
				isEdit: false,
				text: this.text.text,
				html: this.text.text,
			};
			this.createDate = moment().format("YYYY-MM-DD ddd");

			// 새 노트
			let newNote = {
				title: this.title,
				theme: this.theme,
				text: text,
				category: this.category,
				createDate: this.createDate,
				img: this.img,
				detected: this.detected,
				translated: this.translated,
				mood: this.mood,
				helps: this.helps,
			};

			const db = this.$store.state.db;
			const user = this.$store.state.user;
			const noteRef = ref(db, `notes/${user.uid}`);
			push(noteRef, newNote);

			this.$store.commit("getNotes", user);
			this.$store.commit("getCategorys");
			this.$store.commit("openEditor");
			this.initEditor();
		},

		// 노트 색상 설정
		setTheme(theme) {
			this.theme = { isOpen: false, theme: theme };
		},

		// 노트 에디터 모달 닫기
		editorClose() {
			if (confirm("새 노트를 닫으시겠습니까?")) {
				this.$store.commit("openEditor");
			}
		},

		// 노트 에디터 내용 초기화
		initEditor() {
			const note = this.$store.state.note;
			this.title = note.title;
			this.text = note.text;
			this.theme = note.theme;
			this.category = note.category;
			this.createDate = "";
			this.img = note.img;
			this.detected = note.detected;
			this.translated = note.translated;
			this.mood = note.mood;
			this.helps = note.helps;
		},
	},
};
</script>

<style lang="scss" scoped>
.note-editor-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}

.note-editor-container {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: center;
	height: 100%;

	input {
		font-family: "Jua", "SUIT Variable", "Apple SD Gothic", "Open Sans", sans-serif;
		margin-bottom: 1rem;
	}
}

.note-editor {
	min-width: 20rem;
	min-height: 20rem;
	margin: 30px auto;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: #f4cccc;
	padding: 2rem;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	border-radius: 3px;
	transition: all 0.3s ease;

	textarea {
		padding: 10px;
		resize: none;
		border: none;
		color: #654b52;
		font-size: 1rem;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;

		&:hover {
			outline: 0;
		}
		&:focus {
			outline: 0;
		}
	}

	select {
		opacity: 1;
		cursor: pointer;
		border-radius: 4px;
	}

	i {
		font-size: 50px;
	}
}

.note-editor-main-title {
	color: white;
	margin-bottom: 1rem;
}

.title-input {
	font-size: 1.2rem;
	background-color: rgba(255, 255, 255, 0.3);
}

.note-editor-category {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	font-size: 1.2rem;

	select {
		border: 1px solid #654b52;
	}

	.add-category {
		margin-top: 0.2rem;
		margin-left: 0.5rem;
	}
}

.note-theme {
	padding: 0;
	margin: 0;
	width: 100%;

	ul {
		// background-color: rgba(255, 255, 255, 0.3);
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		padding: 0;
		margin-bottom: 1rem;
		border-radius: 3px;
	}

	li {
		list-style: none;
		padding: 2rem;
		background-color: #ffffff;
		border: 1px solid #654b52;
		margin: 2px;
		transition: 0.3s;
		opacity: 0.8;
		cursor: pointer;
		border-radius: 3px;

		&.theme1 {
			background-color: #f4cccc;
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

.title-input {
	padding: 10px;
	border: none;
	outline: none;
}

.title-input::placeholder {
	font-size: 18px;
}

.note-editor-bottom {
	display: flex;
	align-items: center;
	justify-content: flex-end;

	// font-size: 1rem;

	span {
		cursor: pointer;
		margin-left: 1.1rem;
		color: white;
		transition: all 0.3s ease;

		&:nth-child(1) {
			&:hover {
				color: #eb9f9f;
			}
		}
		&:nth-child(2) {
			&:hover {
				color: #654b52;
			}
		}

		i {
			font-size: 2rem;
			opacity: 0.7;

			&:hover {
				opacity: 1;
			}
		}
	}
}

.editor-enter {
	opacity: 0;
}
.editor-leave-active {
	opacity: 0;
}
.editor-enter .note-editor,
.editor-leave-active .note-editor {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>
