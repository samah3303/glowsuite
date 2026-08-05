export const useApi = () => {
  const get = <T>(url: string, params?: Record<string, any>) => $fetch<T>(url, { params })
  const post = <T>(url: string, body: any) => $fetch<T>(url, { method: 'POST', body })
  const patch = <T>(url: string, body: any) => $fetch<T>(url, { method: 'PATCH', body })
  const del = <T>(url: string) => $fetch<T>(url, { method: 'DELETE' })
  return { get, post, patch, del }
}
