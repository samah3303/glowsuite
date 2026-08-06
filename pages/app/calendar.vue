<template>
  <div class="h-[calc(100vh-7rem)] flex flex-col bg-surface-950 rounded-2xl border border-surface-800 overflow-hidden relative">
    
    <!-- Top Controls Bar -->
    <div class="h-16 flex items-center justify-between px-4 md:px-6 border-b border-surface-800 bg-surface-900/50 backdrop-blur-md z-10 shrink-0">
      <div class="flex items-center gap-2 md:gap-4">
        <button class="btn-ghost !px-2 min-h-[44px]" @click="prevDay">
          <Icon name="lucide:chevron-left" class="w-5 h-5" />
        </button>
        <button class="btn-ghost font-medium hidden md:block min-h-[44px]" @click="goToToday">Today</button>
        <button class="btn-ghost !px-2 min-h-[44px]" @click="nextDay">
          <Icon name="lucide:chevron-right" class="w-5 h-5" />
        </button>
        <span class="text-surface-50 font-semibold text-lg ml-2">{{ formattedDate }}</span>
      </div>

      <div class="hidden md:flex bg-surface-800/50 p-1 rounded-lg">
        <button class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors bg-surface-700 text-white min-h-[36px]">Day</button>
        <button class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors text-surface-400 hover:text-surface-200 min-h-[36px]">Week</button>
      </div>
    </div>

    <!-- Calendar Area -->
    <div class="flex-1 overflow-auto flex relative" ref="calendarContainer">
      <!-- Time Labels Column -->
      <div class="w-16 md:w-20 shrink-0 sticky left-0 z-20 bg-surface-950 border-r border-surface-800">
        <div class="h-14 border-b border-surface-800 sticky top-0 bg-surface-950 z-30"></div> <!-- Empty top corner -->
        <div class="relative" :style="{ height: `${totalMinutes * pixelsPerMinute}px` }">
          <div v-for="time in timeLabels" :key="time.label" 
               class="absolute w-full flex justify-end pr-2 md:pr-4 text-xs font-medium text-surface-500"
               :style="{ top: `${time.offset}px`, transform: 'translateY(-50%)' }">
            {{ time.label }}
          </div>
        </div>
      </div>

      <!-- Staff Columns -->
      <div class="flex-1 flex min-w-max">
        <div v-for="staff in staffMembers" :key="staff.id" class="w-64 md:flex-1 border-r border-surface-800/50 relative">
          <!-- Column Header -->
          <div class="h-14 sticky top-0 bg-surface-900/90 backdrop-blur-md border-b border-surface-800 z-20 flex items-center justify-center gap-3 px-2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" :style="{ backgroundColor: staff.color }">
              {{ staff.initials }}
            </div>
            <div class="min-w-0 text-left hidden md:block">
              <p class="text-sm font-semibold text-surface-50 truncate">{{ staff.name }}</p>
              <p class="text-xs text-surface-400 truncate">{{ staff.title }}</p>
            </div>
          </div>

          <!-- Grid Background & Slots -->
          <div class="relative" :style="{ height: `${totalMinutes * pixelsPerMinute}px` }" @click.self="handleEmptySlotClick($event, staff.id)">
            <!-- Grid Lines -->
            <div v-for="i in (totalMinutes / 30)" :key="i" class="absolute w-full border-t border-surface-800/30 pointer-events-none" :style="{ top: `${(i - 1) * 30 * pixelsPerMinute}px` }"></div>

            <!-- Current Time Indicator -->
            <div v-if="isToday" class="absolute w-full border-t-2 border-red-500 z-10 pointer-events-none" :style="{ top: `${currentTimeOffset}px` }">
              <div class="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
            </div>

            <!-- Appointments -->
            <div v-for="apt in getStaffAppointments(staff.id)" :key="apt.id"
                 class="absolute left-1 right-1 rounded-md p-2 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer group"
                 :style="{ 
                   top: `${getOffsetFromTime(apt.startTime)}px`, 
                   height: `${getDurationInMinutes(apt.startTime, apt.endTime) * pixelsPerMinute}px`,
                   backgroundColor: `${staff.color}20`,
                   borderLeft: `4px solid ${staff.color}`
                 }"
                 @click="editAppointment(apt)">
              <div class="flex items-start justify-between gap-1 h-full flex-col">
                <div class="w-full">
                  <p class="text-xs md:text-sm font-semibold text-surface-50 truncate group-hover:text-white">{{ apt.serviceName }}</p>
                  <p class="text-xs text-surface-300 truncate">{{ apt.clientName }}</p>
                </div>
                <div class="text-[10px] md:text-xs text-surface-400 font-medium">
                  {{ formatTimeOnly(apt.startTime) }} - {{ formatTimeOnly(apt.endTime) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Appointment Modal (Slide-over) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-surface-950/80 backdrop-blur-sm animate-fade-in" @click="closeModal"></div>
      
      <div class="relative w-full max-w-md bg-surface-900 h-full border-l border-surface-800 shadow-2xl flex flex-col animate-slide-up md:animate-fade-in">
        <div class="h-16 flex items-center justify-between px-6 border-b border-surface-800 shrink-0">
          <h2 class="text-lg font-semibold text-surface-50">New Appointment</h2>
          <button @click="closeModal" class="text-surface-400 hover:text-surface-100 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6 space-y-5">
          <div class="space-y-1">
            <label class="input-label">Client</label>
            <input type="text" v-model="form.client" class="input w-full" placeholder="Search client..." />
          </div>

          <div class="space-y-1">
            <label class="input-label">Service</label>
            <select v-model="form.serviceId" class="input w-full bg-surface-900">
              <option value="">Select a service</option>
              <option value="1">Women's Haircut (60m)</option>
              <option value="2">Color & Highlights (120m)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="input-label">Staff</label>
            <select v-model="form.staffId" class="input w-full bg-surface-900">
              <option v-for="s in staffMembers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="input-label">Date</label>
              <input type="date" v-model="form.date" class="input w-full" />
            </div>
            <div class="space-y-1">
              <label class="input-label">Time</label>
              <input type="time" v-model="form.time" class="input w-full" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="input-label">Notes</label>
            <textarea v-model="form.notes" class="input w-full h-24 py-2 resize-none" placeholder="Optional notes..."></textarea>
          </div>
        </div>

        <div class="p-6 border-t border-surface-800 shrink-0 flex gap-3">
          <button @click="closeModal" class="btn-secondary flex-1 min-h-[44px]">Cancel</button>
          <button @click="saveAppointment" class="btn-primary flex-1 min-h-[44px]">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const startHour = 7
const endHour = 21
const totalHours = endHour - startHour
const totalMinutes = totalHours * 60
const pixelsPerMinute = 2 // 2px per minute = 120px per hour

const currentDate = ref(new Date())
const currentTime = ref(new Date())
let timeInterval: any = null

const isToday = computed(() => {
  const today = new Date()
  return currentDate.value.getDate() === today.getDate() &&
         currentDate.value.getMonth() === today.getMonth() &&
         currentDate.value.getFullYear() === today.getFullYear()
})

const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
})

