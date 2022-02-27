<template>
	<Transition name="editor">
		<div class="note-editor-mask" v-if="editorOpen">
			<div class="note-editor-container">
				<div class="note-editor">
					<!-- <div @click="uploadImg">load</div> -->
					<div>New Knock 👋</div>

					<!-- 노트 카테고리 선택 -->
					<div>
						<select v-model="category">
							<option v-for="c in categorys" :key="c">
								{{ c }}
							</option>
							<option>카테고리 추가</option>
						</select>

						<AddCategory
							v-if="category == '카테고리 추가'"
							:db="db"
							:user="user"
						/>
					</div>

					<!-- 노트 테마 선택-->
					<div class="note-theme">
						<ul>
							<li
								class="theme1"
								@click="setTheme(themes[0])"
							></li>
							<li
								class="theme2"
								@click="setTheme(themes[1])"
							></li>
							<li
								class="theme3"
								@click="setTheme(themes[2])"
							></li>
							<li
								class="theme4"
								@click="setTheme(themes[3])"
							></li>
							<li
								class="theme5"
								@click="setTheme(themes[4])"
							></li>
						</ul>
					</div>

					<!-- 노트 제목 입력 창 -->
					<input
						class="title-input"
						type="text"
						v-model="title"
						placeholder="Title"
					/>

					<!-- 노트 본문 입력 창 -->
					<textarea
						rows="10"
						v-model="text"
						placeholder="똑똑 노트 두드립시다 📝"
					></textarea>

					<!-- 노트 이미지 -->
					<!-- <div class="note-img">
						<input type="file" @change="loadImg" />
					</div> -->

					<!-- 노트 생성 버튼-->
					<div class="note-editor-bottom">
						<span @click="editorClose">
							<i class="fa-solid fa-circle-xmark"></i>
						</span>
						<span @click="createNew">
							<i class="checkBtn fa-solid fa-circle-check"> </i>
						</span>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
import { push, ref as dbRef } from "firebase/database";
// import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import moment from "moment";

import AddCategory from "./common/AddCategory.vue";

export default {
	props: ["editorOpen", "app", "db", "user", "storage", "categorys"],

	components: { AddCategory },

	data: function () {
		return {
			title: "", // 노트 제목
			theme: { isOpen: false, theme: "#f4cccc" }, // 노트 테마
			text: "", // 노트 본문
			category: "", // 카테고리
			createDate: moment().format("YYYY-MM-DD ddd"), // 생성일자
			img: { isUpload: false, type: "", url: "" }, // 노트 이미지

			// 노트 테마 색상
			themes: ["#F4CCCC", "#EB9F9F", "#E7D9E7", "#FFF2CC", "#F2F2F2"],
		};
	},

	methods: {
		// 새 노트 생성
		async createNew() {
			// 데이터 저장
			let uid = this.user.uid;

			// 새 노트
			let newNote = {
				title: this.title,
				theme: this.theme,
				text: this.text,
				category: this.category,
				createDate: this.createDate,
				img: this.img,
			};

			push(dbRef(this.db, "notes/" + uid), newNote); // db에 노트 정보 저장

			this.$emit("editorClose");
			this.initEditor();
		},

		// 노트 색상 설정
		setTheme(theme) {
			this.theme = { isOpen: false, theme: theme };
		},

		// 노트 이미지 로드
		loadImg(e) {
			// 이미지 파일 객체
			// onChange 랑 async 랑 뭔가 같이 있으면 오류가 난다..
			// 그래서 따로 이미지 로드하는 함수를 따로 빼둠.
			this.imgFile = e.target.files[0];
			this.img = this.imgFile.name;
		},

		// 노트 삭제
		deleteNote(index) {
			this.$emit("noteDeleted", index);
		},

		// 노트 에디터 모달 닫기
		editorClose() {
			if (confirm("새 노트를 닫으시겠습니까?")) {
				this.$emit("editorClose");
			}
		},

		// 노트 에디터 내용 초기화
		initEditor() {
			this.title = "";
			this.text = "";
			this.theme = { isOpen: false, theme: "#f4cccc" };
			this.category = "";
			this.createDate = "";
			this.img = { isUpload: false, type: "", url: "" };
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
}

.note-editor {
	min-width: 600px;
	min-height: 600px;
	margin: 30px auto;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: #f4cccc;
	padding: 25px;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	border-radius: 3px;
	transition: all 0.3s;

	textarea {
		padding: 10px;
		resize: none;
		border: none;
		&:hover {
			outline: 0;
		}
		&:focus {
			outline: 0;
		}
	}

	i {
		font-size: 50px;
	}
}

.note-theme {
	ul {
		background-color: #654b52;
		display: flex;
		flex-direction: row;
		padding: 5px;
		margin: 0;
	}

	li {
		list-style: none;
		padding: 25px;
		background-color: #ffffff;
		margin: 2px;
		transition: 0.3s;
		opacity: 0.8;

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
	&span {
		widows: 100px;
		height: 100px;
	}

	// display: flex;
	// flex-direction: row-reverse;
	// align-items: flex-end;
	// flex-wrap: wrap;
}

// 트랜지션
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
