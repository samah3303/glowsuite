<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Staff Management</h2>
      <NuxtLink to="/app/staff/create" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
        Add Staff
      </NuxtLink>
    </div>

    <div class="bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-900">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700 bg-gray-800">
          <tr v-if="pending" class="text-center">
            <td colspan="4" class="px-6 py-4 text-gray-400">Loading...</td>
          </tr>
          <tr v-else-if="staffList?.length === 0" class="text-center">
            <td colspan="4" class="px-6 py-4 text-gray-400">No staff members found.</td>
          </tr>
          <tr v-for="staff in staffList" :key="staff.id" class="hover:bg-gray-700 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <span class="text-white font-medium">{{ staff.firstName }} {{ staff.lastName }}</span>
                <span class="text-sm text-gray-400">{{ staff.email }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-300">{{ staff.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="staff.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'" 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ staff.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <NuxtLink :to="`/app/staff/${staff.id}`" class="text-blue-400 hover:text-blue-300 mr-4">Edit</NuxtLink>
              <button @click="deleteStaff(staff.id)" class="text-red-400 hover:text-red-300">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { data: staffList, pending, refresh } = await useFetch('/api/staff')

async function deleteStaff(id) {
  if (confirm('Are you sure you want to delete this staff member?')) {
    try {
      await $fetch(`/api/staff/${id}`, { method: 'DELETE' })
      refresh()
    } catch (err) {
      alert('Error deleting staff: ' + err.message)
    }
  }
}
</script>
