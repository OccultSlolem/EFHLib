import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../src/hooks'

// Mock localStorage
const mockStorage: Record<string, string> = {}
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = value },
    removeItem: (key: string) => { delete mockStorage[key] },
    clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]) }
  },
  writable: true
})

describe('useLocalStorage', () => {
  it('returns the initial value if nothing is in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    expect(result.current[0]).toBe('initial');
  })

  it('updates stored value and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('anotherKey', 'default'));
    act(() => {
      result.current[1]('newValue');
    })
    expect(result.current[0]).toBe('newValue');
    expect(mockStorage['anotherKey']).toBe(JSON.stringify('newValue'));
  })
});
