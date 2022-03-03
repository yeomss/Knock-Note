<template>
	<div id="app">
		<div v-if="this.$store.state.user">
			<!-- 헤더 -->
			<AppHeader />

			<!-- 노트 에디터 생성-->
			<NoteEditor />

			<!-- 노트 부가적인 서비스 -->
			<div class="subContainer">
				<AppCategory @changeCategory="changeCategory" />
				<AppSearch @searchNote="searchNote" />
			</div>

			<!-- 노트 본문 서비스 -->
			<div class="contentsContainer" v-if="this.$store.state.notes">
				<!-- 노트 todoList -->
				<TodoContainer />
				<hr />
				<!-- 노트 목록 -->
				<NoteContainer
					v-if="this.$store.state.categorys"
					:categorys="this.$store.state.categorys"
					:selectedCategory="category"
					:searchTxt="search"
					:model="model"
				/>
				<Loading v-else />
			</div>
			<Loading v-else />
		</div>
		<Loading v-else />
	</div>
</template>

<script>
/* eslint-disable */
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import "@tensorflow/tfjs";
import * as cocoSSD from "@tensorflow-models/coco-ssd";

import AppHeader from "./components/AppHeader.vue";
import NoteEditor from "./components/NoteEditor.vue";
import AppCategory from "./components/AppCategory.vue";
import AppSearch from "./components/AppSearch.vue";
import TodoContainer from "./components/TodoContainer.vue";
import NoteContainer from "./components/NoteContainer.vue";
import Loading from "./components/common/Loading.vue";

export default {
	name: "App",

	// 컴포넌트
	components: {
		AppHeader,
		NoteEditor,
		AppCategory,
		AppSearch,
		NoteContainer,
		TodoContainer,
		Loading,
	},

	// 데이터
	data: function () {
		return {
			// 데이터
			category: "", // 설정한 카테고리
			search: "", // 검색하려는 키워드

			// 객체 탐지
			model: null,
		};
	},

	// 함수
	methods: {
		// 노트 키워드 검색
		searchNote(text) {
			this.search = text;
		},

		// 노트 카테고리 검색
		changeCategory(selected) {
			this.category = selected;
		},

		// user 정보 가져오기
		async getUser() {
			// firebase 인증
			const auth = await this.$store.state.auth;
			await signInAnonymously(auth);

			try {
				onAuthStateChanged(auth, (user) => {
					console.log("uid:", user.uid);
					this.user = user;
					this.$store.commit("setUser", user);
					this.$store.commit("getNotes", user);
					this.$store.commit("getCategorys");
					this.$store.commit("getTodos");
				});
			} catch (err) {
				console.log(err);
			}
		},
	},

	async created() {
		await this.getUser();
		this.model = await cocoSSD.load(); // Promise 객체를 반환.
	},
};
</script>

<style lang="scss">
@import "/styles/global.scss";
@import "/styles/mobile.scss";
@import "/styles/pad.scss";
</style>
