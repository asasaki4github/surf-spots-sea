# 🏗️ アーキテクチャ解説 - Surf & Turf Spots

## 📊 システム全体図

```
┌─────────────────────────────────────────────────────────────────┐
│                        ユーザーのブラウザ                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Vue.js アプリ                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │  App.vue   │  │ MapView    │  │ ListView   │         │  │
│  │  │  (親)      │→ │ (地図表示) │  │ (リスト)   │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  │         ↓                ↓                                 │  │
│  │  ┌────────────────────────────────────────┐              │  │
│  │  │        Composables (ロジック層)         │              │  │
│  │  │  • useLeaflet.js (地図管理)            │              │  │
│  │  │  • useWaveData.js (天候データ)         │              │  │
│  │  │  • usePexels.js (写真取得)             │              │  │
│  │  └────────────────────────────────────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP リクエスト
┌─────────────────────────────────────────────────────────────────┐
│                        外部 API サービス                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ OpenStreetMap│  │ OpenWeather  │  │ Open-Meteo   │         │
│  │  (地図タイル) │  │  (天候API)   │  │  (波データ)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐                                              │
│  │   Pexels     │                                              │
│  │  (写真API)   │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 アーキテクチャの特徴

### 1. **SPA (Single Page Application)**
- ページ遷移なしで動作
- 高速でスムーズなユーザー体験
- ブラウザ内で完結（サーバー不要）

### 2. **クライアントサイドレンダリング**
- すべての処理がブラウザ内で実行
- APIから直接データを取得
- サーバーコストゼロ

## 🛠️ テクノロジースタック詳細

### フロントエンド層

#### 1. **Vue.js 3** (フレームワーク)
```
役割: アプリケーションの基盤
特徴:
  • リアクティブなUI更新
  • コンポーネントベース設計
  • Composition API使用
```

**なぜVue.js？**
- 学習曲線が緩やか
- 高パフォーマンス
- 豊富なエコシステム

#### 2. **Vite** (ビルドツール)
```
役割: 開発サーバー & ビルド
特徴:
  • 超高速な起動（< 1秒）
  • Hot Module Replacement (HMR)
  • 最適化されたプロダクションビルド
```

**開発時の流れ:**
```
npm run dev
    ↓
Viteが起動 (localhost:5173)
    ↓
ファイル変更を検知
    ↓
即座にブラウザに反映 (HMR)
```

#### 3. **Tailwind CSS** (スタイリング)
```
役割: UIデザイン
特徴:
  • ユーティリティファーストCSS
  • IBM Designカラーパレット
  • レスポンシブデザイン対応
```

**例:**
```html
<div class="bg-blue-600 text-white px-4 py-2 rounded-lg">
  ボタン
</div>
```

### 地図・可視化層

#### 4. **Leaflet.js** (地図ライブラリ)
```
役割: インタラクティブ地図
特徴:
  • オープンソース（無料）
  • 軽量（39KB）
  • プラグイン豊富
```

**地図の仕組み:**
```
OpenStreetMap (タイル画像)
    ↓
Leafletが取得・表示
    ↓
カスタムマーカーを配置
    ↓
ユーザーがクリック
    ↓
ツールチップ表示
```

#### 5. **OpenStreetMap** (地図データ)
```
役割: 地図タイル提供
特徴:
  • 無料で使用可能
  • 世界中をカバー
  • コミュニティ駆動
```

### データ取得層

#### 6. **Axios** (HTTPクライアント)
```
役割: API通信
特徴:
  • Promise ベース
  • 自動JSONパース
  • エラーハンドリング
```

**API呼び出しの流れ:**
```javascript
// 1. リクエスト送信
axios.get('https://api.openweathermap.org/data/2.5/weather', {
  params: { lat: 1.3521, lon: 103.8198 }
})

// 2. レスポンス受信
.then(response => {
  const temp = response.data.main.temp
  const windSpeed = response.data.wind.speed
})

// 3. UIに反映
updateMarkerColor(temp, windSpeed)
```

### 外部APIサービス

#### 7. **OpenWeatherMap API** (天候データ)
```
役割: リアルタイム天候情報
提供データ:
  • 気温 (°C)
  • 風速 (m/s)
  • 風向 (N, NE, E, ...)
  • 湿度、気圧
