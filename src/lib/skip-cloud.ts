const API_URL = import.meta.env.VITE_SKIP_CLOUD_URL || ''
export const SKIP_CLOUD_ENABLED = !!API_URL

class SkipCloudClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.token = localStorage.getItem('sc-token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) localStorage.setItem('sc-token', token)
    else localStorage.removeItem('sc-token')
  }

  getToken() {
    return this.token
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = { ...(options.headers as Record<string, string>) }
    if (this.token) headers['Authorization'] = this.token
    if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Erro ${res.status}`)
    }
    return res
  }

  async login(email: string, password: string) {
    const res = await this.request('/api/collections/users/auth-with-password', {
      method: 'POST',
      body: JSON.stringify({ identity: email, password }),
    })
    const data = await res.json()
    this.setToken(data.token)
    return data
  }

  async logout() {
    try {
      await this.request('/api/collections/users/auth', { method: 'DELETE' })
    } catch {
      // ignore
    }
    this.setToken(null)
  }

  async list(collection: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await this.request(`/api/collections/${collection}/records?${query}`)
    return res.json()
  }

  async create(collection: string, data: Record<string, unknown> | FormData) {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    const res = await this.request(`/api/collections/${collection}/records`, {
      method: 'POST',
      body,
    })
    return res.json()
  }

  async update(collection: string, id: string, data: Record<string, unknown> | FormData) {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    const res = await this.request(`/api/collections/${collection}/records/${id}`, {
      method: 'PATCH',
      body,
    })
    return res.json()
  }

  async delete(collection: string, id: string) {
    await this.request(`/api/collections/${collection}/records/${id}`, { method: 'DELETE' })
  }

  getFileUrl(collection: string, recordId: string, filename: string) {
    const token = this.token ? `?token=${this.token}` : ''
    return `${this.baseUrl}/api/files/${collection}/${recordId}/${filename}${token}`
  }
}

export const skipCloud = new SkipCloudClient(API_URL)
