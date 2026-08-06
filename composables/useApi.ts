export const useApi = () => {
  const reqHeaders = useRequestHeaders(['cookie']) as Record<string, string>
  
  const get = <T>(url: string, params?: Record<string, any>) => $fetch<T>(url, { headers: reqHeaders, params })
  const post = <T>(url: string, body: any) => $fetch<T>(url, { method: 'POST', body, headers: reqHeaders })
  const patch = <T>(url: string, body: any) => $fetch<T>(url, { method: 'PATCH', body, headers: reqHeaders })
  const del = <T>(url: string) => $fetch<T>(url, { method: 'DELETE', headers: reqHeaders })
  
  return { get, post, patch, del }
}
