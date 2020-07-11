// LINE Notify アクセストークン
const LINE_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN");
// 鉄道路線名
const LINE_NAME = PropertiesService.getScriptProperties().getProperty("LINE_NAME");
// 遅延情報
var delayInfo = "";

// 遅延情報あれば通知、なければ何もしない
function notify() {
  if (isDelay(getDelayInfo())) {
    sendDelayInfo(delayInfo);
  }
}

// 電車が遅延しているか
function isDelay(json) {
  // 遅延していれば遅延情報の初期値を上書き
  if(json.find(j => j.name === LINE_NAME)) {
    delayInfo = LINE_NAME + "が遅延してるんご...。";
    return true;
  }
  return false;
}

// 遅延情報JSONを鉄道comのRSSから取得
function getDelayInfo() {
  return JSON.parse(
    UrlFetchApp.fetch(
      "https://tetsudo.rti-giken.jp/free/delay.json"
    ).getContentText()
  );
}

// 遅延情報をLINEへ送信
function sendDelayInfo(delayInfo) {
  const options = {
    method: "post",
    payload: "message=" + delayInfo,
    headers: {
      Authorization: "Bearer " + LINE_ACCESS_TOKEN
    }
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
