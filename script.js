import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 🔴 這裡一定要改！請從 Firebase 專案設定複製貼上
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDYRcZPFLAjeRtfR0_V8WgE4xzPTv-2f5Y",
  authDomain: "aiai-4eef3.firebaseapp.com",
  projectId: "aiai-4eef3",
  storageBucket: "aiai-4eef3.firebasestorage.app",
  messagingSenderId: "554751127008",
  appId: "1:554751127008:web:d902be6fb5c12f7f660f85",
  measurementId: "G-NCV9HDP8GP"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ==========================================
// 1. Google 登入功能
// ==========================================
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const commentInputArea = document.getElementById('comment-input-area');
const authReminder = document.getElementById('auth-reminder');

loginBtn.addEventListener('click', () => {
  if (!auth.currentUser) {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("登入成功:", result.user.displayName);
      })
      .catch((error) => {
        console.error("登入失敗:", error);
        alert("登入失敗，請檢查 Firebase 授權網域設定");
      });
  } else {
    signOut(auth);
  }
});

// 監聽登入狀態切換 UI
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.innerText = "登出";
    userInfo.innerText = `歡迎，${user.displayName}`;
    commentInputArea.classList.remove('hidden');
    authReminder.classList.add('hidden');
  } else {
    loginBtn.innerText = "Google 登入";
    userInfo.innerText = "";
    commentInputArea.classList.add('hidden');
    authReminder.classList.remove('hidden');
  }
});

// ==========================================
// 2. AI 預警牆數據抓取 (抓取 data.json)
// ==========================================
async function fetchAIData() {
  const stockGrid = document.getElementById('stock-grid');
  const updateTime = document.getElementById('update-time');

  try {
    // 🔴 確保你有把 Python 生成的 data.json 上傳到 GitHub
    const response = await fetch('data.json');
    const stocks = await response.json();

    stockGrid.innerHTML = ""; // 清空舊數據
    updateTime.innerText = `AI 監控系統運行中：最後同步時間 ${new Date().toLocaleTimeString()}`;

    stocks.forEach(stock => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${stock.代號} <span class="gold-text">${stock.型態 || '偵測中'}</span></h3>
        <p>信心度: ${(stock.信心度 * 100).toFixed(1)}%</p>
        <p>現價: <span class="gold-text">${stock.現價}</span></p>
      `;
      stockGrid.appendChild(card);
    });
  } catch (error) {
    console.error("無法載入 data.json:", error);
    stockGrid.innerHTML = "<p>數據同步中，請確保已上傳 data.json ...</p>";
  }
}

// ==========================================
// 3. 討論區留言功能
// ==========================================
const postBtn = document.getElementById('post-btn');
const commentText = document.getElementById('comment-text');
const commentsDisplay = document.getElementById('comments-display');

postBtn.addEventListener('click', async () => {
  const text = commentText.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "comments"), {
      uid: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      text: text,
      timestamp: serverTimestamp()
    });
    commentText.value = "";
  } catch (e) {
    console.error("留言失敗:", e);
  }
});

// 即時監聽留言板
const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  commentsDisplay.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `<strong>${data.userName}</strong>: ${data.text}`;
    commentsDisplay.appendChild(item);
  });
});

// 啟動圖表與數據
fetchAIData();

// TradingView 圖表初始化
new TradingView.widget({
  "width": "100%",
  "height": 500,
  "symbol": "TWSE:2330",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "dark",
  "style": "1",
  "locale": "zh_TW",
  "container_id": "tradingview_widget"
});
