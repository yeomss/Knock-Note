// import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
// // import { push, ref } from "firebase/database";
// // import moment from "moment";

// async function getUserAuth() {
// 	// firebase 인증
// 	const auth = getAuth();
// 	await signInAnonymously(auth);

// 	try {
// 		// 익명으로 회원 생성
// 		onAuthStateChanged(auth, (user) => {
// 			console.log("user load");
// 			console.log(user.uid);
// 			return user;
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// export { getUserAuth };