const currentTimeOffset = computed(() => {
  const h = currentTime.value.getHours()
  const m = currentTime.value.getMinutes()
  if (h < startHour || h >= endHour) return -100 // off screen
  const minsSinceStart = ((h - startHour) * 60) + m
  return minsSinceStart * pixelsPerMinute
})

const timeLabels = computed(() => {
  const labels = []
  for (let i = 0; i <= totalHours; i++) {
    const hour = startHour + i
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
    labels.push({
      label: `${displayHour} ${period}`,
      offset: (i * 60) * pixelsPerMinute
    })
  }
  return labels
})

const nextDay = () => { currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + 1)) }
const prevDay = () => { currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() - 1)) }
const goToToday = () => { currentDate.value = new Date() }

// Mock Data
const staffMembers = ref([
  { id: '1', name: 'Jessica Taylor', title: 'Senior Stylist', initials: 'JT', color: '#8b5cf6' },
  { id: '2', name: 'David Kim', title: 'Barber', initials: 'DK', color: '#3b82f6' },
  { id: '3', name: 'Emma Watson', title: 'Colorist', initials: 'EW', color: '#f59e0b' },
])

const allAppointments = ref([
  { id: '1', staffId: '1', clientName: 'Sarah Jenkins', serviceName: 'Women\'s Haircut', startTime: setTime(9, 0), endTime: setTime(10, 0) },
  { id: '2', staffId: '1', clientName: 'Emily Chen', serviceName: 'Balayage', startTime: setTime(10, 30), endTime: setTime(13, 0) },
  { id: '3', staffId: '2', clientName: 'Mike Ross', serviceName: 'Men\'s Fade', startTime: setTime(9, 30), endTime: setTime(10, 15) },
  { id: '4', staffId: '3', clientName: 'Anna Smith', serviceName: 'Full Highlights', startTime: setTime(14, 0), endTime: setTime(16, 30) },
])

function setTime(h: number, m: number) {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

const getStaffAppointments = (staffId: string) => {
  // In a real app, filter by currentDate too
  return allAppointments.value.filter(a => a.staffId === staffId)
}

const getOffsetFromTime = (isoTime: string) => {
  const d = new Date(isoTime)
  const h = d.getHours()
  const m = d.getMinutes()
  return (((h - startHour) * 60) + m) * pixelsPerMinute
}

const getDurationInMinutes = (start: string, end: string) => {
  const s = new Date(start)
  const e = new Date(end)
  return (e.getTime() - s.getTime()) / 60000
}

const formatTimeOnly = (isoTime: string) => {
  return new Date(isoTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

// Modal State
const showModal = ref(false)
const form = ref({ client: '', serviceId: '', staffId: '', date: '', time: '', notes: '' })

const handleEmptySlotClick = (event: MouseEvent, staffId: string) => {
  const offsetY = event.offsetY
  const totalMins = Math.floor(offsetY / pixelsPerMinute)
  const clickedHour = startHour + Math.floor(totalMins / 60)
  const clickedMin = (totalMins % 60) < 30 ? 0 : 30 // Snap to 30 min grid
  
  form.value = {
    client: '',
    serviceId: '',
    staffId: staffId,
    date: currentDate.value.toISOString().split('T')[0],
    time: `${clickedHour.toString().padStart(2, '0')}:${clickedMin.toString().padStart(2, '0')}`,
    notes: ''
  }
  showModal.value = true
}

const editAppointment = (apt: any) => {
  showModal.value = true
  // prepopulate form logic...
}

const closeModal = () => { showModal.value = false }
const saveAppointment = () => {
  // save logic
  closeModal()
}

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>
