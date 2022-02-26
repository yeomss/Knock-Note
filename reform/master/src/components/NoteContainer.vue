<template>
	<div class="noteContainer">
		<!-- <div @click="temp">하이루</div> -->

		<div
			v-for="(note, key) in notes"
			:key="`note-${key}`"
			class="note"
			:style="{ 'background-color': note.theme }"
		>
			<div>
				<!-- 삭제 버튼 -->
				<span class="delete" @click.prevent="deleteNote(key)">
					<i class="fas fa-times"></i>
				</span>

				<!-- 노트 제목 -->
				<span>{{ note.title }}</span>

				<!-- 노트 서브 -->
				<div>{{ note.createDate }} {{ note.category }}</div>

				<!-- 노트 이미지 -->
				<div>이미지 <img :src="note.imgUrl" />{{ note.imgUrl }}</div>

				<!-- 노트 본문-->
				<p class="note-text">{{ note.text }}</p>

				<!-- 노트 테마 -->
				<div>노트테마{{ note.theme }}</div>
			</div>
		</div>
	</div>
</template>

<script>
// import { doc, getDoc } from "firebase/firestore";
// import { ref } from "firebase/storage";

export default {
	props: ["notes", "selectedCategory", "searchTxt", "user", "storage"],

	data() {
		return {
			filterNotes: null,
		};
	},

	methods: {
		// 노트 삭제
		deleteNote(key) {
			this.$emit("deleteNote", key);
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
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	min-width: 32rem;
	// flex-basis: 500px;
	// width: 100%;
}

.note {
	display: flex;
	flex-direction: column;
	position: relative;
	min-width: 20rem;
	min-height: 25rem;
	max-height: 25rem;
	background: #fff;
	border-radius: 3px;
	box-shadow: 0 2px 2px rgba(0, 90, 250, 0.05),
		0 4px 4px rgba(0, 90, 250, 0.05), 0 8px 8px rgba(0, 90, 250, 0.05),
		0 16px 16px rgba(0, 90, 250, 0.05);
	box-sizing: border-box;
	margin: 15px;
	padding: 25px;
	word-break: break-word;
	cursor: pointer;

	img {
		width: 200px;
	}
}
</style>
