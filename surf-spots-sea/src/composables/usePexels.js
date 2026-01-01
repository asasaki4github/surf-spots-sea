import { ref } from 'vue'

/**
 * Pexels APIを使用して写真を取得するComposable
 */
export function usePexels() {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * スポット名で写真を検索
   * @param {string} query - 検索クエリ（スポット名）
   * @param {number} perPage - 取得する写真の数
   * @returns {Promise<string|null>} - 写真のURL
   */
  const searchPhoto = async (query, perPage = 1) => {
    if (!apiKey) {
      console.error('Pexels API key is not configured')
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            Authorization: apiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.photos && data.photos.length > 0) {
        // 中サイズの写真URLを返す（幅640px）
        return data.photos[0].src.large || data.photos[0].src.medium
      }

      return null
    } catch (err) {
      console.error('Error fetching photo from Pexels:', err)
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 複数のスポットの写真を一括取得（並列処理で高速化）
   * @param {Array} locations - ロケーションの配列
   * @returns {Promise<Object>} - スポットIDをキーとした写真URLのオブジェクト
   */
  const fetchPhotosForLocations = async (locations) => {
    const photos = {}
    const batchSize = 5 // 5件ずつ並列処理
    
    // バッチ処理で並列実行
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (location) => {
        // タイプに応じて検索クエリを調整
        let query
        if (location.type === 'surf') {
          query = `${location.name} surfing ${location.country}`
        } else if (location.type === 'golf') {
          query = `${location.name} golf course ${location.country}`
        } else {
          query = `${location.name} ${location.country}`
        }
        
        const photoUrl = await searchPhoto(query)
        return { id: location.id, url: photoUrl }
      })
      
      const results = await Promise.all(batchPromises)
      
      results.forEach(result => {
        if (result.url) {
          photos[result.id] = result.url
        }
      })
      
      // バッチ間で短い待機（APIレート制限対策）
      if (i + batchSize < locations.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return photos
  }

  return {
    isLoading,
    error,
    searchPhoto,
    fetchPhotosForLocations
  }
}

// Made with Bob
