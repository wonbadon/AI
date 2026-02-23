:root {
    --bg: #0d1117;
    --card: #161b22;
    --gold: #f0ad4e;
    --border: #30363d;
    --text: #c9d1d9;
}

body { background: var(--bg); color: var(--text); font-family: sans-serif; margin: 0; }
.container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
.hidden { display: none; }

/* 呼吸燈效果 */
.status-dot {
    display: inline-block; width: 10px; height: 10px; background: #238636;
    border-radius: 50%; margin-right: 8px; animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(35, 134, 54, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(35, 134, 54, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(35, 134, 54, 0); }
}

/* 績效牆表格 */
.performance-table { width: 100%; border-collapse: collapse; background: var(--card); border-radius: 8px; overflow: hidden; }
.performance-table th, .performance-table td { padding: 15px; border-bottom: 1px solid var(--border); text-align: center; }
.gain-positive { color: #39d353; font-weight: bold; }

/* 討論區 */
.comment-box { background: var(--card); padding: 20px; border-radius: 12px; border: 1px solid var(--border); }
#comment-text { width: 100%; height: 80px; background: #0d1117; color: white; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; }
.comment-item { border-bottom: 1px solid var(--border); padding: 10px 0; }
.btn-gold { background: var(--gold); border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }