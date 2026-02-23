import pandas as pd
import json
import os
from datetime import datetime

def update_web_data():
    csv_file = 'inference_results.csv'
    json_output = 'data.json'
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 啟動數據引擎...")

    # 檢查是否有 CSV，若無則建立測試數據
    if not os.path.exists(csv_file):
        print(f"ℹ️ 提示: 找不到 {csv_file}，正在為您建立測試數據...")
        test_data = [
            {"代號": "2330", "信心度": 0.98, "現價": 1025, "型態": "W底成形"},
            {"代號": "2317", "信心度": 0.85, "現價": 210, "型態": "突破頸線"},
            {"代號": "2454", "信心度": 0.92, "現價": 1250, "型態": "底部放量"}
        ]
        df = pd.DataFrame(test_data)
    else:
        print(f"✅ 找到 {csv_file}，正在讀取實測數據...")
        df = pd.read_csv(csv_file)

    try:
        # 轉換為字典列表
        data_list = df.to_dict(orient='records')

        # 產出 data.json (確保中文不亂碼)
        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(data_list, f, ensure_ascii=False, indent=4)
        
        print(f"✨ 成功! 已生成 {json_output}")
        print(f"🚀 現在請將 {json_output} 上傳到 GitHub，網頁就會出現股票卡片了！")

    except Exception as e:
        print(f"❌ 更新失敗: {str(e)}")

if __name__ == "__main__":
    update_web_data()
