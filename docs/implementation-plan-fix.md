# ルーレットアプリ 実装計画（修正版）

## 概要
- **対象**: `docs/requirements.md` で定義したスマホ特化ルーレットアプリ
- **ゴール**: GitHub Pages で稼働する MVP を段階的に完成させる
- **方針**: 機能フェーズを 4 つに分割し、各フェーズでレビュー可能な成果物を用意する

## 技術スタック
- **ビルドツール**: なし（純粋な HTML/CSS/JavaScript で開始、必要なら後からツール導入）
- **描画**: Canvas API（SVGより60fps達成しやすい）
- **入力**: Touch Events（タッチ操作）
- **スタイル**: 素のCSS（CSS Variables、Flexbox/Grid活用）
- **アニメーション**: requestAnimationFrame

## ディレクトリ構成

```
roulette/
├── index.html          # メインHTML
├── css/
│   └── style.css      # スタイルシート
├── js/
│   ├── app.js         # メインアプリケーション・初期化
│   ├── roulette.js    # ルーレット描画・回転ロジック
│   └── utils.js       # ユーティリティ関数（乱数、色管理等）
├── docs/
│   └── requirements.md
├── README.md
└── .gitignore
```

---

## フェーズ構成

### フェーズ1: プロジェクト初期化

#### 成果物
ベースとなるリポジトリ構成、開発ドキュメント

#### 主な作業
1. **基本ファイル作成**
   - `index.html` にビューポート設定と基本レイアウトを作成
     ```html
     <!DOCTYPE html>
     <html lang="ja">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
       <title>ルーレットアプリ</title>
       <link rel="stylesheet" href="css/style.css">
     </head>
     <body>
       <header>
         <label for="slot-count">枠数:</label>
         <select id="slot-count"></select>
       </header>
       <main>
         <div id="pointer"></div>
         <canvas id="roulette-canvas"></canvas>
         <button id="spin-button" style="display: none;">回転</button>
       </main>
       <section id="result-area">
         <p id="result-text">ルーレットを回してください</p>
       </section>
       <script src="js/utils.js"></script>
       <script src="js/roulette.js"></script>
       <script src="js/app.js"></script>
     </body>
     </html>
     ```

2. **CSSベース作成**
   - リセットCSS、CSS変数定義、縦向き強制CSS
     ```css
     :root {
       --primary-color: #333;
       --bg-color: #f5f5f5;
       --canvas-size: min(90vw, 90vh);
     }

     * {
       margin: 0;
       padding: 0;
       box-sizing: border-box;
     }

     body {
       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
       background: var(--bg-color);
       display: flex;
       flex-direction: column;
       align-items: center;
       min-height: 100vh;
       padding: 1rem;
     }

     /* 横向き強制ブロック */
     @media screen and (orientation: landscape) and (max-width: 768px) {
       body::before {
         content: "📱 縦向きでご利用ください";
         position: fixed;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background: rgba(0, 0, 0, 0.95);
         color: white;
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 1.5rem;
         z-index: 9999;
       }
     }
     ```

3. **GitHub Pages 公開手順メモ**
   - README.md に基本情報を記載

#### 検証ポイント
- スマホ幅での基本 UI 枠組みが崩れないか
- GitHub Pages で配信できる構成か

---

### フェーズ2: ルーレット描画と枠数管理

#### 成果物
枠数変更に追従するルーレット描画機能

#### 主な作業
1. **枠数プルダウン実装**
   - 2～20の選択肢を生成
   - 初期値は4枠（要件7.6に基づく）
     ```javascript
     // app.js
     const selectElement = document.getElementById('slot-count');
     for (let i = 2; i <= 20; i++) {
       const option = document.createElement('option');
       option.value = i;
       option.textContent = `${i}枠`;
       if (i === 4) option.selected = true; // デフォルト4枠
       selectElement.appendChild(option);
     }
     ```

2. **20色のカラーパレット定義**
   - HSL色空間で均等配置
     ```javascript
     // utils.js
     function generateColorPalette(count) {
       const colors = [];
       for (let i = 0; i < count; i++) {
         const hue = (i * 360 / count) % 360;
         colors.push(`hsl(${hue}, 70%, 60%)`);
       }
       return colors;
     }
     ```

