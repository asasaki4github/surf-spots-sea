# AWS Architecture Diagram - 使用方法

## ファイル概要

`AWS_Architecture_Diagram.drawio` は、AWS公式アイコンを使用したアーキテクチャ図です。

## 開き方

### 方法1: draw.io Webアプリ（推奨）

1. https://app.diagrams.net/ にアクセス
2. 「Open Existing Diagram」をクリック
3. `AWS_Architecture_Diagram.drawio` ファイルを選択
4. 図が表示されます

### 方法2: VS Code拡張機能

1. VS Codeに「Draw.io Integration」拡張機能をインストール
   - 拡張機能ID: `hediet.vscode-drawio`
2. `AWS_Architecture_Diagram.drawio` ファイルをVS Codeで開く
3. 図が表示されます

### 方法3: draw.io デスクトップアプリ

1. https://github.com/jgraph/drawio-desktop/releases から最新版をダウンロード
2. インストール後、`AWS_Architecture_Diagram.drawio` ファイルを開く

## エクスポート方法

### PNG形式でエクスポート（PowerPoint用）

1. draw.ioで図を開く
2. メニューから「File」→「Export as」→「PNG...」を選択
3. 設定:
   - **Zoom**: 200% (高解像度)
   - **Border Width**: 10px
   - **Transparent Background**: チェックを外す（白背景）
4. 「Export」をクリック
5. PowerPointに挿入

### SVG形式でエクスポート（編集可能）

1. draw.ioで図を開く
2. メニューから「File」→「Export as」→「SVG...」を選択
3. 設定:
   - **Include a copy of my diagram**: チェック（後で編集可能）
4. 「Export」をクリック
5. PowerPoint/Keynoteに挿入（ベクター形式で拡大縮小可能）

### PDF形式でエクスポート（印刷用）

1. draw.ioで図を開く
2. メニューから「File」→「Export as」→「PDF...」を選択
3. 「Export」をクリック

## 図の編集

### アイコンの追加

1. 左側のパネルから「AWS」カテゴリを選択
2. 必要なAWSサービスアイコンをドラッグ&ドロップ
3. テキストを編集

### 接続線の追加

1. アイコンをクリックして選択
2. 青い矢印アイコンをドラッグして別のアイコンに接続
3. 線のスタイルを変更:
   - 実線: データフロー
   - 破線: 制御/設定

### 色の変更

1. 要素を選択
2. 右側のパネルから「Style」タブを選択
3. 「Fill」で背景色、「Line」で線の色を変更

## アーキテクチャ図の内容

### 主要コンポーネント

1. **CloudFront**: グローバルCDN、SSL/TLS、DDoS保護
2. **WAF**: レート制限、SQLインジェクション、XSS保護
3. **S3**: 静的ホスティング、バージョニング、暗号化
4. **API Gateway**: REST API、スロットリング、CORS
5. **Lambda**: GetWaveData関数、Node.js 20.x
6. **ElastiCache Redis**: Multi-AZ、10分TTL、暗号化
7. **Secrets Manager**: APIキー管理、自動ローテーション
8. **CloudWatch**: メトリクス、ログ、アラーム
9. **X-Ray**: 分散トレーシング
10. **SNS**: アラート通知（Email/Slack）
11. **CodePipeline**: CI/CD、Blue/Greenデプロイ
12. **IAM**: ロール＆ポリシー
13. **KMS**: 暗号化キー管理

### データフロー

1. ユーザー → CloudFront → S3（静的コンテンツ）
2. ユーザー → CloudFront → WAF → API Gateway → Lambda
3. Lambda → ElastiCache（キャッシュチェック）
4. Lambda → Secrets Manager（APIキー取得）
5. Lambda → OpenWeatherMap API（キャッシュミス時）
6. Lambda → CloudWatch/X-Ray（監視・トレーシング）

### 非機能要件

- **可用性**: 99.95%（Multi-AZ構成）
- **コスト**: 約$55/月（10,000ユーザー想定）
- **キャッシュ**: 10分（ElastiCache）
- **セキュリティ**: 暗号化（保存時・転送時）、WAF、IAM
- **スケーラビリティ**: Lambda、API Gatewayの自動スケーリング

## PowerPointでの使用例

### 高解像度PNG（推奨）

1. PNG形式でエクスポート（Zoom: 200%）
2. PowerPointに挿入
3. サイズ調整（アスペクト比を維持）
4. アニメーション効果を追加可能

### SVG形式（編集可能）

1. SVG形式でエクスポート
2. PowerPointに挿入
3. 「図形の書式設定」で色やサイズを変更可能
4. 拡大しても画質が劣化しない

## トラブルシューティング

### 図が開けない

- draw.ioのバージョンが古い可能性があります
- 最新版にアップデートしてください

### アイコンが表示されない

- インターネット接続を確認してください
- AWS公式アイコンはオンラインで読み込まれます

### エクスポートが失敗する

- ファイルサイズが大きすぎる可能性があります
- Zoom設定を下げてください（200% → 100%）

## 参考リンク

- [draw.io公式サイト](https://www.diagrams.net/)
- [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)
- [draw.io使い方ガイド](https://www.diagrams.net/doc/)

## 更新履歴

- 2025-12-16: AWS公式アイコンを使用した初版作成