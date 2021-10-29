export default {
  categorys: JSON.parse(localStorage.getItem("categorys")), // 카테고리 종류
  isCategoryModalShow: false, // 카테고리 수정 모달
  selectedCategory: "전체", // 필터링 되는 카테고리
  categoryMain: false,

  imgUrl: null, // 이미지 url
  imgIndex: -1, // 해당 이미지 인덱스
  imgFile: null, // 해당 이미지 파일 객체 담는 변수
  fileReader: null, // 해당 이미지 파일 객체
  themes: ["#F4CCCC", "#EB9F9F", "#E7D9E7", "#FFF2CC", "#F2F2F2"], // 노트의 색상 종류

  model: null,
  webcam: null,
  predictedLock: null,

  notes: [
    {
      category: "기본", // 카테고리
      user: "user1", // 사용자
      title: "예시노트1", // 노트 제목
      text: "첫번째 노트입니다", // 노트 내용
      theme: "#F4CCCC", // 노트 색상
      time: "2020-10-25 Sun", // 노트 날짜
      emotion: "NoteKnock", // 감정 인식 내용
      isFavorite: false, // 노드가 즐겨찾기되어 있는가
      isThemeModalShow: false, // 노트 색상 모달
      toDoList: [], // 투두 리스트
      toDoChecked: [], // 투두 노트 체크되었는가
      listCount: 1, // ?
      isBold: false, // 노트 전체 내용 bold
      isUnder: false, // underline
      isIncli: false, // incli
      imgPath: "", // 노트 이미지 주소
      contentModal: false, // 노트 내용 지우기 모달
      isLock: false, // 노트가 잠겼는지
      lockAnswer: false, // ?
      lockValue: "", // 잠금 비번
      webCamStart: false, // 캠이 시작헀는지
      isLockModal: false, // 잠금 모달 열렸는가
      filename: "", // ?
      predictedImage: "", // 인식된 이미지
      imgComment: "인식하지 못하였습니다.", // ?
      translatedText: "", // 번역될 텍스트
      translateModal: false, // 번역되는 텍스트가 뜨는 창
    },
    {
      category: "To-do List",
      user: "user2",
      title: "예시노트2",
      text: "카테고리에 따라 바뀌는 내용입니다",
      theme: "#FFF2CC",
      time: "2020-10-25 Sun",
      emotion: "NoteKnock",
      isFavorite: true,
      isThemeModalShow: false,
      toDoList: [],
      toDoChecked: [],
      listCount: 1,
      isBold: false,
      isUnder: false,
      isIncli: false,
      imgPath: "",
      contentModal: false,
      isLock: false,
      lockAnswer: false,
      lockValue: "",
      webCamStart: false,
      isLockModal: false,
      filename: "",
      predictedImage: "",
      imgComment: "인식하지 못하였습니다.",
      translatedText: "",
      translateModal: false,
    },
  ],
};
