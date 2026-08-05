<template>
  <div class="min-h-screen bg-surface-950 text-surface-100 selection:bg-brand-500/30 flex flex-col font-sans">
    <!-- Header -->
    <header class="h-16 glass-card-sm !rounded-none border-b border-surface-800 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-neon-sm">
          <Icon name="lucide:scissors" class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-base md:text-lg font-bold text-white leading-tight">{{ salon?.name || 'Loading Salon...' }}</h1>
          <p class="text-xs text-surface-400">Online Appointment Booking</p>
        </div>
      </div>

      <div v-if="step < 6" class="text-xs font-semibold text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-full border border-brand-500/20">
        Step {{ step }} of 5
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col">
      <!-- Loading State -->
      <div v-if="pending" class="flex-1 flex flex-col items-center justify-center gap-4 py-16">
        <div class="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
        <p class="text-sm text-surface-400">Loading salon menu...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16 glass-card">
        <div class="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <Icon name="lucide:alert-triangle" class="w-7 h-7" />
        </div>
        <h2 class="text-xl font-bold text-white">Salon Not Found</h2>
        <p class="text-surface-400 max-w-md text-sm">The salon link you followed doesn't exist or is currently unavailable.</p>
        <NuxtLink to="/login" class="btn-primary mt-2">Go to GlowSuite Home</NuxtLink>
      </div>

      <!-- Booking Wizard Flow -->
      <div v-else-if="salon" class="flex-1 flex flex-col">
        <!-- Progress Bar -->
        <div v-if="step < 6" class="w-full bg-surface-900 rounded-full h-1.5 mb-6 overflow-hidden">
          <div class="bg-gradient-to-r from-brand-500 to-fuchsia-500 h-full transition-all duration-300" :style="{ width: `${(step / 5) * 100}%` }"></div>
        </div>

        <!-- STEP 1: Select Location -->
        <div v-if="step === 1" class="animate-fade-in space-y-6">
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-white">Choose a Location</h2>
            <p class="text-sm text-surface-400">Select the salon branch you'd like to visit.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="loc in salon.locations" :key="loc.id"
                 @click="selectLocation(loc)"
                 class="glass-card p-5 cursor-pointer hover:border-brand-500/50 transition-all duration-200 group flex flex-col justify-between gap-4"
                 :class="{ 'border-brand-500 bg-brand-500/10': selectedLocation?.id === loc.id }">
              <div class="space-y-1">
                <h3 class="font-semibold text-lg text-white group-hover:text-brand-300 transition-colors">{{ loc.name }}</h3>
                <p v-if="loc.address" class="text-sm text-surface-300 flex items-center gap-1.5">
                  <Icon name="lucide:map-pin" class="w-4 h-4 text-brand-400 shrink-0" />
                  {{ loc.address }}, {{ loc.city }}
                </p>
                <p v-if="loc.phone" class="text-xs text-surface-400 flex items-center gap-1.5">
                  <Icon name="lucide:phone" class="w-3.5 h-3.5 text-surface-500 shrink-0" />
                  {{ loc.phone }}
                </p>
              </div>
              <div class="flex justify-end">
                <span class="btn-sm btn-secondary group-hover:bg-brand-600 group-hover:text-white transition-all">Select Branch</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Select Service -->
        <div v-else-if="step === 2" class="animate-fade-in space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-white">Select a Service</h2>
              <p class="text-sm text-surface-400">Pick from our menu of services below.</p>
            </div>
            <button @click="step = 1" class="btn-ghost btn-sm">Change Location</button>
          </div>

          <div class="space-y-6">
            <div v-for="cat in salon.categories" :key="cat.id" class="space-y-3">
              <h3 class="text-sm font-semibold text-surface-400 uppercase tracking-wider">{{ cat.name }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="svc in cat.services" :key="svc.id"
                     @click="selectService(svc)"
                     class="glass-card-sm p-4 cursor-pointer hover:border-brand-500/50 transition-all flex items-center justify-between gap-4 group"
                     :class="{ 'border-brand-500 bg-brand-500/10': selectedService?.id === svc.id }">
                  <div class="space-y-1 min-w-0">
                    <h4 class="font-semibold text-white group-hover:text-brand-300 transition-colors truncate">{{ svc.name }}</h4>
                    <p v-if="svc.description" class="text-xs text-surface-400 line-clamp-1">{{ svc.description }}</p>
                    <span class="inline-flex items-center gap-1 text-xs text-surface-400">
                      <Icon name="lucide:clock" class="w-3.5 h-3.5 text-brand-400" />
                      {{ svc.durationMinutes }} min
                    </span>
                  </div>
                  <div class="text-right shrink-0">
                    <span class="text-lg font-bold text-brand-300">${{ svc.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Select Staff Member -->
        <div v-else-if="step === 3" class="animate-fade-in space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-white">Choose a Specialist</h2>
              <p class="text-sm text-surface-400">Select your preferred team member or pick anyone available.</p>
            </div>
            <button @click="step = 2" class="btn-ghost btn-sm">Change Service</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <!-- Any Available Professional -->
            <div @click="selectStaff(null)"
                 class="glass-card p-5 cursor-pointer hover:border-brand-500/50 transition-all text-center flex flex-col items-center justify-center gap-3 group"
                 :class="{ 'border-brand-500 bg-brand-500/10': selectedStaff === null }">
              <div class="w-12 h-12 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                <Icon name="lucide:sparkles" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="font-semibold text-white">Any Professional</h4>
                <p class="text-xs text-surface-400">First available specialist</p>
              </div>
            </div>

            <!-- Specific Staff -->
            <div v-for="st in availableStaff" :key="st.id"
                 @click="selectStaff(st)"
                 class="glass-card p-5 cursor-pointer hover:border-brand-500/50 transition-all text-center flex flex-col items-center justify-center gap-3 group"
                 :class="{ 'border-brand-500 bg-brand-500/10': selectedStaff?.id === st.id }">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-110 transition-transform"
                   :style="{ backgroundColor: st.color }">
                {{ st.displayName.charAt(0) }}
              </div>
              <div>
                <h4 class="font-semibold text-white truncate">{{ st.displayName }}</h4>
                <p class="text-xs text-surface-400 truncate">{{ st.title || 'Stylist' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: Date & Time Picker -->
        <div v-else-if="step === 4" class="animate-fade-in space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-white">Select Date & Time</h2>
              <p class="text-sm text-surface-400">Choose a convenient time for your appointment.</p>
            </div>
            <button @click="step = 3" class="btn-ghost btn-sm">Change Specialist</button>
          </div>

          <!-- Date Picker Bar -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button v-for="day in availableDays" :key="day.dateStr"
                    @click="selectedDateStr = day.dateStr"
                    class="flex flex-col items-center p-3 rounded-2xl min-w-[76px] transition-all cursor-pointer border"
                    :class="selectedDateStr === day.dateStr ? 'bg-brand-600 border-brand-500 text-white shadow-neon-sm' : 'bg-surface-800/50 border-surface-700/50 text-surface-300 hover:bg-surface-800'">
              <span class="text-xs uppercase font-medium">{{ day.dayName }}</span>
              <span class="text-lg font-bold">{{ day.dayNum }}</span>
              <span class="text-[10px] text-surface-400">{{ day.monthName }}</span>
            </button>
          </div>

          <!-- Available Time Slots -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-surface-300 flex items-center gap-1.5">
              <Icon name="lucide:clock" class="w-4 h-4 text-brand-400" />
              Available Slots for {{ formattedSelectedDate }}
            </h3>

            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              <button v-for="slot in timeSlots" :key="slot"
                      @click="selectTimeSlot(slot)"
                      class="py-2.5 px-3 rounded-xl text-sm font-semibold transition-all border cursor-pointer min-h-[44px] flex items-center justify-center"
                      :class="selectedTimeSlot === slot ? 'bg-brand-500 border-brand-400 text-white shadow-neon-sm' : 'bg-surface-800/60 border-surface-700/50 text-surface-200 hover:bg-surface-700'">
                {{ slot }}
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 5: Customer Contact Info -->
        <div v-else-if="step === 5" class="animate-fade-in space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl md:text-2xl font-bold text-white">Your Contact Details</h2>
              <p class="text-sm text-surface-400">Where should we send your booking confirmation?</p>
            </div>
            <button @click="step = 4" class="btn-ghost btn-sm">Change Time</button>
          </div>

          <!-- Summary Box -->
          <div class="glass-card p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p class="font-semibold text-white">{{ selectedService?.name }} (${{ selectedService?.price }})</p>
              <p class="text-xs text-surface-400">
                with {{ selectedStaff ? selectedStaff.displayName : 'Available Specialist' }} at {{ selectedLocation?.name }}
              </p>
            </div>
            <div class="text-right">
              <p class="font-bold text-brand-300">{{ formattedSelectedDate }}</p>
              <p class="text-xs text-surface-300 font-medium">{{ selectedTimeSlot }} ({{ selectedService?.durationMinutes }} min)</p>
            </div>
          </div>

          <!-- Contact Form -->
          <form @submit.prevent="submitBooking" class="space-y-4">
            <div>
              <label class="input-label">Full Name *</label>
              <input v-model="customerForm.name" required type="text" placeholder="John Doe" class="input" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="input-label">Email Address *</label>
                <input v-model="customerForm.email" required type="email" placeholder="john@example.com" class="input" />
              </div>
              <div>
                <label class="input-label">Phone Number *</label>
                <input v-model="customerForm.phone" required type="tel" placeholder="(555) 000-0000" class="input" />
              </div>
            </div>

            <div>
              <label class="input-label">Special Requests / Notes (Optional)</label>
              <textarea v-model="customerForm.notes" rows="3" placeholder="Any preferences, allergies, or questions..." class="input !min-h-[90px] py-3"></textarea>
            </div>

            <div v-if="bookingError" class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
              {{ bookingError }}
            </div>

            <div class="pt-2 flex justify-end">
              <button type="submit" :disabled="submitting" class="btn-primary btn-lg w-full md:w-auto min-w-[200px]">
                <Icon v-if="submitting" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                <span v-else>Confirm Booking</span>
              </button>
            </div>
          </form>
        </div>

        <!-- STEP 6: Confirmation Screen -->
        <div v-else-if="step === 6" class="animate-scale-in text-center py-8 space-y-6 max-w-lg mx-auto">
          <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-neon">
            <Icon name="lucide:check-circle-2" class="w-10 h-10" />
          </div>

          <div class="space-y-2">
            <h2 class="text-2xl md:text-3xl font-bold text-white">Booking Confirmed!</h2>
            <p class="text-surface-400 text-sm">Thank you, <strong class="text-white">{{ confirmation?.customerName }}</strong>! Your appointment has been successfully scheduled.</p>
          </div>

          <div class="glass-card p-6 text-left space-y-3 text-sm border-emerald-500/30">
            <div class="flex justify-between border-b border-surface-700/50 pb-2">
              <span class="text-surface-400">Salon</span>
              <span class="font-semibold text-white">{{ confirmation?.salonName }}</span>
            </div>
            <div class="flex justify-between border-b border-surface-700/50 pb-2">
              <span class="text-surface-400">Branch</span>
              <span class="font-medium text-white">{{ confirmation?.locationName }}</span>
            </div>
            <div class="flex justify-between border-b border-surface-700/50 pb-2">
              <span class="text-surface-400">Service</span>
              <span class="font-semibold text-brand-300">{{ confirmation?.serviceName }}</span>
            </div>
            <div class="flex justify-between border-b border-surface-700/50 pb-2">
              <span class="text-surface-400">Specialist</span>
              <span class="font-medium text-white">{{ confirmation?.staffName }}</span>
            </div>
            <div class="flex justify-between border-b border-surface-700/50 pb-2">
              <span class="text-surface-400">Date & Time</span>
              <span class="font-semibold text-white">{{ formatDate(confirmation?.startTime) }}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-surface-400">Total Price</span>
              <span class="text-lg font-bold text-emerald-400">${{ confirmation?.price }}</span>
            </div>
          </div>

          <p class="text-xs text-surface-400">A confirmation email will be sent to {{ customerForm.email }}.</p>

          <button @click="resetForm" class="btn-secondary">Book Another Appointment</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: false })

const route = useRoute()
const slug = route.params.slug as string

// Fetch salon data
const { data: salon, pending, error } = await useFetch<any>(`/api/public/book/${slug}`)

// Wizard state
const step = ref(1)
const selectedLocation = ref<any>(null)
const selectedService = ref<any>(null)
const selectedStaff = ref<any>(null)
const selectedDateStr = ref<string>('')
const selectedTimeSlot = ref<string>('')
const submitting = ref(false)
const bookingError = ref('')
const confirmation = ref<any>(null)

const customerForm = ref({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

// Filter staff available for selected location and service
const availableStaff = computed(() => {
  if (!salon.value || !selectedLocation.value) return []
  return salon.value.staff.filter((st: any) => {
    const locMatch = st.locationId === selectedLocation.value.id
    if (!selectedService.value) return locMatch
    const hasService = st.services.some((s: any) => s.serviceId === selectedService.value.id)
    return locMatch && hasService
  })
})

// Generate next 14 days
const availableDays = computed(() => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: d
    })
  }
  return days
})

// Pre-select first date
onMounted(() => {
  if (availableDays.value.length > 0) {
    selectedDateStr.value = availableDays.value[0].dateStr
  }
  if (salon.value?.locations?.length === 1) {
    selectedLocation.value = salon.value.locations[0]
  }
})

// Generate time slots (9 AM to 6 PM)
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM'
]

