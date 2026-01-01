# クイックスタートガイド - ローカルデモ実行

このガイドでは、ローカル環境でSEA Surf Spotsアプリをデモ実行する手順を説明します。

## 前提条件

- Node.js 18.x以上がインストールされていること
- npm または yarn がインストールされていること

Node.jsのインストール確認：
```bash
node --version
npm --version
```

インストールされていない場合は、[Node.js公式サイト](https://nodejs.org/)からダウンロードしてください。

## セットアップ手順

### 1. プロジェクトディレクトリに移動

```bash
cd surf-spots-sea
```

### 2. 依存パッケージのインストール

```bash
npm install
```

インストールには数分かかる場合があります。

### 3. APIキーの取得

#### Mapbox APIキー（必須）

1. [Mapbox](https://account.mapbox.com/)にアクセス
2. 「Sign up」で無料アカウントを作成
3. ダッシュボードの「Access tokens」セクションへ
4. デフォルトのトークンをコピー、または「Create a token」で新規作成

#### OpenWeatherMap APIキー（必須）

1. [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)にアクセス
2. 無料アカウントを作成
3. メール認証を完了
4. ダッシュボードの「API keys」タブへ
5. デフォルトのキーをコピー、または「Generate」で新規作成
6. **注意**: APIキーが有効になるまで数時間かかる場合があります

### 4. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成：

```bash
cp .env.example .env
```

`.env`ファイルをテキストエディタで開き、取得したAPIキーを設定：

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHgifQ.xxxxxxxxxxxxxxxxx
VITE_OPENWEATHER_API_KEY=1234567890abcdef1234567890abcdef
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

以下のようなメッセージが表示されます：

```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 6. ブラウザでアクセス

ブラウザで以下のURLを開きます：

```
http://localhost:3000
```

## デモの使い方

1. **地図の表示**: アプリが起動すると、東南アジア地域の地図が表示されます
2. **サーフスポットの確認**: 青い波のマーカーが5つのサーフスポットを示しています
3. **波情報の表示**: マーカーをクリックすると、そのスポットの詳細な波情報が表示されます
4. **情報の更新**: データは30分ごとに自動更新されます
5. **アプリ情報**: 右上の「i」ボタンでアプリの詳細情報を確認できます

## トラブルシューティング

### 問題1: 地図が表示されない

**症状**: 画面が真っ白、または地図エリアがグレー

**原因**: Mapbox APIキーが設定されていない、または無効

**解決策**:
1. `.env`ファイルが存在するか確認
2. `VITE_MAPBOX_ACCESS_TOKEN`が正しく設定されているか確認
3. APIキーにスペースや改行が含まれていないか確認
4. 開発サーバーを再起動（Ctrl+C → `npm run dev`）

### 問題2: 波情報が取得できない

**症状**: マーカーをクリックしてもデータが表示されない、またはエラーメッセージ

**原因**: OpenWeatherMap APIキーが設定されていない、または無効

**解決策**:
1. `.env`ファイルの`VITE_OPENWEATHER_API_KEY`を確認
2. APIキーが有効化されているか確認（登録後数時間かかる場合あり）
3. ブラウザのコンソール（F12）でエラーメッセージを確認
4. 開発サーバーを再起動

### 問題3: npm installでエラー

**症状**: `npm install`実行時にエラーが発生

**解決策**:
```bash
# キャッシュをクリア
npm cache clean --force

# node_modulesを削除
rm -rf node_modules package-lock.json

# 再インストール
npm install
```

### 問題4: ポート3000が使用中

**症状**: `Port 3000 is already in use`

**解決策**:
```bash
# 別のポートで起動
npm run dev -- --port 3001
```

または、ポート3000を使用しているプロセスを終了してください。

## デモ用のテストデータ

APIキーの取得を待っている間、以下のテストモードで動作確認できます：

### モックデータモードの有効化

`src/composables/useWaveData.js`の先頭に以下を追加：

```javascript
const MOCK_MODE = true // テストモード有効化
```

これにより、実際のAPIを呼び出さずにダミーデータで動作確認できます。

## 開発サーバーの停止

ターミナルで `Ctrl + C` を押すと、開発サーバーが停止します。

## 次のステップ

デモが正常に動作したら：

1. **カスタマイズ**: サーフスポットの追加・変更（`src/data/surfSpots.js`）
2. **スタイル変更**: 色やデザインの調整（`tailwind.config.js`）
3. **機能追加**: 新しい機能の実装
4. **本番デプロイ**: `README.md`のデプロイ手順を参照

## よくある質問

**Q: APIキーは無料ですか？**
A: はい、MapboxとOpenWeatherMapの両方とも無料プランがあります。

**Q: データはリアルタイムですか？**
A: OpenWeatherMapのデータは数時間ごとに更新されます。アプリは30分ごとに最新データを取得します。

**Q: オフラインで使用できますか？**
A: いいえ、地図と波情報の取得にインターネット接続が必要です。

**Q: スマートフォンで確認できますか？**
A: はい、同じネットワーク内であれば、スマートフォンのブラウザから`http://[PCのIPアドレス]:3000`でアクセスできます。

## サポート

問題が解決しない場合は、以下を確認してください：
- ブラウザのコンソール（F12）のエラーメッセージ
- ターミナルのエラーメッセージ
- Node.jsとnpmのバージョン

---

楽しいサーフィンライフを！🏄‍♂️🌊