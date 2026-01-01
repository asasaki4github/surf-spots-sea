# アーキテクチャレビュー - 非機能要件観点

**レビュー日**: 2025-12-16  
**レビュアー**: Senior IT Architect (IBM, 20+ years experience)  
**対象システム**: SEA Surf Spots - 東南アジア波情報表示アプリ

---

## エグゼクティブサマリー

本アプリケーションは、Vue.js 3 + Netlify Functionsのサーバーレス構成で実装されており、**プロトタイプ・MVP段階としては適切な設計**です。しかし、**本番展開（特にエンタープライズ環境）には重大なギャップ**が存在します。

**総合評価**: ⚠️ **条件付き承認** - 以下の改善を実施した上で段階的展開を推奨

---

## 1. セキュリティ (Security)

### 🔴 Critical Issues

#### 1.1 CORS設定が過度に緩い
**現状**:
```javascript
// netlify/functions/get-wave-data.js:5
'Access-Control-Allow-Origin': '*'
```

**問題点**:
- 任意のオリジンからのアクセスを許可
- CSRF攻撃のリスク
- APIの不正利用・コスト増大の可能性

**推奨対応**:
```javascript
const allowedOrigins = [
  'https://your-domain.com',
  'https://www.your-domain.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean)

const origin = event.headers.origin
const headers = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  'Access-Control-Allow-Credentials': 'true',
  // ...
}
```

**優先度**: 🔴 High - 本番展開前に必須

---

#### 1.2 レート制限が未実装
**現状**: Netlify Functionsに対するレート制限なし

**問題点**:
- DDoS攻撃に脆弱
- APIコストの暴走リスク
- OpenWeatherMap APIの利用制限超過

**推奨対応**:
1. **Netlify Edge Functions + KV Store**でIP単位のレート制限
2. **Cloudflare**などのCDN/WAFレイヤーでの保護
3. **API Gateway**パターンの導入

```javascript
// 簡易実装例（本番ではRedis/KV Store推奨）
const rateLimit = new Map() // IP -> { count, resetTime }

export async function handler(event) {
  const ip = event.headers['x-forwarded-for'] || event.headers['client-ip']
  const limit = 60 // 1時間あたり60リクエスト
  
  // レート制限チェック
  if (isRateLimited(ip, limit)) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Too many requests' })
    }
  }
  // ...
}
```

**優先度**: 🔴 High

---

#### 1.3 入力バリデーションが不十分
**現状**:
```javascript
// netlify/functions/get-wave-data.js:31-39
const { lat, lon } = event.queryStringParameters || {}
if (!lat || !lon) { /* エラー */ }
```

**問題点**:
- 緯度経度の範囲チェックなし（-90~90, -180~180）
- SQLインジェクション的な攻撃ベクトル（将来DBを使う場合）
- 不正な値でのAPI呼び出しによるコスト浪費

**推奨対応**:
```javascript
function validateCoordinates(lat, lon) {
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinate format')
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90')
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180')
  }
  
  return { latitude, longitude }
}
```

**優先度**: 🟡 Medium

---

#### 1.4 APIキーの露出リスク
**現状**: フロントエンドに`VITE_MAPBOX_ACCESS_TOKEN`を埋め込み

**問題点**:
- ビルド後のJSファイルにAPIキーが平文で含まれる
- ブラウザのDevToolsで簡単に抽出可能
- 不正利用によるコスト増大

**推奨対応**:
1. **Mapbox APIキーのドメイン制限**を設定（Mapboxダッシュボード）
2. **URL制限**の有効化
3. 可能であれば、Mapboxもサーバーサイドプロキシ経由に変更

**優先度**: 🟡 Medium - Mapboxの制限機能で緩和可能

---

### 🟢 Good Practices

- ✅ APIキーを環境変数で管理
- ✅ Netlify Functionsでバックエンドキーを隠蔽
- ✅ HTTPSのみの通信（Netlify標準）

---

## 2. パフォーマンス (Performance)

### 🟡 Moderate Issues

