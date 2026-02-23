import pandas as pd
import json

def update_json():
    # 讀取你之前 AI 掃描存下的戰績
    try:
        df = pd.read_csv('trade_history.csv')
        # 只取最新的 6 筆，展示在網頁預警牆上
        latest_stocks = df.tail(6).to_dict(orient='records')
        
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(latest_stocks, f, ensure_all_chars=False, indent=4)
        print("✅ 網頁數據已同步更新！")
    except Exception as e:
        print(f"❌ 更新失敗: {e}")

if __name__ == "__main__":
    update_json()