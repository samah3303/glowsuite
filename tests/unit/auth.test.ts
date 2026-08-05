import { describe, it, expect, beforeAll } from 'vitest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const TEST_SECRET = 'glowsuite-test-secret-key-2026'

function generateToken(payload: { userId: string; tenantId: string; role: string }): string {
  return jwt.sign(payload, TEST_SECRET, { expiresIn: '7d' })
}

function verifyToken(token: string): any {
  try {
    return jwt.verify(token, TEST_SECRET)
  } catch (e) {
    return null
  }
}

describe('Authentication Unit Tests', () => {
  it('should hash and compare passwords correctly', async () => {
    const rawPassword = 'supersecretpass'
    const hash = await bcrypt.hash(rawPassword, 10)

    expect(hash).not.toBe(rawPassword)
    expect(await bcrypt.compare(rawPassword, hash)).toBe(true)
    expect(await bcrypt.compare('wrongpass', hash)).toBe(false)
  })

  it('should generate and verify JWT tokens cleanly', () => {
    const payload = { userId: 'user-123', tenantId: 'tenant-456', role: 'OWNER' }
    const token = generateToken(payload)

    expect(typeof token).toBe('string')

    const decoded = verifyToken(token)
    expect(decoded).not.toBeNull()
    expect(decoded.userId).toBe('user-123')
    expect(decoded.tenantId).toBe('tenant-456')
    expect(decoded.role).toBe('OWNER')
  })

  it('should return null for invalid or tampered tokens', () => {
    const invalidToken = 'invalid.jwt.token'
    expect(verifyToken(invalidToken)).toBeNull()
  })
})
