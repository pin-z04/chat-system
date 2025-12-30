// Firebase 初始化 - 使用 compat 版本以配合現有聊天室程式碼
// https://firebase.google.com/docs/web/setup#available-libraries

// 你的 Firebase 專案設定
const firebaseConfig = {
  apiKey: "AIzaSyAWsJwsEmXW7NIpAznjXivKIXjjvFJnl0",
  authDomain: "chat-demo-9ca81.firebaseapp.com",
  databaseURL: "https://chat-demo-9ca81-default-rtdb.firebaseio.com",
  projectId: "chat-demo-9ca81",
  storageBucket: "chat-demo-9ca81.firebasestorage.app",
  messagingSenderId: "267315847674",
  appId: "1:267315847674:web:2ccf9f52278ccd8cd50443",
  measurementId: "G-HYT5FE0QBC"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// Realtime Database 物件
const db = firebase.database();

// 如果你想用分析功能也可以啟用
// const analytics = firebase.analytics();