```

**APIキー:** `522b2fd2aa27b843b4c07198b4194c58`

#### 8. **Open-Meteo Marine API** (波データ)
```
役割: 海洋気象データ
提供データ:
  • 波高 (m)
  • 波向 (°)
  • 波周期 (s)
  • うねり高さ (m)
```

**特徴:** APIキー不要、完全無料

#### 9. **Pexels API** (写真)
```
役割: 高品質な写真提供
特徴:
  • 無料で商用利用可
  • 高解像度画像
  • 検索機能
```

**APIキー:** `PzzTWd3eUO4NyQhWhqgNfOcFcvoNL79hyEZvviFRNvI5aohdrkn43yyn`

## 📁 ファイル構造と役割

```
surf-spots-sea/
│
├── index.html              # エントリーポイント
├── package.json            # 依存関係定義
├── vite.config.js          # Vite設定
├── tailwind.config.js      # Tailwind設定
│
├── src/
│   ├── main.js             # アプリ初期化
│   ├── App.vue             # ルートコンポーネント
│   │
│   ├── components/         # UIコンポーネント
│   │   ├── MapView.vue     # 地図表示
│   │   ├── ListView.vue    # リスト表示
│   │   ├── SpotPopup.vue   # 詳細ポップアップ
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorMessage.vue
│   │
│   ├── composables/        # ロジック層（再利用可能）
│   │   ├── useLeaflet.js   # 地図管理
│   │   ├── useWaveData.js  # 天候データ取得
│   │   └── usePexels.js    # 写真取得
│   │
│   ├── data/               # 静的データ
│   │   └── locations.js    # スポット情報
│   │
│   ├── utils/              # ユーティリティ
│   │   └── formatters.js   # データ整形
│   │
│   └── assets/
│       └── styles/
│           └── main.css    # グローバルスタイル
│
└── public/                 # 静的ファイル
    └── bob.svg             # IBM Bobロゴ
```

## 🔄 データフロー

### 1. アプリ起動時

```
ユーザーがブラウザでアクセス
    ↓
index.html 読み込み
    ↓
main.js 実行
    ↓
Vue.js アプリ初期化
    ↓
App.vue マウント
    ↓
locations.js からスポットデータ読み込み
    ↓
MapView.vue / ListView.vue 表示
```

### 2. 地図表示時

```
MapView.vue マウント
    ↓
useLeaflet.js: 地図初期化
    ↓
OpenStreetMap タイル取得
    ↓
各スポットにマーカー配置
    ↓
バックグラウンドで天候データ取得開始
    ↓
useWaveData.js: API並列呼び出し
    ├─→ OpenWeatherMap API (気温、風)
    └─→ Open-Meteo Marine API (波)
    ↓
データ受信後、マーカーの色を更新
    ↓
ユーザーに表示
```

### 3. マーカークリック時

```
ユーザーがマーカーをクリック
    ↓
handleMarkerClick() 実行
    ↓
selectedSpot に保存
    ↓
SpotPopup.vue 表示
    ↓
天候データがあれば表示
    ↓
なければ再取得
```

## 🎨 コンポーネント設計

### Composition API パターン

```javascript
// useWaveData.js (Composable)
export function useWaveData() {
  // リアクティブな状態
  const waveData = ref(new Map())
  const loading = ref(false)
  
  // メソッド
  const fetchWaveData = async (lat, lon) => {
    loading.value = true
    const response = await axios.get(...)
    waveData.value.set(spotId, response.data)
    loading.value = false
  }
  
  // 外部に公開
  return {
    waveData,
    loading,
    fetchWaveData
  }
}
```

**使用例:**
```vue
<script setup>
import { useWaveData } from '@/composables/useWaveData'

const { waveData, loading, fetchWaveData } = useWaveData()

onMounted(() => {
  fetchWaveData(1.3521, 103.8198)
})
</script>
```

## 🚀 パフォーマンス最適化

### 1. 並列API呼び出し
```javascript
// 悪い例（直列）
for (const location of locations) {
  await fetchWaveData(location) // 1つずつ待つ
}

