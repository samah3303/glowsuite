<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center mb-6">
      <NuxtLink to="/app/staff" class="text-gray-400 hover:text-white mr-4">
        &larr; Back
      </NuxtLink>
      <h2 class="text-3xl font-bold">Edit Staff</h2>
    </div>

    <div v-if="pending" class="text-gray-400">Loading...</div>
    <div v-else-if="fetchError" class="text-red-400">{{ fetchError.message }}</div>
    <form v-else @submit.prevent="submitForm" class="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">First Name</label>
          <input v-model="form.firstName" type="text" required class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
          <input v-model="form.lastName" type="text" required class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <input v-model="form.email" type="email" required class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Phone</label>
          <input v-model="form.phone" type="text" class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Role</label>
          <select v-model="form.role" required class="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500">
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div class="flex items-center mt-8">
          <label class="flex items-center cursor-pointer">
            <div class="relative">
              <input v-model="form.isActive" type="checkbox" class="sr-only" />
              <div class="block bg-gray-600 w-10 h-6 rounded-full" :class="{'bg-blue-600': form.isActive}"></div>
              <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform" :class="{'translate-x-4': form.isActive}"></div>
            </div>
            <div class="ml-3 text-gray-400 font-medium">Active</div>
          </label>
        </div>
      </div>
      
      <div v-if="error" class="mb-4 text-red-400 text-sm">{{ error }}</div>
      
      <div class="flex justify-end">
        <button type="submit" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors disabled:opacity-50">
          {{ loading ? 'Saving...' : 'Update Staff' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const id = route.params.id

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Staff',
  isActive: true
})

const { data: staff, pending, error: fetchError } = await useFetch(`/api/staff/${id}`)

watchEffect(() => {
  if (staff.value) {
    form.firstName = staff.value.firstName
    form.lastName = staff.value.lastName
    form.email = staff.value.email
    form.phone = staff.value.phone || ''
    form.role = staff.value.role
    form.isActive = staff.value.isActive
  }
})

const error = ref('')
const loading = ref(false)

async function submitForm() {
  error.value = ''
  loading.value = true
  
  try {
    await $fetch(`/api/staff/${id}`, {
      method: 'PUT',
      body: form
    })
    router.push('/app/staff')
  } catch (err) {
    error.value = err.data?.message || err.message
  } finally {
    loading.value = false
  }
}
</script>
