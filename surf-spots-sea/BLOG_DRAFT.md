# Project Bobで実現する爆速Web開発：東南アジア波情報アプリを3時間で構築した話

## はじめに

「AIコーディングアシスタント」と聞いて、何を思い浮かべますか？GitHub Copilot？ChatGPT？それとも最近話題のCursor？

今回、私はIBMの新しいAI開発ツール「**Project Bob**」を使って、東南アジアのサーフスポット波情報を地図上に表示するWebアプリケーションを**わずか3時間**で構築しました。しかも、単なるプロトタイプではなく、**本番環境を想定した設計レビュー付き**です。

この記事では、Project Bobがいかに開発者の生産性を劇的に向上させるか、実際の開発プロセスを通じて紹介します。

## Project Bobとは？

Project Bobは、IBMが開発した次世代のAI開発アシスタントです。従来のコード補完ツールとは一線を画す、以下の特徴があります：

### 🎯 主な特徴

1. **マルチモード対応**
   - 📝 Plan（設計・計画）
   - 💻 Code（実装）
   - 🛠️ Advanced（高度な実装）
   - ❓ Ask（質問・学習）
   - 🏗️ Architect（アーキテクチャレビュー）

2. **ファイル操作の完全自動化**
   - ファイルの作成・編集・削除を自動実行
   - 複数ファイルの同時編集が可能
   - Git操作も統合

3. **コンテキスト理解の深さ**
   - プロジェクト全体の構造を把握
   - 依存関係を自動解析
   - ベストプラクティスを提案

4. **エンタープライズ視点**
   - セキュリティ・可用性・スケーラビリティを考慮
   - 非機能要件のレビュー機能
   - AWS/Azure/GCPのアーキテクチャ設計支援

## 今回作ったもの：SEA Surf Spots

### 要件

シンガポールから3-4時間圏内の主要サーフスポット（バタム島、ビンタン島、メンタワイ諸島など）の波情報をリアルタイムで地図上に表示するWebアプリケーション。

### 技術スタック

- **フロントエンド**: Vue.js 3 + Vite + Tailwind CSS
- **地図**: Mapbox GL JS
- **バックエンド**: Netlify Functions（サーバーレス）
- **API**: OpenWeatherMap API
- **デプロイ**: Netlify

### 完成品の機能

✅ 7つのサーフスポットをインタラクティブな地図上に表示  
✅ リアルタイム波高・周期・風向・風速の表示  
✅ 30分ごとの自動更新  
✅ レスポンシブデザイン（モバイル対応）  
✅ APIキー不要のデモ版も用意  
✅ AWS本番環境アーキテクチャ設計書付き  

## 開発プロセス：Project Bobとの対話

### Phase 1: 要件定義と技術選定（15分）

**私**: 「東南アジア地域の波情報を地図上に表示させるWebアプリを開発したい。」

**Project Bob（Planモード）**:
```
要件を整理します：
1. 対象地域：シンガポールから3-4時間圏内
2. 表示情報：波高、周期、風向、風速
3. 技術スタック提案：
   - Vue.js 3（モダンで学習コストが低い）
   - Mapbox GL JS（美しい地図表示）
   - Netlify Functions（サーバーレス、無料枠あり）
   - OpenWeatherMap API（無料で使える気象API）
```

**驚いたポイント**:
- 単に「作って」と言っただけで、技術選定の理由まで説明してくれた
- 無料で使えるサービスを優先的に提案（コスト意識）
- サーバーレスアーキテクチャを自然に選択（運用コスト削減）

### Phase 2: プロジェクト構築（30分）

**Project Bob（Codeモード）**が自動で実行したこと：

```bash
# 1. プロジェクト初期化
npm create vite@latest surf-spots-sea -- --template vue

# 2. 依存パッケージのインストール
npm install mapbox-gl @mapbox/mapbox-gl-geocoder
npm install -D tailwindcss postcss autoprefixer

# 3. ファイル構造の作成
surf-spots-sea/
├── src/
│   ├── components/
│   │   ├── MapView.vue
│   │   ├── SpotPopup.vue
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorMessage.vue
│   ├── composables/
│   │   ├── useMapbox.js
│   │   └── useWaveData.js
│   ├── data/
│   │   └── surfSpots.js
│   └── utils/
│       └── formatters.js
├── netlify/functions/
│   └── get-wave-data.js
└── ... (設定ファイル群)
```

