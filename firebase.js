// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getDocs,
  orderBy,
  query,
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
const guestbookName = document.querySelector("#guestbookName");
const guestbookContent = document.querySelector("#guestbookContent");
const guestbookBtn = document.querySelector("#guestbookPostBtn");
const guestbook = document.querySelector("#guestbook");
guestbookBtn.addEventListener("click", async () => {
  const doc = {
    name: guestbookName.value,
    content: guestbookContent.value,
    timeStemp: new Date(),
  };
  await addDoc(collection(db, "guestbook"), doc).then(() => {
    alert("작성완료");
    return location.reload();
  });
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
  };
  const temp = `
    <li class="guestbook__item row">
    <div class="guestbook__name">${DBdata.name}</div>
    <div class="guestbook__content">${DBdata.content}</div>
    <div class="guestbook__date">${printTime(DBdata.timeStemp)}</div>
  </li>`;

  guestbook.insertAdjacentHTML("beforebegin", temp);
});

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
