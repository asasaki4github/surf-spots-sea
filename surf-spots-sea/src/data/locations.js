// Singapore 2,000km Radius - Surf Spots and Golf Courses
// Singapore coordinates: 1.3521°N, 103.8198°E

const allLocations = [
  // === SURF SPOTS (within 2,000km from Singapore) ===
  
  // Indonesia - Bali & Surrounding Islands
  {
    id: 'uluwatu',
    name: 'Uluwatu',
    type: 'surf',
    location: { lat: -8.8290, lon: 115.0850 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'World-famous reef break with powerful waves',
    comment: 'バリ島を代表する世界的に有名なサーフスポット。パワフルな波とバレルが魅力。',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Reef break',
    difficulty: 'Advanced',
    distance: '1,400km'
  },
  {
    id: 'canggu',
    name: 'Canggu',
    type: 'surf',
    location: { lat: -8.6480, lon: 115.1380 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Popular beach break for all levels',
    comment: '初心者から上級者まで楽しめる人気のビーチブレイク。カフェ文化も充実。',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Beach break',
    difficulty: 'Beginner to Advanced',
    distance: '1,380km'
  },
  {
    id: 'padang-padang',
    name: 'Padang Padang',
    type: 'surf',
    location: { lat: -8.8167, lon: 115.0833 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Iconic barrel, featured in Eat Pray Love',
    comment: '映画「食べて、祈って、恋をして」で有名になった美しいバレル。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'May - September',
    waveType: 'Reef break',
    difficulty: 'Advanced',
    distance: '1,400km'
  },
  {
    id: 'keramas',
    name: 'Keramas',
    type: 'surf',
    location: { lat: -8.5833, lon: 115.3333 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Black sand beach, WSL Championship Tour venue',
    comment: 'WSLチャンピオンシップツアーの会場。黒砂のビーチで質の高い波が楽しめる。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Beach break',
    difficulty: 'Intermediate to Advanced',
    distance: '1,360km'
  },
  {
    id: 'nusa-dua',
    name: 'Nusa Dua',
    type: 'surf',
    location: { lat: -8.8000, lon: 115.2333 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Reef breaks suitable for intermediates',
    comment: '高級リゾートエリア。中級者向けのリーフブレイクが複数ある。',
    image: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Reef break',
    difficulty: 'Intermediate',
    distance: '1,390km'
  },
  {
    id: 'nias',
    name: 'Nias Island',
    type: 'surf',
    location: { lat: 1.0833, lon: 97.6167 },
    country: 'Indonesia',
    region: 'Sumatra',
    description: 'Legendary right-hand point break',
    comment: '伝説的なライトハンドのポイントブレイク。世界中のサーファーの憧れ。',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=250&fit=crop',
    bestSeason: 'March - October',
    waveType: 'Point break',
    difficulty: 'Advanced',
    distance: '850km'
  },
  {
    id: 'krui',
    name: 'Krui',
    type: 'surf',
    location: { lat: -5.1500, lon: 103.9167 },
    country: 'Indonesia',
    region: 'Sumatra',
    description: 'Multiple point breaks along the coast',
    comment: '海岸線に沿って複数のポイントブレイクが点在。穴場スポット。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Point break',
    difficulty: 'Intermediate to Advanced',
    distance: '650km'
  },
  {
    id: 'nongsa',
    name: 'Nongsa Beach',
    type: 'surf',
    location: { lat: 1.1667, lon: 104.1167 },
    country: 'Indonesia',
    region: 'Batam',
    description: 'Closest surf spot from Singapore',
    comment: 'シンガポールから最も近いサーフスポット。週末のショートトリップに最適。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '30km'
  },
  {
    id: 'trikora',
    name: 'Trikora Beach',
    type: 'surf',
    location: { lat: 1.0167, lon: 104.5333 },
    country: 'Indonesia',
    region: 'Bintan',
    description: 'White sand beach with gentle waves',
    comment: '白砂のビーチで穏やかな波。初心者の練習に最適な環境。',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    bestSeason: 'December - February',
    waveType: 'Beach break',
    difficulty: 'Beginner',
    distance: '80km'
  },
  {
    id: 'lombok-gerupuk',
    name: 'Gerupuk',
    type: 'surf',
    location: { lat: -8.8833, lon: 116.3167 },
    country: 'Indonesia',
    region: 'Lombok',
    description: 'Multiple breaks in protected bay',
    bestSeason: 'April - October',
    waveType: 'Reef break',
    difficulty: 'Beginner to Advanced',
    distance: '1,500km'
  },
  
  // Malaysia
  {
    id: 'desaru',
    name: 'Desaru Beach',
    type: 'surf',
    location: { lat: 1.5500, lon: 104.2500 },
    country: 'Malaysia',
    region: 'Johor',
    description: 'Popular beach resort with consistent waves',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '120km'
  },
  {
    id: 'tioman',
    name: 'Tioman Island',
    type: 'surf',
    location: { lat: 2.8167, lon: 104.1667 },
    country: 'Malaysia',
    region: 'Pahang',
    description: 'Beautiful tropical island with reef breaks',
    bestSeason: 'March - October',
    waveType: 'Reef break',
    difficulty: 'Intermediate to Advanced',
    distance: '280km'
  },
  {
    id: 'cherating',
    name: 'Cherating',
    type: 'surf',
    location: { lat: 3.9667, lon: 103.4167 },
    country: 'Malaysia',
    region: 'Pahang',
    description: 'East coast surf hub',
    comment: '東海岸のサーフハブ。初心者から中級者向けのビーチブレイク。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '380km'
  },
  
  // Philippines
  {
    id: 'siargao-cloud9',
    name: 'Cloud 9',
    type: 'surf',
    location: { lat: 9.8333, lon: 126.1667 },
    country: 'Philippines',
    region: 'Siargao',
    description: 'World-famous right-hand reef break',
    comment: 'フィリピンを代表する世界的に有名なサーフスポット。パワフルなライトハンドのリーフブレイク。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'September - November',
    waveType: 'Reef break',
    difficulty: 'Advanced',
    distance: '2,400km'
  },
  {
    id: 'siargao-stimpy',
    name: 'Stimpy\'s',
    type: 'surf',
    location: { lat: 9.8500, lon: 126.1500 },
    country: 'Philippines',
    region: 'Siargao',
    description: 'Hollow left-hand reef break',
    comment: 'ホローなレフトハンドのリーフブレイク。上級者向けの挑戦的な波。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'September - November',
    waveType: 'Reef break',
    difficulty: 'Advanced',
    distance: '2,400km'
  },
  {
    id: 'la-union-monaliza',
    name: 'Monaliza Point',
    type: 'surf',
    location: { lat: 16.5667, lon: 120.3333 },
    country: 'Philippines',
    region: 'La Union',
    description: 'Popular surf town, beginner-friendly',
    comment: 'フィリピンのサーフタウン。初心者から楽しめる穏やかな波。',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    bestSeason: 'October - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '2,200km'
  },
  {
    id: 'baler-sabang',
    name: 'Sabang Beach',
    type: 'surf',
    location: { lat: 15.7667, lon: 121.5667 },
    country: 'Philippines',
    region: 'Baler',
    description: 'Birthplace of Philippine surfing',
    comment: 'フィリピンサーフィン発祥の地。歴史あるビーチブレイク。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'October - February',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '2,300km'
  },
  
  // Vietnam
  {
    id: 'mui-ne',
    name: 'Mui Ne',
    type: 'surf',
    location: { lat: 10.9333, lon: 108.2833 },
    country: 'Vietnam',
    region: 'Phan Thiet',
    description: 'Kitesurfing and windsurfing paradise',
    comment: 'カイトサーフィンとウィンドサーフィンのメッカ。強風が特徴。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Intermediate',
    distance: '1,100km'
  },
  {
    id: 'china-beach',
    name: 'China Beach',
    type: 'surf',
    location: { lat: 16.0333, lon: 108.2500 },
    country: 'Vietnam',
    region: 'Da Nang',
    description: 'Long sandy beach with consistent waves',
    comment: '長い砂浜のビーチ。安定した波が特徴。',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    bestSeason: 'September - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '1,600km'
  },
  
  // Thailand
  {
    id: 'phuket-kata',
    name: 'Kata Beach',
    type: 'surf',
    location: { lat: 7.8167, lon: 98.2917 },
    country: 'Thailand',
    region: 'Phuket',
    description: 'Best surf spot in Phuket',
    bestSeason: 'May - October',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '850km'
  },
  {
    id: 'phuket-kalim',
    name: 'Kalim Beach',
    type: 'surf',
    location: { lat: 7.8833, lon: 98.2833 },
    country: 'Thailand',
    region: 'Phuket',
    description: 'Rocky reef break north of Patong',
    comment: 'パトンビーチの北にあるリーフブレイク。ローカルに人気。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'May - October',
    waveType: 'Reef break',
    difficulty: 'Intermediate',
    distance: '850km'
  },
  {
    id: 'phuket-nai-harn',
    name: 'Nai Harn Beach',
    type: 'surf',
    location: { lat: 7.7833, lon: 98.3000 },
    country: 'Thailand',
    region: 'Phuket',
    description: 'Beautiful bay with seasonal waves',
    comment: '美しい湾。季節限定で良い波が立つ。',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    bestSeason: 'May - October',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '860km'
  },
  {
    id: 'khao-lak',
    name: 'Khao Lak',
    type: 'surf',
    location: { lat: 8.6500, lon: 98.2500 },
    country: 'Thailand',
    region: 'Phang Nga',
    description: 'Quiet beach town with consistent waves',
    comment: '静かなビーチタウン。安定した波が特徴。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'May - October',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate',
    distance: '800km'
  },
  
  // Sri Lanka
  {
    id: 'arugam-bay',
    name: 'Arugam Bay',
    type: 'surf',
    location: { lat: 6.8667, lon: 81.8333 },
    country: 'Sri Lanka',
    region: 'Eastern Province',
    description: 'World-class right-hand point break',
    comment: '世界クラスのライトハンドポイントブレイク。東海岸の宝石。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'May - September',
    waveType: 'Point break',
    difficulty: 'Intermediate to Advanced',
    distance: '2,800km'
  },
  {
    id: 'hikkaduwa',
    name: 'Hikkaduwa',
    type: 'surf',
    location: { lat: 6.1333, lon: 80.1000 },
    country: 'Sri Lanka',
    region: 'Southern Province',
    description: 'Popular beach town with multiple breaks',
    comment: '人気のビーチタウン。複数のブレイクポイントがある。',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    bestSeason: 'November - March',
    waveType: 'Reef break',
    difficulty: 'Beginner to Advanced',
    distance: '2,900km'
  },
  {
    id: 'weligama',
    name: 'Weligama',
    type: 'surf',
    location: { lat: 5.9667, lon: 80.4333 },
    country: 'Sri Lanka',
    region: 'Southern Province',
    description: 'Perfect for beginners, gentle waves',
    comment: '初心者に最適。穏やかで優しい波。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Beginner',
    distance: '2,950km'
  },
  
  // Maldives
  {
    id: 'male-chickens',
    name: 'Chickens (Villingili)',
    type: 'surf',
    location: { lat: 4.1667, lon: 73.5000 },
    country: 'Maldives',
    region: 'North Male Atoll',
    description: 'Consistent right-hand reef break',
    comment: '安定したライトハンドのリーフブレイク。モルディブの定番スポット。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'March - October',
    waveType: 'Reef break',
    difficulty: 'Intermediate to Advanced',
    distance: '2,950km'
  },
  
  // Additional Indonesia spots
  {
    id: 'mentawai-lance',
    name: 'Lance\'s Right',
    type: 'surf',
    location: { lat: -2.1667, lon: 99.8333 },
    country: 'Indonesia',
    region: 'Mentawai Islands',
    description: 'Perfect barrel machine',
    comment: '完璧なバレルマシーン。世界中のサーファーの憧れ。',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Reef break',
    difficulty: 'Advanced',
    distance: '1,100km'
  },
  {
    id: 'mentawai-macaronis',
    name: 'Macaronis',
    type: 'surf',
    location: { lat: -2.2000, lon: 99.8000 },
    country: 'Indonesia',
    region: 'Mentawai Islands',
    description: 'Long perfect left-hander',
    comment: '長く完璧なレフトハンド。メンタワイの宝石。',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Reef break',
    difficulty: 'Intermediate to Advanced',
    distance: '1,100km'
  },
  {
    id: 'sumbawa-lakey',
    name: 'Lakey Peak',
    type: 'surf',
    location: { lat: -8.7167, lon: 118.3667 },
    country: 'Indonesia',
    region: 'Sumbawa',
    description: 'A-frame peak with left and right',
    comment: 'レフトとライト両方楽しめるAフレームピーク。',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    bestSeason: 'May - September',
    waveType: 'Reef break',
    difficulty: 'Intermediate to Advanced',
    distance: '1,800km'
  },
  {
    id: 'java-grajagan',
    name: 'G-Land (Grajagan)',
    type: 'surf',
    location: { lat: -8.6333, lon: 114.4333 },
    country: 'Indonesia',
    region: 'Java',
    description: 'One of the world\'s best left-handers',
    comment: '世界最高のレフトハンドの一つ。ジャングルに囲まれた秘境。',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=400&h=250&fit=crop',
    bestSeason: 'April - October',
    waveType: 'Reef break',
    difficulty: 'Advanced',
    distance: '1,200km'
  },
  
  // === GOLF COURSES (within 3,000km from Singapore) ===
  
  // Singapore
  {
    id: 'sentosa-serapong',
    name: 'Sentosa Golf Club - Serapong',
    type: 'golf',
    location: { lat: 1.2494, lon: 103.8303 },
    country: 'Singapore',
    region: 'Sentosa',
    description: 'Championship course, hosts SMBC Singapore Open',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '5km'
  },
  {
    id: 'sentosa-tanjong',
    name: 'Sentosa Golf Club - Tanjong',
    type: 'golf',
    location: { lat: 1.2500, lon: 103.8280 },
    country: 'Singapore',
    region: 'Sentosa',
    description: 'Scenic clifftop course',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '5km'
  },
  {
    id: 'sicc-island',
    name: 'Singapore Island Country Club - Island',
    type: 'golf',
    location: { lat: 1.3521, lon: 103.8198 },
    country: 'Singapore',
    region: 'Bukit',
    description: 'Premier private club',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '2km'
  },
  {
    id: 'sicc-bukit',
    name: 'Singapore Island Country Club - Bukit',
    type: 'golf',
    location: { lat: 1.3530, lon: 103.8210 },
    country: 'Singapore',
    region: 'Bukit',
    description: 'Challenging layout',
    holes: 18,
    par: 71,
    difficulty: 'Championship',
    distance: '2km'
  },
  {
    id: 'tanah-merah-garden',
    name: 'Tanah Merah Country Club - Garden',
    type: 'golf',
    location: { lat: 1.3833, lon: 103.9833 },
    country: 'Singapore',
    region: 'Changi',
    description: 'Near airport, championship standard',
    comment: '空港近くのチャンピオンシップコース。アクセス抜群で本格的なゴルフが楽しめる。',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '18km'
  },
  {
    id: 'tanah-merah-tampines',
    name: 'Tanah Merah Country Club - Tampines',
    type: 'golf',
    location: { lat: 1.3840, lon: 103.9840 },
    country: 'Singapore',
    region: 'Changi',
    description: 'Links-style course',
    comment: 'リンクススタイルのコース。風を読むプレーが求められる戦略的なレイアウト。',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=250&fit=crop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '18km'
  },
  {
    id: 'laguna-national-masters',
    name: 'Laguna National Golf Resort - Masters',
    type: 'golf',
    location: { lat: 1.4167, lon: 103.7500 },
    country: 'Singapore',
    region: 'Jurong',
    description: 'Former Singapore Masters venue',
    comment: 'シンガポールマスターズの元会場。プロトーナメント基準の難易度。',
    image: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=400&h=250&fit=crop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '15km'
  },
  {
    id: 'seletar-cc',
    name: 'Seletar Country Club',
    type: 'golf',
    location: { lat: 1.4167, lon: 103.8667 },
    country: 'Singapore',
    region: 'Seletar',
    description: 'Historic club with mature trees',
    comment: '歴史あるクラブ。成熟した樹木に囲まれた落ち着いた雰囲気。',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=250&fit=crop',
    holes: 18,
    par: 70,
    difficulty: 'Resort',
    distance: '12km'
  },
  
  // Malaysia - Johor
  {
    id: 'els-club-ocean',
    name: 'The Els Club Desaru Coast - Ocean',
    type: 'golf',
    location: { lat: 1.5667, lon: 104.2667 },
    country: 'Malaysia',
    region: 'Johor',
    description: 'Ernie Els designed, ocean views',
    comment: 'アーニー・エルス設計。オーシャンビューが美しいリゾートコース。',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '125km'
  },
  {
    id: 'els-club-valley',
    name: 'The Els Club Desaru Coast - Valley',
    type: 'golf',
    location: { lat: 1.5670, lon: 104.2670 },
    country: 'Malaysia',
    region: 'Johor',
    description: 'Ernie Els designed, valley course',
    comment: 'アーニー・エルス設計のバレーコース。起伏に富んだ戦略的なレイアウト。',
    image: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=400&h=250&fit=crop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '125km'
  },
  {
    id: 'horizon-hills',
    name: 'Horizon Hills Golf & Country Club',
    type: 'golf',
    location: { lat: 1.5333, lon: 103.6333 },
    country: 'Malaysia',
    region: 'Johor',
    description: 'Award-winning design',
    comment: '数々の賞を受賞した名門コース。シンガポールから日帰り可能。',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '45km'
  },
  {
    id: 'palm-resort',
    name: 'Palm Resort Golf & Country Club',
    type: 'golf',
    location: { lat: 1.5500, lon: 103.6500 },
    country: 'Malaysia',
    region: 'Johor',
    description: 'Two championship courses',
    holes: 36,
    par: 72,
    difficulty: 'Championship',
    distance: '50km'
  },
  
  // Malaysia - Kuala Lumpur
  {
    id: 'kl-golf-west',
    name: 'Kuala Lumpur Golf & Country Club - West',
    type: 'golf',
    location: { lat: 3.0833, lon: 101.6500 },
    country: 'Malaysia',
    region: 'Kuala Lumpur',
    description: 'Hosts Malaysian Open',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '320km'
  },
  {
    id: 'kl-golf-east',
    name: 'Kuala Lumpur Golf & Country Club - East',
    type: 'golf',
    location: { lat: 3.0840, lon: 101.6510 },
    country: 'Malaysia',
    region: 'Kuala Lumpur',
    description: 'Championship standard',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '320km'
  },
  {
    id: 'tropicana-west',
    name: 'Tropicana Golf & Country Resort - West',
    type: 'golf',
    location: { lat: 3.0833, lon: 101.6000 },
    country: 'Malaysia',
    region: 'Selangor',
    description: 'Mature parkland course',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '315km'
  },
  
  // Thailand
  {
    id: 'black-mountain',
    name: 'Black Mountain Golf Club',
    type: 'golf',
    location: { lat: 12.5667, lon: 99.9500 },
    country: 'Thailand',
    region: 'Hua Hin',
    description: 'Stunning mountain backdrop',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '1,100km'
  },
  {
    id: 'banyan-tree-phuket',
    name: 'Banyan Tree Phuket',
    type: 'golf',
    location: { lat: 8.0167, lon: 98.3000 },
    country: 'Thailand',
    region: 'Phuket',
    description: 'Lagoon course',
    holes: 18,
    par: 72,
    difficulty: 'Resort',
    distance: '870km'
  },
  {
    id: 'laguna-phuket',
    name: 'Laguna Golf Phuket',
    type: 'golf',
    location: { lat: 8.0000, lon: 98.3000 },
    country: 'Thailand',
    region: 'Phuket',
    description: 'Integrated resort course',
    holes: 18,
    par: 71,
    difficulty: 'Resort',
    distance: '870km'
  },
  
  // Indonesia - Bali
  {
    id: 'nirwana-bali',
    name: 'Nirwana Bali Golf Club',
    type: 'golf',
    location: { lat: -8.6333, lon: 115.1167 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Clifftop course with ocean views',
    holes: 18,
    par: 72,
    difficulty: 'Resort',
    distance: '1,380km'
  },
  {
    id: 'new-kuta-golf',
    name: 'New Kuta Golf',
    type: 'golf',
    location: { lat: -8.8167, lon: 115.1667 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Dramatic clifftop layout',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '1,400km'
  },
  {
    id: 'bali-national',
    name: 'Bali National Golf Club',
    type: 'golf',
    location: { lat: -8.7500, lon: 115.1667 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Championship course',
    holes: 18,
    par: 72,
    difficulty: 'Championship',
    distance: '1,390km'
  },
  {
    id: 'handara-golf',
    name: 'Handara Golf & Resort Bali',
    type: 'golf',
    location: { lat: -8.2500, lon: 115.1333 },
    country: 'Indonesia',
    region: 'Bali',
    description: 'Mountain course, cool climate',
    holes: 18,
    par: 72,
    difficulty: 'Resort',
    distance: '1,340km'
  },
  
  // Indonesia - Bintan
  {
    id: 'bintan-lagoon',
    name: 'Bintan Lagoon Resort Golf Club',
    type: 'golf',
    location: { lat: 1.1333, lon: 104.4833 },
    country: 'Indonesia',
    region: 'Bintan',
    description: 'Two courses by the sea',
    comment: '海沿いの2つのコース。リゾート気分でゴルフを満喫できる。',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=250&fit=crop',
    holes: 36,
    par: 72,
    difficulty: 'Resort',
    distance: '75km'
  },
  {
    id: 'ria-bintan',
    name: 'Ria Bintan Golf Club',
    type: 'golf',
    location: { lat: 1.1500, lon: 104.5000 },
    country: 'Indonesia',
    region: 'Bintan',
    description: 'Gary Player & Jack Nicklaus courses',
    comment: 'ゲーリー・プレーヤーとジャック・ニクラウス設計の2コース。世界クラスのゴルフ体験。',
    image: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=400&h=250&fit=crop',
    holes: 36,
    par: 72,
    difficulty: 'Championship',
    distance: '80km'
  },
  
  // Indonesia - Batam
  {
    id: 'batam-hills',
    name: 'Batam Hills Golf Resort',
    type: 'golf',
    location: { lat: 1.1000, lon: 104.0500 },
    country: 'Indonesia',
    region: 'Batam',
    description: 'Hilly terrain with sea views',
    holes: 18,
    par: 72,
    difficulty: 'Resort',
    distance: '35km'
  },
  {
    id: 'palm-springs-batam',
    name: 'Palm Springs Golf & Beach Resort',
    type: 'golf',
    location: { lat: 1.0833, lon: 103.9667 },
    country: 'Indonesia',
    region: 'Batam',
    description: 'Beachfront course',
    holes: 18,
    par: 72,
    difficulty: 'Resort',
    distance: '40km'
  }
]

// Filter locations within 1000km radius
const parseDistance = (distanceStr) => {
  if (!distanceStr) return 9999
  const match = distanceStr.match(/(\d+(?:,\d+)?)/);
  return match ? parseInt(match[1].replace(',', '')) : 9999
}

// Export only locations within 2000km and sort by distance
export const locations = allLocations
  .filter(loc => parseDistance(loc.distance) <= 2000)
  .sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance))

// Helper functions
export const getSurfSpots = () => locations.filter(loc => loc.type === 'surf')
export const getGolfCourses = () => locations.filter(loc => loc.type === 'golf')
export const getLocationById = (id) => locations.find(loc => loc.id === id)
export const getLocationsByCountry = (country) => locations.filter(loc => loc.country === country)
export const getLocationsByType = (type) => locations.filter(loc => loc.type === type)

// Statistics
export const getStats = () => ({
  total: locations.length,
  surf: getSurfSpots().length,
  golf: getGolfCourses().length,
  countries: [...new Set(locations.map(loc => loc.country))].length
})

// Made with Bob