**驚いたポイント**:
- **一度も手動でファイルを作成していない**
- Vue.js 3のComposition APIを使った最新のベストプラクティス
- Composables（再利用可能なロジック）を自動で分離
- エラーハンドリング・ローディング状態も最初から実装

### Phase 3: 実装（1時間）

ここからが本当にすごいところです。

#### 3-1. サーフスポットデータの定義

**私**: 「ビンタン島のスポットも追加して」

**Project Bob**:
```javascript
// src/data/surfSpots.js に自動追加
export const surfSpots = [
  // 既存のスポット...
  {
    id: 'trikora-beach',
    name: 'Trikora Beach',
    island: 'Bintan Island',
    coordinates: [104.5247, 1.0833],
    description: 'ビンタン島東海岸の人気ビーチ...',
    difficulty: 'beginner',
    bestSeason: 'May-September'
  },
  // ... 他2箇所も自動追加
]
```

**驚いたポイント**:
- 座標を自動で調べて正確に設定
- 難易度やベストシーズンまで調査して追加
- 既存コードを壊さずに追加（差分適用が完璧）

#### 3-2. Netlify Functionsの実装

```javascript
// netlify/functions/get-wave-data.js
export async function handler(event, context) {
  // CORS設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  // パラメータ検証
  const { lat, lon } = event.queryStringParameters || {}
  if (!lat || !lon) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing parameters' })
    }
  }

  // OpenWeatherMap API呼び出し
  const apiKey = process.env.OPENWEATHERMAP_API_KEY
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  
  try {
    const response = await fetch(weatherUrl)
    const data = await response.json()
    
    // 波高・周期の推定（風速から）
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        wave: {
          height: estimateWaveHeight(data.wind?.speed || 0),
          period: estimateWavePeriod(data.wind?.speed || 0)
        },
        wind: {
          speed: data.wind?.speed || 0,
          direction: data.wind?.deg || 0
        },
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch weather data' })
    }
  }
}
```

**驚いたポイント**:
- エラーハンドリングが最初から完璧
- 環境変数の使い方も正しい
- CORS設定も自動で追加

#### 3-3. Vue Composablesの実装

```javascript
// src/composables/useWaveData.js
export function useWaveData() {
  const waveData = ref(new Map())
  const loading = ref(false)
  const error = ref(null)

  const fetchWaveData = async (spot) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(
        `/.netlify/functions/get-wave-data?lat=${spot.coordinates[1]}&lon=${spot.coordinates[0]}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch wave data')
      
      const data = await response.json()
      waveData.value.set(spot.id, data)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 自動更新（30分ごと）
  const startAutoUpdate = (spots, intervalMinutes = 30) => {
    fetchAllWaveData(spots)
    updateInterval = setInterval(() => {
      fetchAllWaveData(spots)
    }, intervalMinutes * 60 * 1000)
  }

  return {
    waveData,
    loading,
    error,
    fetchWaveData,
    startAutoUpdate
  }
}
```

**驚いたポイント**:
- Vue 3のComposition APIを完璧に理解
- リアクティブな状態管理
- 自動更新機能まで実装

### Phase 4: デモ版の作成（30分）

**私**: 「Node.jsがインストールされていない環境でも動くデモ版が欲しい」

**Project Bob**:
```html
<!-- demo-simple.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="map" style="height: 100vh;"></div>
  <script>
    // Leaflet + OpenStreetMapを使用（APIキー不要）
    const map = L.map('map').setView([1.0, 103.8], 8)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    
    // サーフスポットをマーカーで表示
    const spots = [/* ... */]
    spots.forEach(spot => {
      L.marker(spot.coordinates)
        .bindPopup(`<b>${spot.name}</b><br>${spot.description}`)
        .addTo(map)
    })
  </script>
