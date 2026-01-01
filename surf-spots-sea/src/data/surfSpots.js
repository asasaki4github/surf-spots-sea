// シンガポールから3-4時間圏内の主要サーフスポット
export const surfSpots = [
  {
    id: 'nongsa-beach',
    name: 'Nongsa Beach',
    location: {
      lat: 1.1667,
      lon: 104.1167
    },
    country: 'Indonesia',
    island: 'Batam Island',
    travelTime: '1 hour (ferry)',
    description: 'シンガポールから最も近いサーフスポット。初心者から中級者向け。',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate'
  },
  {
    id: 'trikora-beach',
    name: 'Trikora Beach',
    location: {
      lat: 1.0167,
      lon: 104.5333
    },
    country: 'Indonesia',
    island: 'Bintan Island',
    travelTime: '1.5 hours (ferry)',
    description: '美しい白砂のビーチで、穏やかな波が特徴。ファミリー向け。',
    bestSeason: 'December - February',
    waveType: 'Beach break',
    difficulty: 'Beginner'
  },
  {
    id: 'desaru-beach',
    name: 'Desaru Beach',
    location: {
      lat: 1.5500,
      lon: 104.2500
    },
    country: 'Malaysia',
    island: 'Johor',
    travelTime: '2 hours (car)',
    description: 'マレーシア・ジョホール州の人気ビーチリゾート。安定した波。',
    bestSeason: 'November - March',
    waveType: 'Beach break',
    difficulty: 'Beginner to Intermediate'
  },
  {
    id: 'tioman-island',
    name: 'Tioman Island',
    location: {
      lat: 2.8167,
      lon: 104.1667
    },
    country: 'Malaysia',
    island: 'Tioman Island',
    travelTime: '3-4 hours (ferry)',
    description: '美しい熱帯の島。ダイビングとサーフィンの両方が楽しめる。',
    bestSeason: 'March - October',
    waveType: 'Reef break',
    difficulty: 'Intermediate to Advanced'
  },
  {
    id: 'parai-beach',
    name: 'Parai Beach',
    location: {
      lat: -2.1333,
      lon: 106.1167
    },
    country: 'Indonesia',
    island: 'Bangka Island',
    travelTime: '2 hours (flight)',
    description: 'バンカ島の美しいビーチ。透明度の高い海と良質な波。',
    bestSeason: 'April - October',
    waveType: 'Beach break',
    difficulty: 'Intermediate'
  }
]

// サーフスポットをIDで取得
export const getSurfSpotById = (id) => {
  return surfSpots.find(spot => spot.id === id)
}

// 国別にサーフスポットを取得
export const getSurfSpotsByCountry = (country) => {
  return surfSpots.filter(spot => spot.country === country)
}

// Made with Bob