const formattedSelectedDate = computed(() => {
  if (!selectedDateStr.value) return ''
  const parts = selectedDateStr.value.split('-')
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
})

// Selection Actions
function selectLocation(loc: any) {
  selectedLocation.value = loc
  step.value = 2
}

function selectService(svc: any) {
  selectedService.value = svc
  step.value = 3
}

function selectStaff(st: any) {
  selectedStaff.value = st
  step.value = 4
}

function selectTimeSlot(slot: string) {
  selectedTimeSlot.value = slot
  step.value = 5
}

// Convert "09:30 AM" + "2026-08-06" to ISO string
function parseSlotToISO(dateStr: string, slotStr: string): string {
  const [time, period] = slotStr.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (period === 'PM' && hours < 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d, hours, minutes)
  return dt.toISOString()
}

// Submit Booking
async function submitBooking() {
  submitting.value = true
  bookingError.value = ''

  try {
    const chosenStaff = selectedStaff.value || (availableStaff.value[0] || salon.value.staff[0])
    const startTimeISO = parseSlotToISO(selectedDateStr.value, selectedTimeSlot.value)

    const res: any = await $fetch(`/api/public/book/${slug}`, {
      method: 'POST',
      body: {
        locationId: selectedLocation.value.id,
        serviceId: selectedService.value.id,
        staffId: chosenStaff.id,
        startTime: startTimeISO,
        customerName: customerForm.value.name,
        customerEmail: customerForm.value.email,
        customerPhone: customerForm.value.phone,
        notes: customerForm.value.notes
      }
    })

    confirmation.value = res.appointment
    step.value = 6
  } catch (err: any) {
    bookingError.value = err?.data?.statusMessage || err?.message || 'Failed to submit booking. Please try again.'
  } finally {
    submitting.value = false
  }
}

function formatDate(isoStr: string) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function resetForm() {
  step.value = 1
  selectedService.value = null
  selectedStaff.value = null
  selectedTimeSlot.value = ''
  confirmation.value = null
}
</script>