</body>
</html>
```

**驚いたポイント**:
- 要件を理解して、Mapboxの代わりにLeafletを選択
- 単一HTMLファイルで完結（依存関係ゼロ）
- ブラウザで開くだけで動作

### Phase 5: アーキテクチャレビュー（45分）

ここからが**Project Bobの真骨頂**です。

**私**: 「本番環境を想定したアーキテクチャレビューをお願いします」

**Project Bob（Architectモード）**:

```markdown
# 非機能要件レビュー

## 🔴 Critical Issues（即対応必須）

### 1. CORS設定が緩すぎる
**現状**: `Access-Control-Allow-Origin: *`
**問題**: 任意のドメインからAPIを呼び出し可能
**影響**: DDoS攻撃、コスト爆発のリスク
**対策**: 
```javascript
const allowedOrigins = ['https://your-domain.com']
const origin = event.headers.origin
const headers = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
}
```

### 2. レート制限がない
**現状**: 無制限にAPI呼び出し可能
**問題**: 悪意あるユーザーによるAPI枠の消費
**影響**: 月額コストが予測不能
**対策**: 
```javascript
// IP単位でレート制限（60 req/hour）
const rateLimit = new Map()
if (isRateLimited(ip, 60)) {
  return { statusCode: 429, body: 'Too many requests' }
}
```

### 3. 入力バリデーション不足
**現状**: 緯度・経度の範囲チェックなし
**問題**: 不正な値でAPI呼び出し可能
**影響**: エラー増加、デバッグ困難
**対策**:
```javascript
function validateCoordinates(lat, lon) {
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)
  if (latitude < -90 || latitude > 90) throw new Error('Invalid latitude')
  if (longitude < -180 || longitude > 180) throw new Error('Invalid longitude')
  return { latitude, longitude }
}
```

## 🟡 Medium Priority（2週間以内）

### 4. キャッシング戦略の不在
**推奨**: ElastiCache Redis（10分TTL）
**効果**: API呼び出し削減、レスポンス高速化
**コスト削減**: 約70%のAPI呼び出しを削減可能

### 5. 監視・アラートの不足
**推奨**: CloudWatch + SNS
**設定すべきアラート**:
- Lambda実行時間 > 25秒
- API Gateway 5xx エラー率 > 1%
- ElastiCache CPU使用率 > 75%

## 🟢 Low Priority（1ヶ月以内）