3. **Canvas描画ロジック**
   - 円形セクションを等分割表示
   - 番号テキストを時計回りで配置（1→2→3...）
     ```javascript
     // roulette.js
     function drawRoulette(canvas, slotCount) {
       const ctx = canvas.getContext('2d');
       const centerX = canvas.width / 2;
       const centerY = canvas.height / 2;
       const radius = Math.min(centerX, centerY) - 20;
       const anglePerSlot = (2 * Math.PI) / slotCount;
       const colors = generateColorPalette(20);

       ctx.clearRect(0, 0, canvas.width, canvas.height);

       // 各枠を描画
       for (let i = 0; i < slotCount; i++) {
         const startAngle = i * anglePerSlot - Math.PI / 2; // 上部を0度基準
         const endAngle = startAngle + anglePerSlot;

         // 扇形描画
         ctx.beginPath();
         ctx.moveTo(centerX, centerY);
         ctx.arc(centerX, centerY, radius, startAngle, endAngle);
         ctx.closePath();
         ctx.fillStyle = colors[i % 20];
         ctx.fill();
         ctx.strokeStyle = '#fff';
         ctx.lineWidth = 2;
         ctx.stroke();

         // 番号テキスト描画（時計回り）
         const textAngle = startAngle + anglePerSlot / 2;
         const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
         const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
         ctx.save();
         ctx.translate(textX, textY);
         ctx.rotate(textAngle + Math.PI / 2);
         ctx.fillStyle = '#fff';
         ctx.font = 'bold 24px sans-serif';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText(i + 1, 0, 0);
         ctx.restore();
       }
     }
     ```

4. **画面上部ポインター描画**
   - CSSで三角形を作成
     ```css
     #pointer {
       width: 0;
       height: 0;
       border-left: 15px solid transparent;
       border-right: 15px solid transparent;
       border-top: 30px solid #e74c3c;
       position: absolute;
       top: 10%;
       left: 50%;
       transform: translateX(-50%);
       z-index: 10;
     }
     ```

5. **枠数変更時のイベント処理**
   - プルダウン変更で再描画＋結果クリア
     ```javascript
     // app.js
     selectElement.addEventListener('change', (e) => {
       if (!isSpinning) {
         const newSlotCount = parseInt(e.target.value);
         drawRoulette(canvas, newSlotCount);
         document.getElementById('result-text').textContent = 'ルーレットを回してください';
       }
     });
     ```

6. **回転状態フラグと UI 無効化の下準備**
   - `isSpinning` フラグで回転中はプルダウンを無効化

#### 検証ポイント
- 各枠数（2～20）での描画崩れがないか
- 色割り当てに偏りがないか
- プルダウン変更で正しく再描画されるか

---

### フェーズ3: スワイプ回転ロジック

#### 成果物
実際に指で回転でき、結果が表示されるルーレット

#### 主な作業

1. **ランダム性の実装（要件7.3準拠）**
   - **重要**: 当選枠は疑似乱数により事前に決定し、アニメーションは自然な物理演出として表現
     ```javascript
     // utils.js
     function decideWinningSlot(slotCount) {
       return Math.floor(Math.random() * slotCount) + 1;
     }

     function calculateFinalAngle(winningSlot, slotCount, swipeVelocity) {
       // 1. 当選枠が上部ポインターに来る角度を逆算
       const anglePerSlot = 360 / slotCount;
       const targetAngle = anglePerSlot * (slotCount - winningSlot + 1);

       // 2. スワイプ強度に応じた回転数を追加（5～8回転）
       const extraSpins = 5 + Math.random() * 3;
       const totalRotation = targetAngle + (360 * extraSpins);

       return totalRotation;
     }
     ```

2. **スワイプ速度計算と時間マッピング（要件7.3準拠）**
   - 回転アニメーション時間はスワイプの強さに応じて最短5秒、最長20秒
     ```javascript
     // roulette.js
     let touchStartY = 0;
     let touchStartTime = 0;

     canvas.addEventListener('touchstart', (e) => {
       if (isSpinning) return;
       touchStartY = e.touches[0].clientY;
       touchStartTime = Date.now();
     });

     canvas.addEventListener('touchend', (e) => {
       if (isSpinning) return;

       const touchEndY = e.changedTouches[0].clientY;
       const touchEndTime = Date.now();

       const distance = Math.abs(touchEndY - touchStartY);
       const duration = touchEndTime - touchStartTime;
       const velocity = distance / duration; // px/ms

       // 速度を5～20秒にマッピング
       const MIN_VEL = 0.5;
       const MAX_VEL = 3.0;
       const clampedVel = Math.max(MIN_VEL, Math.min(MAX_VEL, velocity));
       const animDuration = map(clampedVel, MIN_VEL, MAX_VEL, 5000, 20000);

       startSpin(animDuration);
     });

     function map(value, inMin, inMax, outMin, outMax) {
       return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
     }
     ```

