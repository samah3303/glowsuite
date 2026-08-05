import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const showToast = ({ message, type = 'info', duration = 3000 }: { message: string, type?: 'success' | 'error' | 'info', duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return { toasts, showToast }
}