### 6. Circuit Breaker パターン未実装
### 7. ステージング環境の不在
### 8. E2Eテストの不足
```

**驚いたポイント**:
- **IBMのシニアアーキテクトレベルのレビュー**
- セキュリティ・コスト・運用性を網羅的に指摘
- 単なる指摘ではなく、具体的なコード例を提示
- 優先度付けまで実施（Phase 1: 19時間、Phase 2: 16時間）

### Phase 6: AWSアーキテクチャ図の作成（30分）

**私**: 「AWS公式アイコンを使ったアーキテクチャ図を作成して」

**Project Bob**:
- draw.io形式のファイルを自動生成
- AWS公式アイコンセット（CloudFront、WAF、Lambda、ElastiCache等）を使用
- Multi-AZ構成、Circuit Breaker、分散トレーシングまで含む本格的な設計
- PNG/SVG/PDFでエクスポート可能

## Project Bobの何がすごいのか？

### 1. **コンテキスト理解の深さ**

従来のAIコーディングツール：
```
「ボタンを追加して」
→ ボタンのコードだけ生成
```

Project Bob：
```
「ボタンを追加して」
→ ボタンのコンポーネント作成
→ 親コンポーネントへの統合
→ イベントハンドラの実装
→ スタイリングの調整
→ テストコードの追加
```

### 2. **ファイル操作の完全自動化**

従来：
1. AIがコードを生成
2. 人間がコピペ
3. 人間がファイルを作成
4. 人間がインポート文を追加

Project Bob：
1. AIが全部やる
2. 終わり

### 3. **エンタープライズ視点**

従来のツールは「動くコード」を生成します。  
Project Bobは「**本番で使えるコード**」を生成します。

- セキュリティ考慮
- エラーハンドリング
- ロギング
- 監視
- スケーラビリティ
- コスト最適化

### 4. **マルチモード対応**

| モード | 用途 | 従来ツールとの違い |
|--------|------|-------------------|
| Plan | 設計・計画 | 技術選定の理由まで説明 |
| Code | 実装 | 複数ファイルを同時編集 |
| Advanced | 高度な実装 | リファクタリング・最適化 |
| Ask | 質問・学習 | プロジェクト全体を理解した回答 |
| Architect | レビュー | IBMシニアアーキテクトレベル |

## 実際の開発時間

| フェーズ | 従来の開発 | Project Bob使用 | 削減率 |
|---------|-----------|----------------|--------|
| 要件定義・技術選定 | 2時間 | 15分 | **87.5%** |
| プロジェクト構築 | 3時間 | 30分 | **83.3%** |
| 実装 | 8時間 | 1時間 | **87.5%** |
| デモ版作成 | 2時間 | 30分 | **75.0%** |
| アーキテクチャレビュー | 4時間 | 45分 | **81.3%** |
| ドキュメント作成 | 2時間 | 30分 | **75.0%** |
| **合計** | **21時間** | **3時間** | **85.7%** |

## 実際に使ってみて感じたこと

### ✅ 良かった点

1. **思考の速度で開発できる**
   - 「こうしたい」と思った瞬間に実装される
   - コーディングではなく、設計に集中できる

2. **ベストプラクティスが自然に身につく**
   - なぜそのコードを書いたのか説明してくれる
   - 学習ツールとしても優秀

3. **本番環境を意識した開発**
   - セキュリティ・パフォーマンス・コストを常に考慮
   - エンタープライズ開発の経験が浅くても安心

4. **ドキュメントも自動生成**
   - README、QUICKSTART、アーキテクチャ図
   - チーム開発でも即戦力

### ⚠️ 注意点

1. **AIの提案を盲信しない**
   - 最終的な判断は人間が行う
   - レビュー機能を活用して品質を担保

2. **プロジェクトの規模に注意**
   - 大規模プロジェクトでは段階的に適用
   - 既存コードベースへの統合は慎重に

3. **APIキーの管理**
   - 環境変数の設定は手動で確認
   - セキュリティ設定は必ずレビュー

## まとめ：Project Bobは開発者の「相棒」

Project Bobは単なるコード生成ツールではありません。

- **設計パートナー**として技術選定を支援
- **実装パートナー**として高品質なコードを生成
- **レビューパートナー**として本番環境を見据えた改善提案

今回の開発で、私は**85.7%の時間を削減**しました。しかし、それ以上に価値があったのは：

- **エンタープライズレベルの設計思想を学べた**
- **セキュリティ・パフォーマンス・コストの考え方が身についた**
- **本番環境を意識した開発習慣が身についた**

Project Bobは、開発者を置き換えるのではなく、**開発者をより高いレベルに引き上げる**ツールです。

## 次のステップ

今回作成したアプリケーションは、以下のリポジトリで公開しています：

```bash
git clone https://github.com/your-username/surf-spots-sea
cd surf-spots-sea
npm install
npm run dev
```

また、以下のドキュメントも参考にしてください：

- [README.md](README.md) - プロジェクト概要
- [QUICKSTART.md](QUICKSTART.md) - クイックスタートガイド
- [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) - 非機能要件レビュー
- [AWS_ARCHITECTURE_README.md](AWS_ARCHITECTURE_README.md) - AWSアーキテクチャ図の使い方

## おわりに

「AIが開発者の仕事を奪う」という議論がありますが、Project Bobを使ってみて確信しました。

**AIは開発者の仕事を奪うのではなく、開発者をより創造的な仕事に集中させる。**

あなたも、Project Bobで開発体験を変えてみませんか？

---

**著者について**  
IBMでエンタープライズシステムの開発に従事。最近はAI支援開発ツールの検証に注力。

**タグ**  
#ProjectBob #AI開発 #Vue.js #サーバーレス #Netlify #AWS #アーキテクチャ #開発生産性

**関連記事**  
- [Project Bob公式ドキュメント](https://example.com)
- [Vue.js 3 Composition API入門](https://example.com)
- [サーバーレスアーキテクチャのベストプラクティス](https://example.com)