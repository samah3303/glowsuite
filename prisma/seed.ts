import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing
  await prisma.subscription.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.appointmentItem.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.staffService.deleteMany()
  await prisma.service.deleteMany()
  await prisma.category.deleteMany()
  await prisma.staffShift.deleteMany()
  await prisma.staffTimeOff.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.user.deleteMany()
  await prisma.location.deleteMany()
  await prisma.tenant.deleteMany()

  // 0. Plans
  const planFree = await prisma.plan.create({
    data: { name: 'free', displayName: 'Free', price: 0, maxLocations: 1, maxStaff: 3, maxServices: 10, sortOrder: 1 }
  })
  const planPro = await prisma.plan.create({
    data: { name: 'pro', displayName: 'Pro', price: 49, maxLocations: 3, maxStaff: 15, maxServices: 50, sortOrder: 2 }
  })
  const planEnterprise = await prisma.plan.create({
    data: { name: 'enterprise', displayName: 'Enterprise', price: 149, maxLocations: 999, maxStaff: 999, maxServices: 999, sortOrder: 3 }
  })

  // 0.5 Super Admin User
  const adminPasswordHash = await bcrypt.hash('admin1234', 10)
  await prisma.user.create({
    data: {
      email: 'admin@glowsuite.com',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      firstName: 'Super',
      lastName: 'Admin'
    }
  })

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'GlowSuite Demo Salon',
      slug: 'glowsuite-demo',
      timezone: 'America/New_York',
      status: 'ACTIVE'
    },
  })

  await prisma.subscription.create({
    data: { tenantId: tenant.id, planId: planPro.id, status: 'ACTIVE' }
  })

  // 2. Locations
  const location1 = await prisma.location.create({
    data: {
      tenantId: tenant.id,
      name: 'Downtown Studio',
      address: '123 Main St',
      city: 'New York',
    },
  })

  const location2 = await prisma.location.create({
    data: {
      tenantId: tenant.id,
      name: 'Uptown Lounge',
      address: '456 Park Ave',
      city: 'New York',
    },
  })

  // 3. User (Owner)
  const passwordHash = await bcrypt.hash('demo1234', 10)
  const owner = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'demo@glowsuite.com',
      passwordHash,
      role: 'OWNER',
      firstName: 'Alex',
      lastName: 'Rivera',
    },
  })

  // 4. Staff
  const staffData = [
    { name: 'Sarah Chen', title: 'Senior Stylist', color: '#8B5CF6', locId: location1.id },
    { name: 'Marcus Johnson', title: 'Master Barber', color: '#3B82F6', locId: location1.id },
    { name: 'Elena Vasquez', title: 'Colorist', color: '#EC4899', locId: location2.id },
    { name: 'James Park', title: 'Nail Technician', color: '#10B981', locId: location2.id },
  ]

  const staffMembers = []
  for (const s of staffData) {
    const staff = await prisma.staff.create({
      data: {
        tenantId: tenant.id,
        locationId: s.locId,
        displayName: s.name,
        title: s.title,
        color: s.color,
      },
    })
    staffMembers.push(staff)

    // Shifts
    for (let day = 1; day <= 6; day++) {
      await prisma.staffShift.create({
        data: {
          staffId: staff.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isWorking: true,
        },
      })
    }
  }

  // 5. Categories & Services
  const catHaircuts = await prisma.category.create({ data: { tenantId: tenant.id, name: 'Haircuts', sortOrder: 1 } })
  const catColoring = await prisma.category.create({ data: { tenantId: tenant.id, name: 'Coloring', sortOrder: 2 } })
  const catNails = await prisma.category.create({ data: { tenantId: tenant.id, name: 'Nail Care', sortOrder: 3 } })
  const catSkincare = await prisma.category.create({ data: { tenantId: tenant.id, name: 'Skincare', sortOrder: 4 } })

  const serviceData = [
    { catId: catHaircuts.id, name: "Women's Haircut", price: 65, durationMinutes: 45 },
    { catId: catHaircuts.id, name: "Men's Haircut", price: 35, durationMinutes: 30 },
    { catId: catHaircuts.id, name: "Kids' Haircut", price: 25, durationMinutes: 20 },
    { catId: catColoring.id, name: "Full Highlights", price: 150, durationMinutes: 120 },
    { catId: catColoring.id, name: "Balayage", price: 180, durationMinutes: 150 },
    { catId: catColoring.id, name: "Root Touch-Up", price: 85, durationMinutes: 60 },
    { catId: catNails.id, name: "Manicure", price: 40, durationMinutes: 45 },
    { catId: catNails.id, name: "Pedicure", price: 55, durationMinutes: 60 },
    { catId: catSkincare.id, name: "Classic Facial", price: 90, durationMinutes: 60 },
  ]

  const services = []
  for (const s of serviceData) {
    const service = await prisma.service.create({
      data: {
        tenantId: tenant.id,
        categoryId: s.catId,
        name: s.name,
        price: s.price,
        durationMinutes: s.durationMinutes,
      },
    })
    services.push(service)
  }

  // Link Staff to Services (just all to all for demo)
  for (const staff of staffMembers) {
    for (const s of services) {
      await prisma.staffService.create({
        data: {
          staffId: staff.id,
          serviceId: s.id,
        },
      })
    }
  }

  // 6. Customers
  const customers = []
  for (let i = 1; i <= 10; i++) {
    const cust = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `555-010${i}`,
      },
    })
    customers.push(cust)
  }

  // 7. Appointments
  const now = new Date()
  const currentDay = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
  monday.setHours(0, 0, 0, 0)

  for (let i = 0; i < 15; i++) {
    const staff = staffMembers[i % staffMembers.length]
    const customer = customers[i % customers.length]
    const service = services[i % services.length]
    
    const aptDate = new Date(monday)
    aptDate.setDate(monday.getDate() + (i % 6)) // Mon-Sat
    aptDate.setHours(9 + (i % 8), 0, 0, 0)
    
    const endTime = new Date(aptDate)
    endTime.setMinutes(endTime.getMinutes() + service.durationMinutes)

    let status = 'SCHEDULED'
    if (aptDate < now) status = 'COMPLETED'
    else if (i % 5 === 0) status = 'CANCELLED'

    const appointment = await prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        locationId: staff.locationId,
        customerId: customer.id,
        staffId: staff.id,
        startTime: aptDate,
        endTime: endTime,
        status: status,
        totalAmount: service.price,
        items: {
          create: [
            {
              serviceId: service.id,
              serviceName: service.name,
              price: service.price,
              duration: service.durationMinutes,
            },
          ],
        },
      },
    })

    if (status === 'COMPLETED') {
      await prisma.payment.create({
        data: {
          tenantId: tenant.id,
          appointmentId: appointment.id,
          amount: service.price,
          status: 'COMPLETED',
        },
      })
    }
  }

  // Additional Demo Tenants
  const tenant2 = await prisma.tenant.create({
    data: { name: "Bella's Beauty Bar", slug: "bellas-beauty-bar", status: "ACTIVE", timezone: "America/Los_Angeles" }
  })
  await prisma.subscription.create({ data: { tenantId: tenant2.id, planId: planFree.id, status: 'ACTIVE' } })
  await prisma.location.create({ data: { tenantId: tenant2.id, name: 'Main' } })
  await prisma.user.create({ data: { tenantId: tenant2.id, email: 'bella@example.com', passwordHash, role: 'OWNER', firstName: 'Bella', lastName: 'Owner' } })

  const tenant3 = await prisma.tenant.create({
    data: { name: "Elite Cuts Studio", slug: "elite-cuts-studio", status: "SUSPENDED", timezone: "America/Chicago" }
  })
  await prisma.subscription.create({ data: { tenantId: tenant3.id, planId: planEnterprise.id, status: 'ACTIVE' } })
  await prisma.location.create({ data: { tenantId: tenant3.id, name: 'Main' } })
  await prisma.user.create({ data: { tenantId: tenant3.id, email: 'elite@example.com', passwordHash, role: 'OWNER', firstName: 'Elite', lastName: 'Owner' } })

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
