// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
  query,
  collection,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf_3WBJPu6MKbNEMfUgfax2lDC9ak3Vtw",
  authDomain: "project-aio-5bd0b.firebaseapp.com",
  projectId: "project-aio-5bd0b",
  storageBucket: "project-aio-5bd0b.appspot.com",
  messagingSenderId: "621704712403",
  appId: "1:621704712403:web:641d1fc1be5e5162a1c426",
  measurementId: "G-4SSWQ0C6LS",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Post
const guestbook = document.querySelector("#guestbook");
const guestbookName = document.querySelector("#guestbookName");
const guestbookContent = document.querySelector("#guestbookContent");
const guestbookPassword = document.querySelector("#guestbookPassword");
const guestbookBtn = document.querySelector("#guestbookPostBtn");
guestbookBtn.addEventListener("click", () => {
  const doc = {
    name: guestbookName.value,
    password: guestbookPassword.value,
    content: guestbookContent.value,
    timeStemp: new Date(),
  };

  if (!doc.name) {
    return alert("닉네임을 입력해주세요!");
  } else if (!doc.content) {
    return alert("내용을 입력해주세요!");
  } else if (!doc.password) {
    return alert("비밀번호를 입력해주세요!");
  } else {
    addDoc(collection(db, "guestbook"), doc).then(() => {
      alert("작성완료!\n방명록을 남겨주셔서 감사합니다!");
      return location.reload();
    });
  }
});

//Get
const docs = await getDocs(
  query(collection(db, "guestbook"), orderBy("timeStemp", "desc"))
);
docs.forEach((doc) => {
  const DBdata = {
    name: doc.data().name,
    content: doc.data().content,
    timeStemp: doc.data().timeStemp.toDate(),
    id: doc.id,
  };
  const temp = `
    <li class="guestbook__item row" data-id=${DBdata.id}>
    <div class="guestbook__name">${DBdata.name}</div>
    <div class="guestbook__content">${DBdata.content}</div>
    <div class="guestbook__date">${printTime(DBdata.timeStemp)}</div>
    <button  class="guestbook__btn guestbook__btn-toggle">삭제</button>
    <div class="guestbook_delete-form  row">
    <input
      type="password"
      class="guestbook__input"
      placeholder="비밀번호"
    />
    <button class="guestbook__btn guestbook__btn-delete">삭제</button>
    <button class="guestbook__btn guestbook__btn-toggle">취소</button>
  </div>
  </li>`;
  guestbook.insertAdjacentHTML("beforeend", temp);

  const liElement = guestbook.lastElementChild;
  const toggleBtn = liElement.querySelectorAll(".guestbook__btn-toggle");
  const deleteBtn = liElement.querySelector(".guestbook__btn-delete");
  const password = liElement.querySelector("input[type='password']");

  liElement.addEventListener("click", function (e) {
    // 토글버튼
    if (e.target === toggleBtn[0] || e.target === toggleBtn[1]) {
      this.classList.toggle("guestbook__item-active");
    }

    // 삭제기능
    if (e.target === deleteBtn) {
      confirm("해당 방명록을 삭제하겠습니까?")
        ? deleteItem(DBdata.id, password.value)
        : null;
    }
  });
});

// Delete
const deleteItem = async function (docId, pw) {
  const docRef = doc(db, "guestbook", String(docId));
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docPw = docSnap.data().password;
    const checkPw = pw == docPw;
    console.log(checkPw);
    if (checkPw) {
      await deleteDoc(docRef);
      alert("삭제 완료");
    } else {
      alert("비밀번호가 다릅니다.");
    }
  } else {
    alert("해당 문서가 존재하지 않습니다.");
  }
};

/**
 * 파이어베이스에 있는 timeStemp를 오늘이면 시:분:초
 * 오늘이 아니면 연도.월.일 로 출력하는 함수
 * @param {Date} timeStemp 파이어베이스에 저장된 timeStemp
 * @returns {String} 오늘이면 시:분:초, 오늘이 아니면 연도.월.일
 */
function printTime(timeStemp) {
  const nowDate = new Date();
  const DBDate = new Date(timeStemp);
  const check = [
    nowDate.getFullYear() === DBDate.getFullYear(),
    nowDate.getMonth() === DBDate.getMonth(),
    nowDate.getDate() === DBDate.getDate(),
  ];
  const newDataFormat = {
    year: String(DBDate.getFullYear()).substring(2),
    month: String(DBDate.getMonth() + 1).padStart(2, "0"),
    date: String(DBDate.getDate()).padStart(2, "0"),
    hour: String(DBDate.getHours()).padStart(2, "0"),
    min: String(DBDate.getMinutes()).padStart(2, "0"),
    sec: String(DBDate.getSeconds()).padStart(2, "0"),
  };

  if (check[0] && check[1] && check[2]) {
    let arr = [newDataFormat.hour, newDataFormat.min, newDataFormat.sec];
    return arr.join(":");
  } else {
    let arr = [newDataFormat.year, newDataFormat.month, newDataFormat.date];
    return arr.join(".");
  }
}
