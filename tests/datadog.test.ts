import { describe, expect, it } from 'vitest'
import { splitArrayToChunks } from '../src/datadog.js'

describe('splitArrayToChunks', () => {
  it('splits an array into chunks of a given size', () => {
    const array = [1, 2, 3, 4, 5, 6]
    const chunkSize = 3
    const result = splitArrayToChunks(array, chunkSize)
    expect(result).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ])
  })

  it('splits an array into chunks of a given size with remainder', () => {
    const array = [1, 2, 3, 4, 5]
    const chunkSize = 2
    const result = splitArrayToChunks(array, chunkSize)
    expect(result).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns an empty array when the input array is empty', () => {
    const array: number[] = []
    const chunkSize = 2
    const result = splitArrayToChunks(array, chunkSize)
    expect(result).toEqual([])
  })

  it('returns the original array when the chunk size is greater than the array length', () => {
    const array = [1, 2, 3]
    const chunkSize = 5
    const result = splitArrayToChunks(array, chunkSize)
    expect(result).toEqual([[1, 2, 3]])
  })
})
