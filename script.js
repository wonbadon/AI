// 1. 引入 Firebase SDK (CDN 模組化版本)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. 你的專屬 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDYRcZPFLAjeRtfR0_V8WgE4xzPTv-2f5Y",
  authDomain: "aiai-4eef3.firebaseapp.com",
  projectId: "aiai-4eef3",
  storageBucket: "aiai-4eef3.appspot.com",
  messagingSenderId: "554751127008",
  appId: "1:554751127008:web:d902be6fb5c12f7f660f85",
  measurementId: "G-NCV9HDP8GP"
};

// 3. 初始化服務
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

// --- 介面元素控制 ---
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const authReminder = document.getElementById('auth-reminder');
const commentInputArea = document.getElementById('comment-input-area');
const postBtn = document.getElementById('post-btn');
const commentText = document.getElementById('comment-text');
const commentsDisplay = document.getElementById('comments-display');

// 4. 初始化功能
document.addEventListener('DOMContentLoaded', () => {
    initTradingView();
    fetchAIData();
    updateSystemTime();
});

// --- 5. 會員登入邏輯 ---
loginBtn.onclick = () => {
    if (auth.currentUser) {
        signOut(auth).then(() => {
            alert("已登出系統");
        });
    } else {
        signInWithPopup(auth, provider).catch((error) => {
            console.error("登入失敗:", error);
            alert("登入失敗，請檢查 Firebase 授權網域設定");
        });
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginBtn.innerText = "登出系統";
        userInfo.innerText = `歡迎回來，${user.displayName}`;
        authReminder.classList.add('hidden');
        commentInputArea.classList.remove('hidden');
    } else {
        loginBtn.innerText = "Google 登入";
        userInfo.innerText = "";
        authReminder.classList.remove('hidden');
        commentInputArea.classList.add('hidden');
    }
});

// --- 6. 實時討論區邏輯 ---
const q = query(collection(db, "comments"), orderBy("timestamp", "desc"), limit(20));

onSnapshot(q, (snapshot) => {
    commentsDisplay.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const time = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : "發送中...";
        const commentDiv = document.createElement('div');
        commentDiv.className = "comment-item";
        commentDiv.innerHTML = `
            <div class="comment-user">${data.userName} <span style="font-size:0.7rem; color:#666;">${time}</span></div>
            <div class="comment-content">${data.content}</div>
        `;
        commentsDisplay.appendChild(commentDiv);
    });
});

postBtn.onclick = async () => {
    const text = commentText.value.trim();
    if (!text || !auth.currentUser) return;

    try {
        await addDoc(collection(db, "comments"), {
            userName: auth.currentUser.displayName,
            content: text,
            timestamp: serverTimestamp()
        });
        commentText.value = "";
    } catch (e) {
        console.error("留言失敗:", e);
        alert("發送失敗，請確認資料庫權限已開啟");
    }
};

// --- 7. 專業看盤與數據載入 ---
function initTradingView() {
    new TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "TWSE:2330",
        "interval": "D",
        "timezone": "Asia/Taipei",
        "theme": "dark",
        "style": "1",
        "locale": "zh_TW",
        "container_id": "tradingview_widget"
    });
}

async function fetchAIData() {
    const stockGrid = document.getElementById('stock-grid');
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error();
        const stocks = await response.json();
        stockGrid.innerHTML = "";
        stocks.reverse().forEach(stock => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-tag">AI 確認</div>
                <h3>${stock.代號}</h3>
                <p>信心度: <span class="gold-text">${(stock.信心度 * 100).toFixed(0)}%</span></p>
                <p>現價: ${stock.現價}</p>
                <button class="btn-outline" onclick="alert('請登入解鎖完整分析')">深度數據</button>
            `;
            stockGrid.innerHTML += card.outerHTML;
        });
    } catch (e) {
        stockGrid.innerHTML = `<div class="card"><h3>待更新</h3><p>下午盤後 AI 掃描數據同步中</p></div>`;
    }
}

function updateSystemTime() {
    const timeEl = document.getElementById('update-time');
    const now = new Date();
    timeEl.innerText = `AI 監控系統運行中：最新同步時間 ${now.toLocaleString()}`;
}

// 平滑捲動
window.scrollToId = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
