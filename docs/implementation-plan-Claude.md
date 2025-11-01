Claude’s Plan
ルーレットアプリ実装計画
技術スタック選定
HTML5: セマンティックなマークアップ
CSS3: Flexbox/Grid、CSS Variables、Transform/Transition
Vanilla JavaScript (ES6+): フレームワークなし（軽量化・高速化）
Canvas API: ルーレット描画（SVGより60fps達成しやすい）
ディレクトリ構成
roulette/
├── index.html          # メインHTML
├── css/
│   └── style.css      # スタイルシート
├── js/
│   ├── app.js         # メインアプリケーション
│   ├── roulette.js    # ルーレット描画・回転ロジック
│   └── utils.js       # ユーティリティ関数
├── docs/
│   └── requirements.md
└── .gitignore
実装ステップ（6段階）
1. プロジェクト基盤構築
HTML骨格作成（viewport設定、UTF-8指定）
CSS初期設定（リセットCSS、変数定義、縦向き強制CSS）
基本レイアウト（上部プルダウン、中央ルーレット、下部結果表示）
2. ルーレット描画機能
Canvas要素配置
20色のカラーパレット定義
枠数に応じた円形分割描画（2～20枠対応）
番号テキスト配置（時計回り）
画面上部ポインター（矢印）描画
3. 枠数設定UI
プルダウン（2～20）実装
変更時のルーレット再描画
結果表示クリア処理
回転中の無効化制御
4. 回転アニメーション
タッチイベント検出（touchstart/touchmove/touchend）
スワイプ速度計算（5～20秒にマッピング）
疑似乱数による当選枠決定
回転角度計算（当選枠が上部ポインターに来るように逆算）
requestAnimationFrameによる滑らかな回転
イージング関数（減速カーブ）実装
停止時のハイライト表示
5. フォールバック・補助機能
タッチイベント未対応検出
代替ボタンUI表示
結果表示テキスト更新
初期表示メッセージ（デフォルト4枠）
ARIA属性追加（アクセシビリティ）
6. GitHub Pages公開準備
.gitignore作成
動作確認（モバイルブラウザシミュレーション）
GitHub Pagesデプロイ設定
README.md作成（使い方）
実装の重要ポイント
ランダム性と自然な演出の両立
// 1. 疑似乱数で当選枠を決定
const winningSlot = Math.floor(Math.random() * slotCount) + 1;

// 2. 当選枠が上部ポインターに来る角度を逆算
const targetAngle = (360 / slotCount) * (slotCount - winningSlot + 1);

// 3. スワイプ強度に応じた回転数を追加（5～20秒）
const duration = map(swipeVelocity, minVel, maxVel, 5000, 20000);
const spins = 5 + Math.random() * 3; // 5～8回転
const finalAngle = targetAngle + (360 * spins);

// 4. イージング関数で自然な減速
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
60fps達成のためのCanvas最適化
willChange: transform CSS適用
Canvas解像度をデバイスピクセル比に対応
再描画を最小限に（回転時は回転のみ、枠数変更時のみ再描画）
横向き強制ブロック
@media screen and (orientation: landscape) {
  body::before {
    content: "縦向きでご利用ください";
    /* フルスクリーンオーバーレイ */
  }
}