type MovieVideo = {
  key?: string
  name?: string
  site?: string
  type?: string
  official?: boolean
}

class Movie {
  async fetcher(path: string, options: RequestInit | undefined = {}) {
    const THEMOVIEDB_API_URL = process.env.THEMOVIEDB_API_URL
    const THEMOVIEDB_ACCESS_TOKEN = process.env.THEMOVIEDB_ACCESS_TOKEN

    if (!THEMOVIEDB_API_URL || !THEMOVIEDB_ACCESS_TOKEN) {
      throw new Error('The Movie Database environment variables are not configured.')
    }

    const url = `${THEMOVIEDB_API_URL}${path}`

    const init: RequestInit = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${THEMOVIEDB_ACCESS_TOKEN}`,
      },
      signal: AbortSignal.timeout(10_000),
      ...options,
    }

    try {
      const response = await fetch(url, init)
      if (!response.ok) throw new Error(`TMDB returned HTTP ${response.status}`)
      const data = await response.json()

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error(String(error))
    }
  }

  async list(type: string, page: string) {
    try {
      const data = await this.fetcher(`/movie/${type}?language=en-US&page=${page}`)

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error(String(error))
    }
  }

  async search(query: string, page: string) {
    try {
      const data = await this.fetcher(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`)

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error(String(error))
    }
  }

  async detail(id: string) {
    if (!id || String(id).trim() === '') {
      throw new Error('Invalid movie id')
    }

    const encodedId = encodeURIComponent(String(id))

    try {
      const data = await this.fetcher(`/movie/${encodedId}?language=en-US`)

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error(String(error))
    }
  }
  async trailer(id: string) {
    const { results }: { results?: MovieVideo[] } = await this.fetcher(`/movie/${id}/videos?language=en-US`)
    const trailer = results?.find(({ key, site, type, official }) =>
      site === 'YouTube' && type === 'Trailer' && official === true &&
      typeof key === 'string' && /^[A-Za-z0-9_-]{11}$/.test(key)
    )

    return trailer ? { key: trailer.key, name: trailer.name || 'Official trailer' } : null
  }

  async credits(id: string) {
    if (!id || String(id).trim() === '') {
      throw new Error('Invalid movie id')
    }

    const encodedId = encodeURIComponent(String(id))
    const path = `/movie/${encodedId}/credits?language=en-US`
    console.debug('[Movie.credits] id=%s path=%s', id, path)

    try {
      const data = await this.fetcher(path)

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error(String(error))
    }
  }
}

export default new Movie()