3. **requestAnimationFrame ベースの慣性アニメーション**
   - イージング関数（減速カーブ）で自然な停止
     ```javascript
     // roulette.js
     function startSpin(duration) {
       isSpinning = true;
       document.getElementById('slot-count').disabled = true;

       const slotCount = parseInt(document.getElementById('slot-count').value);
       const winningSlot = decideWinningSlot(slotCount);
       const finalAngle = calculateFinalAngle(winningSlot, slotCount, 1);

       const startTime = performance.now();
       let currentRotation = 0;

       function animate(timestamp) {
         const elapsed = timestamp - startTime;
         const progress = Math.min(elapsed / duration, 1);

         // イージング関数（減速カーブ）
         const eased = easeOutCubic(progress);
         currentRotation = finalAngle * eased;

         // Canvas回転描画
         const ctx = canvas.getContext('2d');
         ctx.save();
         ctx.translate(canvas.width / 2, canvas.height / 2);
         ctx.rotate((currentRotation * Math.PI) / 180);
         ctx.translate(-canvas.width / 2, -canvas.height / 2);
         drawRoulette(canvas, slotCount);
         ctx.restore();

         if (progress < 1) {
           requestAnimationFrame(animate);
         } else {
           onSpinComplete(winningSlot);
         }
       }

       requestAnimationFrame(animate);
     }

     function easeOutCubic(t) {
       return 1 - Math.pow(1 - t, 3);
     }
     ```

4. **停止時の処理**
   - 当選枠ハイライト、結果表示、UI再有効化
     ```javascript
     // roulette.js
     function onSpinComplete(winningSlot) {
       isSpinning = false;
       document.getElementById('slot-count').disabled = false;

       // 結果表示
       const resultText = document.getElementById('result-text');
       resultText.textContent = `当選: ${winningSlot}`;
       resultText.setAttribute('aria-live', 'polite');

       // 当選枠ハイライト（次回実装で強調表示を追加可能）
     }
     ```

5. **状態マシン制御**
   - `idle` / `spinning` / `finished` で UI とイベントをガード
     ```javascript
     let isSpinning = false;

     canvas.addEventListener('touchmove', (e) => {
       if (isSpinning) {
         e.preventDefault(); // 回転中はスクロール無効化
       }
     }, { passive: false });
     ```

#### 検証ポイント
- スワイプ強弱で回転時間が5～20秒の範囲で変わるか
- 結果が正確に表示されるか
- 回転中に操作が受け付けられないか
- 停止位置が自然か（カクカクしないか）

---

### フェーズ4: 公開準備と品質確認

#### 成果物
公開可能なビルド、テスト手順、公開手順書

#### 主な作業

1. **フォールバック機能実装（要件7.5準拠）**
   - タッチイベントが取得できない環境ではボタンUIを表示
     ```javascript
     // app.js
     const isTouchDevice = 'ontouchstart' in window;
     const spinButton = document.getElementById('spin-button');

     if (!isTouchDevice) {
       spinButton.style.display = 'block';
       spinButton.addEventListener('click', () => {
         if (!isSpinning) {
           const randomDuration = 5000 + Math.random() * 15000; // 5～20秒
           startSpin(randomDuration);
         }
       });
     }
     ```

2. **Canvas解像度最適化**
   - Retina対応（デバイスピクセル比）
     ```javascript
     // app.js
     function setupCanvas(canvas) {
       const dpr = window.devicePixelRatio || 1;
       const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;

       canvas.width = size * dpr;
       canvas.height = size * dpr;
       canvas.style.width = `${size}px`;
       canvas.style.height = `${size}px`;

       const ctx = canvas.getContext('2d');
       ctx.scale(dpr, dpr);
     }
     ```

3. **パフォーマンス最適化**
   - CSS `will-change` 適用
     ```css
     #roulette-canvas {
       will-change: transform;
     }
     ```