#### 2.1 初期ロード時の並列API呼び出し
**現状**:
```javascript
// useWaveData.js:50-63
const promises = spots.map(spot => fetchWaveData(...))
await Promise.all(promises)
```

**問題点**:
- 7スポット × 同時API呼び出し = OpenWeatherMapのレート制限リスク
- 1つでも失敗すると全体の体験が悪化
- 初期ロード時間の増大

**推奨対応**:
```javascript
// バッチ処理 + 段階的表示
async function fetchAllWaveData(spots) {
  const batchSize = 3
  for (let i = 0; i < spots.length; i += batchSize) {
    const batch = spots.slice(i, i + batchSize)
    await Promise.allSettled(
      batch.map(spot => fetchWaveData(spot))
    )
    // 取得できたデータから順次表示
  }
}
```

**優先度**: 🟡 Medium

---

#### 2.2 キャッシング戦略の不在
**現状**: 毎回APIを呼び出し、クライアント側のみでデータ保持

**問題点**:
- 同じデータを複数ユーザーが重複取得
- APIコストの無駄
- OpenWeatherMapのデータ更新頻度（10分程度）を考慮していない

**推奨対応**:
1. **Netlify Edge Functions + KV Store**でサーバーサイドキャッシュ（5-10分）
2. **CDNキャッシュ**の活用（Cache-Controlヘッダー）
3. **Service Worker**でのオフライン対応

```javascript
// Netlify Function with caching
const cache = new Map() // 本番ではRedis/KV Store

export async function handler(event) {
  const cacheKey = `${lat},${lon}`
  const cached = cache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, max-age=600' // 10分
      },
      body: JSON.stringify(cached.data)
    }
  }
  
  // API呼び出し & キャッシュ更新
}
```

**優先度**: 🟡 Medium - コスト削減効果大

---

#### 2.3 バンドルサイズの最適化不足
**現状**: Mapbox GL JS（~500KB）、Tailwind CSS（未パージ時~3MB）

**推奨対応**:
1. **Code Splitting**: Mapboxを動的インポート
2. **Tailwind CSS Purge**: 未使用クラスの削除（既に設定済みだが確認）
3. **Tree Shaking**: 未使用コードの除去
4. **Lazy Loading**: 画像・コンポーネントの遅延読み込み

**優先度**: 🟢 Low - 現状でも許容範囲

---

## 3. 可用性 (Availability)

### 🟡 Moderate Issues

#### 3.1 単一障害点（SPOF）
**現状**: OpenWeatherMap APIに完全依存

**問題点**:
- OpenWeatherMapがダウンすると全機能停止
- APIレート制限到達時の代替手段なし
- SLA保証なし（無料プラン）

**推奨対応**:
1. **フォールバック戦略**:
   - 複数の気象APIプロバイダー（Stormglass、NOAA等）
   - 最後に取得成功したデータをキャッシュして表示
2. **Graceful Degradation**:
   - API障害時も地図とスポット情報は表示
   - 「データ取得中」「一時的に利用不可」の明示