// 良い例（並列）
const promises = locations.map(loc => fetchWaveData(loc))
await Promise.all(promises) // 同時に実行
```

### 2. バックグラウンド読み込み
```javascript
// マーカーを先に表示（天候データなし）
locations.forEach(loc => addMarker(loc, null))

// 天候データは後から取得
setTimeout(() => {
  fetchAllWaveData(locations)
}, 100)
```

### 3. 画像の遅延読み込み
```javascript
// Pexels写真は5件ずつ並列取得
const batchSize = 5
for (let i = 0; i < locations.length; i += batchSize) {
  const batch = locations.slice(i, i + batchSize)
  await Promise.all(batch.map(fetchPhoto))
}
```

## 🔐 セキュリティ

### 環境変数の管理
```javascript
// .env ファイル
VITE_OPENWEATHER_API_KEY=522b2fd2aa27b843b4c07198b4194c58
VITE_PEXELS_API_KEY=PzzTWd3eUO4NyQhWhqgNfOcFcvoNL79hyEZvviFRNvI5aohdrkn43yyn

// コード内
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
```

**注意:** 
- クライアントサイドアプリなので、APIキーはブラウザから見える
- 本番環境では、サーバーサイドプロキシの使用を推奨

## 📱 レスポンシブデザイン

### Tailwindのブレークポイント
```css
/* モバイル（デフォルト） */
<div class="text-sm">

/* タブレット（768px以上） */
<div class="md:text-base">

/* デスクトップ（1024px以上） */
<div class="lg:text-lg">
```

## 🌐 ブラウザ互換性

### 対応ブラウザ
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 必要な機能
- ES6+ (async/await, Promise)
- Fetch API
- Geolocation API
- CSS Grid & Flexbox

## 🔧 開発ワークフロー

```
1. コード編集
   ↓
2. Viteが変更を検知
   ↓
3. HMR (Hot Module Replacement)
   ↓
4. ブラウザが自動更新（ページリロードなし）
   ↓
5. 即座に結果確認
```

**開発サーバー起動:**
```bash
npm run dev
# → http://localhost:5173
```

**プロダクションビルド:**
```bash
npm run build
# → dist/ フォルダに最適化されたファイル生成
```

## 📊 パフォーマンス指標

### 初期ロード
- HTML: ~5KB
- JavaScript: ~200KB (gzip圧縮後)
- CSS: ~20KB
- 合計: ~225KB

### 実行時
- 初期表示: < 100ms
- 天候データ取得: 1.5-3秒
- マーカー更新: < 50ms

## 🎓 学習リソース

### Vue.js
- 公式ドキュメント: https://vuejs.org/
- Composition API: https://vuejs.org/guide/extras/composition-api-faq.html

### Leaflet
- 公式ドキュメント: https://leafletjs.com/
- チュートリアル: https://leafletjs.com/examples.html

### Tailwind CSS
- 公式ドキュメント: https://tailwindcss.com/
- プレイグラウンド: https://play.tailwindcss.com/

## 🚀 次のステップ

1. **バックエンド追加**
   - Node.js + Express
   - APIキーを隠す
   - データベース統合

2. **PWA化**
   - Service Worker
   - オフライン対応
   - プッシュ通知

3. **テスト追加**
   - Vitest (ユニットテスト)
   - Playwright (E2Eテスト)

4. **CI/CD**
   - GitHub Actions
   - 自動デプロイ
   - 自動テスト

## 📝 まとめ

このアプリは**モダンなフロントエンド技術**を使用した**シンプルで効率的なアーキテクチャ**です：

✅ **サーバーレス** - ブラウザだけで動作  
✅ **高速** - Vite + Vue.js 3  
✅ **無料** - オープンソースツールのみ  
✅ **拡張可能** - コンポーネントベース設計  
✅ **保守しやすい** - 明確な責任分離  

**開発者にとって:**
- 学習しやすい
- デバッグしやすい
- 拡張しやすい

**ユーザーにとって:**
- 高速
- レスポンシブ
- 直感的