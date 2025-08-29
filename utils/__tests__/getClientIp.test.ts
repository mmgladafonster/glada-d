import { describe, it, expect } from 'vitest'
import { getClientIp } from '../getClientIp'

describe('getClientIp', () => {
  it('should extract first IP from comma-separated x-forwarded-for header', async () => {
    const headers = new Headers({
      'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1'
    })
    
    const ip = await getClientIp(headers)
    expect(ip).toBe('192.168.1.1')
  })

  it('should handle x-forwarded-for with spaces and empty values', async () => {
    const headers = new Headers({
      'x-forwarded-for': ' , 192.168.1.1 ,  , 10.0.0.1'
    })
    
    const ip = await getClientIp(headers)
    expect(ip).toBe('192.168.1.1')
  })

  it('should fallback to x-real-ip when x-forwarded-for is empty', async () => {
    const headers = new Headers({
      'x-forwarded-for': ' , , ',
      'x-real-ip': '192.168.1.100'
    })
    
    const ip = await getClientIp(headers)
    expect(ip).toBe('192.168.1.100')
  })

  it('should fallback to x-real-ip when x-forwarded-for is missing', async () => {
    const headers = new Headers({
      'x-real-ip': '10.0.0.50'
    })
    
    const ip = await getClientIp(headers)
    expect(ip).toBe('10.0.0.50')
  })

  it('should return unknown when both headers are missing', async () => {
    const headers = new Headers({})
    
    const ip = await getClientIp(headers)
    expect(ip).toBe('unknown')
  })

  it('should return unknown when both headers are empty', async () => {
    const headers = new Headers({
      'x-forwarded-for': '',
      'x-real-ip': '  '
    })
    
    const ip = await getClientIp(headers)
    expect(ip).toBe('unknown')
  })
})