4. **README.md 作成**
   - 利用方法、開発手順、対応環境を記載
     ```markdown
     # ルーレットアプリ

     ## 概要
     スマートフォン向けのシンプルなルーレットアプリです。

     ## 使い方
     1. 枠数を選択（2～20）
     2. ルーレットをスワイプして回転
     3. 結果が表示されます

     ## 開発
     - ビルド不要。index.htmlをブラウザで開くだけ。
     - GitHub Pagesで公開可能。

     ## 対応環境
     - iOS Safari（最新2バージョン）
     - Android Chrome（最新2バージョン）
     - 縦向き表示推奨
     ```

5. **手動テストケース整理**
   - 枠数変更、スワイプ強弱、結果整合性、UI無効化など

6. **GitHub Pages 公開設定**
   - リポジトリ設定で GitHub Pages を有効化
   - `main` ブランチのルートディレクトリまたは `docs/` を公開

7. **.gitignore 作成**
   ```
   .DS_Store
   *.log
   node_modules/
   ```

#### 検証ポイント
- GitHub Pages 上で問題なく動作するか
- 主要ブラウザ（Safari、Chrome、Edge）で崩れがないか
- Lighthouse スコアが合格ラインか

---

## 未決項目と意思決定タイミング

- **Canvas最適化手法**: 描画頻度調整が必要な場合はフェーズ3で検証
- **当選枠のハイライト方法**: 枠線を太くするか、色を明るくするかはフェーズ3で決定

---

## リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| **モバイル性能差** | 高 | フェーズ3で軽量化（Canvas 最適化、描画頻度調整）を検討 |
| **操作感の不一致** | 中 | フェーズ3で実機テスト／ユーザーフィードバックを組む |
| **GitHub Pages 公開遅延** | 低 | 早期に Pages 設定を検証、フェーズ4でデプロイ手順確立 |
| **低スペック端末での60fps未達** | 中 | requestAnimationFrameの最適化、描画ロジック簡素化 |
| **タッチイベント検出の不安定性** | 中 | しきい値調整、フォールバックボタンで対応 |

---

## 実装上の重要ポイント

### 1. ランダム性と自然な演出の両立（要件7.3の核心）

**課題**: 疑似乱数で結果を決めつつ、物理的に自然な回転に見せる

**解決策**:
```javascript
// ❌ 悪い例: 急に止まる
currentAngle = finalAngle;

// ✅ 良い例: 減速カーブで自然に
const eased = easeOutCubic(progress);
currentAngle = finalAngle * eased;
```

### 2. 60fps達成のための最適化

**重要施策**:
- `requestAnimationFrame` 使用（`setInterval` は避ける）
- Canvas全体を毎フレーム再描画（部分更新は複雑化するため避ける）
- デバイスピクセル比対応（Retina対応）
- `will-change: transform` でGPU加速

### 3. モバイルタッチイベントの扱い

**注意点**:
- `touchmove` でデフォルト動作を無効化（スクロール防止）
  ```javascript
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTouchMove(e);
  }, { passive: false });
  ```
- マルチタッチ対応は不要（1本指のみ検出）

---

## 参考タスク一覧

1. ✅ 初期 HTML/CSS/JS の雛形作成
2. ✅ プルダウン UI と状態管理実装（デフォルト4枠）
3. ✅ ルーレットセクション描画（Canvas確定）
4. ✅ 20色カラーパレット生成＋枠番号表示（時計回り）
5. ✅ スワイプジェスチャー検出と速度計算（5～20秒マッピング）
6. ✅ 疑似乱数による当選枠先決定ロジック
7. ✅ 慣性アニメーション（イージング関数）
8. ✅ 停止判定と結果ハイライト・表示
9. ✅ 回転中の操作ロック制御
10. ✅ フォールバックボタン実装
11. ✅ テストシナリオ整理と GitHub Pages 公開手順書作成

---

## まとめ

本実装計画は、要件定義書（requirements.md）に基づき、以下の点を重視して策定しました:

- ✅ **デフォルト4枠**（要件7.6）
- ✅ **回転時間5～20秒**（要件7.3）
- ✅ **疑似乱数+自然演出**（要件7.3）
- ✅ **ビルドツール不要**（要件9）
- ✅ **Canvas確定**（非機能要件8）
- ✅ **段階的な成果物**（MVP思想）

各フェーズ完了時にレビューを行い、仕様差異があれば `docs/requirements.md` を更新しながら進行してください。
