# SEA Surf Spots - 東南アジア波情報アプリ

シンガポールから3-4時間圏内の東南アジア主要サーフスポットの波情報をリアルタイムで地図上に表示するWebアプリケーションです。

## 🌊 特徴

- **リアルタイム波情報**: 波高、周期、風向、風速を表示
- **インタラクティブ地図**: Mapbox GL JSを使用した美しい地図表示
- **自動更新**: 30分ごとにデータを自動更新
- **モバイル対応**: レスポンシブデザインでスマートフォンでも快適に利用可能
- **サーバーレス**: Netlify Functionsを使用した効率的なアーキテクチャ

## 📍 対象サーフスポット

1. **Nongsa Beach** (バタム島、インドネシア) - 1時間
2. **Trikora Beach** (ビンタン島、インドネシア) - 1.5時間
3. **Desaru Beach** (ジョホール、マレーシア) - 2時間
4. **Tioman Island** (ティオマン島、マレーシア) - 3-4時間
5. **Parai Beach** (バンカ島、インドネシア) - 2時間

## 🛠 技術スタック

- **フロントエンド**: Vue.js 3 (Composition API)
- **地図**: Mapbox GL JS
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **バックエンド**: Netlify Functions (サーバーレス)
- **API**: OpenWeatherMap API
- **デプロイ**: Netlify

## 📋 前提条件

- Node.js 18.x 以上
- npm または yarn
- Mapbox APIキー
- OpenWeatherMap APIキー

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd surf-spots-sea
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. APIキーの取得

#### Mapbox APIキー

1. [Mapbox](https://account.mapbox.com/)にアクセス
2. アカウントを作成（無料）
3. ダッシュボードから「Access tokens」を選択
4. デフォルトのトークンをコピー、または新しいトークンを作成

#### OpenWeatherMap APIキー

1. [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)にアクセス
2. アカウントを作成（無料）
3. ダッシュボードから「API keys」を選択
4. APIキーを生成してコピー

### 4. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成：

```bash
cp .env.example .env
```

`.env`ファイルを編集してAPIキーを設定：

```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 📦 ビルドとデプロイ

### ローカルビルド

```bash
npm run build
```

ビルドされたファイルは`dist`ディレクトリに出力されます。

### Netlifyへのデプロイ

#### 方法1: Netlify CLI

```bash
# Netlify CLIのインストール
npm install -g netlify-cli

# ログイン
netlify login

# デプロイ
netlify deploy --prod
```

#### 方法2: Git連携

1. GitHubなどにリポジトリをプッシュ
2. [Netlify](https://app.netlify.com/)にログイン
3. 「New site from Git」を選択
4. リポジトリを選択
5. ビルド設定を確認（`netlify.toml`が自動的に使用されます）
6. 環境変数を設定：
   - `VITE_MAPBOX_ACCESS_TOKEN`
   - `OPENWEATHER_API_KEY`（Netlify Functions用）
7. 「Deploy site」をクリック

## 🔧 設定

### Netlify Functions

Netlify Functionsは`netlify/functions`ディレクトリに配置されています。

- `get-wave-data.js`: OpenWeatherMap APIのプロキシ

環境変数`OPENWEATHER_API_KEY`を設定する必要があります。

### 自動更新間隔の変更

`src/components/MapView.vue`の`startAutoUpdate`関数の第2引数を変更：

```javascript
// 30分ごと（デフォルト）
startAutoUpdate(surfSpots, 30)

// 15分ごとに変更する場合
startAutoUpdate(surfSpots, 15)
```

## 📱 使い方

1. アプリを開くと、東南アジア地域の地図が表示されます
2. 地図上の青いマーカーがサーフスポットを示しています
3. マーカーをクリックすると、そのスポットの詳細な波情報が表示されます
4. 波情報には以下が含まれます：
   - 波高（メートル）
   - 波周期（秒）
   - 風速（m/s）
   - 風向（方位）
   - 気温
   - コンディション評価
5. データは30分ごとに自動的に更新されます

## 🎨 カスタマイズ

### サーフスポットの追加

`src/data/surfSpots.js`を編集して新しいスポットを追加：

```javascript
{
  id: 'new-spot',
  name: 'New Surf Spot',
  location: {
    lat: 1.234,
    lon: 103.456
  },
  country: 'Country',
  island: 'Island Name',
  travelTime: '2 hours',
  description: 'Description here',
  bestSeason: 'Month - Month',
  waveType: 'Beach break',
  difficulty: 'Intermediate'
}
```

### スタイルのカスタマイズ

`tailwind.config.js`でカラーテーマを変更できます：

```javascript
colors: {
  ocean: {
    // カスタムカラーを定義
  }
}
```

## 🐛 トラブルシューティング

### 地図が表示されない

- Mapbox APIキーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### 波情報が取得できない

- OpenWeatherMap APIキーが正しく設定されているか確認
- Netlify Functionsの環境変数が設定されているか確認
- APIの利用制限に達していないか確認

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📞 サポート

問題が発生した場合は、GitHubのissueを作成してください。

---

Made with ❤️ for surfers in Southeast Asia