3. **Circuit Breaker パターン**:
   - 連続失敗時は一定時間API呼び出しを停止

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0
    this.threshold = threshold
    this.timeout = timeout
    this.state = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN')
    }
    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
}
```

**優先度**: 🟡 Medium

---

#### 3.2 エラーハンドリングの粒度
**現状**: エラー時にユーザーへのメッセージが汎用的

**推奨対応**:
- ネットワークエラー vs APIエラー vs データ不正の区別
- リトライ可能なエラーの自動再試行
- ユーザーへの具体的なアクションガイド

**優先度**: 🟢 Low

---

## 4. スケーラビリティ (Scalability)

### 🟢 Good Architecture

#### 4.1 サーバーレス構成
**評価**: ✅ Excellent

**理由**:
- Netlify Functionsは自動スケール
- インフラ管理不要
- 従量課金でコスト効率的

**注意点**:
- Cold Start（初回実行の遅延）: 通常100-300ms
- 同時実行数の制限: Netlifyの無料プランは1,000/月

---

#### 4.2 ステートレス設計
**評価**: ✅ Good

**理由**:
- クライアント側でデータ管理
- 水平スケールが容易

**改善余地**:
- 将来的にユーザー認証・お気に入り機能を追加する場合、バックエンドDBが必要

---

### 🟡 Future Considerations

#### 4.3 データベースの必要性
**現状**: スポット情報はハードコード（`surfSpots.js`）

**将来の拡張時**:
- ユーザー投稿のスポット情報
- レビュー・評価機能
- お気に入り・通知機能

**推奨**: 
- **Supabase**（PostgreSQL + リアルタイム機能）
- **Firebase Firestore**（NoSQL + リアルタイム）
- **Netlify + FaunaDB**（サーバーレスDB）

**優先度**: 🟢 Low - 現時点では不要

---

## 5. 運用性 (Operability)

### 🟡 Moderate Issues

#### 5.1 監視・ロギングの不足
**現状**: `console.log`のみ

**問題点**:
- 本番環境でのエラー追跡が困難
- パフォーマンス問題の検知が遅れる
- ユーザー体験の可視化不足

**推奨対応**:
1. **エラートラッキング**: Sentry、Rollbar
2. **アナリティクス**: Google Analytics、Plausible
3. **APM**: New Relic、Datadog（エンタープライズ向け）
4. **ログ集約**: Netlify Logs、CloudWatch Logs

```javascript
// Sentry統合例
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1
})
```

**優先度**: 🟡 Medium - 本番運用には必須

---

#### 5.2 ヘルスチェック・死活監視
**現状**: なし

**推奨対応**:
1. **Uptime監視**: UptimeRobot、Pingdom
2. **Synthetic Monitoring**: 定期的な自動テスト
3. **アラート設定**: Slack、PagerDuty連携

**優先度**: 🟡 Medium

---

#### 5.3 デプロイメント戦略
**現状**: Gitプッシュで自動デプロイ（Netlify）

**評価**: ✅ Good for MVP

**改善余地**:
- **ステージング環境**の分離（本番前検証）
- **カナリアデプロイ**: 段階的ロールアウト
- **ロールバック手順**の明文化

**優先度**: 🟢 Low - 現状で十分

---

## 6. コスト (Cost Efficiency)

### 🟢 Current State

**月間想定コスト** (1,000ユーザー/月):
- Netlify Hosting: $0（無料枠内）
- Netlify Functions: $0-25（125,000実行/月まで無料）
- OpenWeatherMap API: $0（60 calls/min無料）
- Mapbox: $0（50,000 map loads/月まで無料）

**合計**: $0-25/月

---

### 🟡 Scale-up Considerations

**10,000ユーザー/月の場合**:
- Netlify Functions: ~$50-100
- OpenWeatherMap: $40-200（有料プラン必要）
- Mapbox: $0-50（無料枠超過の可能性）

**推奨対応**:
1. **キャッシング**でAPI呼び出し削減（70-80%削減可能）
2. **CDN活用**でNetlify Functions呼び出し削減
3. **バッチ処理**で効率化

---

## 7. 保守性 (Maintainability)

### 🟢 Good Practices

- ✅ Composition API（Vue 3）で再利用性高い
- ✅ コンポーネント分割が適切
- ✅ TypeScript未使用だが、JSDocで型情報あり
- ✅ 環境変数で設定管理

### 🟡 Improvements

#### 7.1 TypeScript導入
**理由**:
- 型安全性の向上
- IDEサポートの強化
- リファクタリングの容易化

**優先度**: 🟢 Low - 現状でも許容範囲

---

#### 7.2 テストの不在
**現状**: ユニットテスト・E2Eテストなし

**推奨対応**:
1. **Vitest**: ユニットテスト
2. **Playwright/Cypress**: E2Eテスト
3. **Testing Library**: コンポーネントテスト

**優先度**: 🟡 Medium - 本番展開前に最低限のテストを

---

## 8. コンプライアンス・法規制

### 🟡 Considerations

#### 8.1 プライバシー・GDPR
**現状**: ユーザーデータ収集なし

**将来的に必要**:
- Cookie同意バナー（アナリティクス導入時）
- プライバシーポリシー
- データ保持ポリシー

**優先度**: 🟢 Low - 現時点では不要

---

#### 8.2 アクセシビリティ (WCAG 2.1)
**現状**: 基本的なセマンティックHTML使用

**改善余地**:
- キーボードナビゲーション
- スクリーンリーダー対応
- カラーコントラスト比の確認

**優先度**: 🟢 Low - 公共機関向けでなければ

---

## 9. 推奨アクションプラン

### Phase 1: 本番展開前（必須）🔴

| # | 項目 | 工数 | 優先度 |
|---|------|------|--------|
| 1 | CORS設定の厳格化 | 2h | 🔴 Critical |
| 2 | レート制限の実装 | 4h | 🔴 Critical |
| 3 | 入力バリデーション強化 | 2h | 🟡 High |
| 4 | エラートラッキング導入（Sentry） | 3h | 🟡 High |
| 5 | 基本的なE2Eテスト | 8h | 🟡 High |

**合計工数**: 19時間（2-3日）

---

### Phase 2: 本番展開後1ヶ月以内 🟡

| # | 項目 | 工数 | 優先度 |
|---|------|------|--------|
| 6 | サーバーサイドキャッシング | 6h | 🟡 Medium |
| 7 | Circuit Breaker実装 | 4h | 🟡 Medium |
| 8 | Uptime監視設定 | 2h | 🟡 Medium |
| 9 | ステージング環境構築 | 4h | 🟡 Medium |

**合計工数**: 16時間（2日）

---

### Phase 3: 継続的改善 🟢

| # | 項目 | 工数 | 優先度 |
|---|------|------|--------|
| 10 | TypeScript移行 | 16h | 🟢 Low |
| 11 | パフォーマンス最適化 | 8h | 🟢 Low |
| 12 | アクセシビリティ改善 | 8h | 🟢 Low |

---

## 10. 総合評価とリスク

### リスクマトリクス

| リスク | 影響度 | 発生確率 | 対策優先度 |
|--------|--------|----------|------------|
| API不正利用によるコスト暴走 | 高 | 中 | 🔴 Critical |
| OpenWeatherMap障害 | 中 | 低 | 🟡 Medium |
| レート制限超過 | 中 | 中 | 🔴 Critical |
| セキュリティ侵害 | 高 | 低 | 🔴 Critical |
| パフォーマンス劣化 | 低 | 中 | 🟡 Medium |

---

### 最終推奨事項

#### ✅ 承認条件

1. **Phase 1のアクション完了**（CORS、レート制限、バリデーション）
2. **ステージング環境での検証**
3. **監視体制の確立**（Sentry + Uptime監視）

#### ⚠️ 段階的展開

1. **Week 1-2**: クローズドベータ（50ユーザー）
2. **Week 3-4**: オープンベータ（500ユーザー）
3. **Month 2+**: 一般公開

#### 📊 成功指標（KPI）

- **可用性**: 99.5%以上
- **平均応答時間**: 2秒以下
- **エラー率**: 1%以下
- **月間コスト**: $50以下（1,000ユーザー時）

---

## 11. 結論

本アプリケーションは、**技術的には健全な設計**であり、サーバーレスアーキテクチャの利点を活かしています。しかし、**本番環境での運用には、セキュリティとレジリエンスの強化が不可欠**です。

**Phase 1の対応（19時間）を完了すれば、小規模な本番展開は可能**と判断します。ただし、エンタープライズ環境や大規模展開を目指す場合は、Phase 2-3の対応も計画的に実施してください。

---

**レビュアー署名**: Senior IT Architect  
**承認ステータス**: ⚠️ 条件付き承認（Phase 1完了後）  
**次回レビュー**: Phase 1完了時