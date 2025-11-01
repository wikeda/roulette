## ルーレットアプリ 実装計画（Cursor版・MVP）

### 1. スコープ
- フロントのみ（HTML/CSS/TypeScript）で完結
- モバイル最適化（縦向き・～768px 幅）
- GitHub Pages でホスティング
- 対象機能: 要件 7.x（等分描画/枠数UI/スワイプ慣性/フォールバック/初期表示）

### 2. 技術スタック/方針
- ビルド: Vite + TypeScript
- 描画: `<canvas>` + requestAnimationFrame
- 入力: Pointer Events（タッチ/マウス統合）
- スタイル: 素のCSS（必要最小限）
- テスト: Vitest（単体）/ Playwright（E2E 任意）

### 3. ディレクトリ（案）
```
roulette/
  index.html
  src/
    main.ts
    styles.css
    core/
      Roulette.ts
      SpinPhysics.ts
      Random.ts
      InputGuard.ts
    ui/
      Controls.ts
      ResultView.ts
  public/
  vite.config.ts
  package.json
```

### 4. 実装ステップ（Cursorでの作業順）
1) ひな形作成: Vite + TS、ESLint/Prettier 導入
2) Canvas描画: 等分・番号・配色（最大20色）・ポインター
3) 枠数UI: 2–20 プルダウン → 再描画/結果クリア
4) 当選整合: 先決当選枠と停止角の一致（総回転量オフセット）
5) スワイプ慣性: 5–20秒の可変・ease-out 減速
6) 入力ガード: 回転中UI/イベント無効化→停止後復帰
7) フォールバック: タッチ不可でボタン回転（時間ランダム）
8) 初期状態: 4枠・初回案内メッセージ
9) A11y/性能: aria-live/コントラスト・60fps目標
10) テスト: 単体（角度→枠/当選整合/ガード）/ E2E（操作フロー）
11) デプロイ: Pages CI（build→dist公開）

### 5. 主要実装ポイント
- 角度→枠判定: 境界角配列を事前計算し二分探索
- 当選整合: `base + k*2π + offset(slot)` を満たす回転量を算出
- 配色: 20色パレット循環（近接色回避）
- 入力制御: `isSpinning` でイベント/UI ブロック

### 6. コマンド例（PowerShell）
```powershell
npm create vite@latest roulette-app -- --template vanilla-ts --yes
cd roulette-app
npm i
npm i -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm run dev
# ビルド
npm run build
```

### 7. テスト計画
- 単体: `angleToSlot`、当選整合計算、入力ガード
- E2E: 枠数変更→再描画、スワイプ時間レンジ、停止後の操作復帰/結果一致

### 8. デプロイ（GitHub Pages）
- CI: `npm ci && npm run build`、`dist/` を Pages 公開
- アセットはハッシュ付き（Vite デフォルト）

### 9. 完了条件
- 要件 7.x/8.x/10 を満たすこと
- Pages 上で 2–20 枠、スワイプ/フォールバックが動作
- 初期4枠・結果表示・操作ガードが仕様通り


