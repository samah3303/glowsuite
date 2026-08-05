export const useAuth = () => {
  const user = useState('user', () => null)
  const loading = useState('auth-loading', () => false)

  const fetchUser = async () => {
    loading.value = true
    try {
      const data = await $fetch('/api/auth/me', {
        headers: useRequestHeaders(['cookie']) as HeadersInit
      })
      user.value = data
    } catch (err) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials: any) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    user.value = data
    return data
  }

  const register = async (credentials: any) => {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: credentials
    })
    return data
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  return {
    user,
    loading,
    fetchUser,
    login,
    register,
    logout
  }
}
