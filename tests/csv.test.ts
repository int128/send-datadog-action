import { describe, it, expect } from 'vitest'
import { parseMetricsCsvSimple, parseMetricsCsvUseHeaderTags, splitArrayToChunks } from '../src/csv.js'

describe('parseMetricsCsvSimple', () => {
  it('parses the metrics csv', async () => {
    const csvPath = 'tests/fixtures/metrics.csv'
    const unixTime = 1614556800
    const series = await parseMetricsCsvSimple(csvPath, unixTime)
    expect(series).toEqual([
      {
        host: 'github.com',
        metric: 'example.metric',
        type: 'gauge',
        points: [[unixTime, 42]],
        tags: ['service:backend', 'env:production'],
      },
      {
        host: 'github.com',
        metric: 'example.metric',
        type: 'gauge',
        points: [[unixTime, 3]],
        tags: ['service:frontend', 'env:development'],
      },
    ])
  })
})

describe('parseMetricsCsvUseHeaderTags', () => {
  it('parses the metrics csv with header tags', async () => {
    const csvPath = 'tests/fixtures/metrics_with_header_tags.csv'
    const unixTime = 1614556800
    const series = await parseMetricsCsvUseHeaderTags(csvPath, unixTime)
    expect(series).toEqual([
      {
        host: 'github.com',
        metric: 'example.metric',
        type: 'count',
        points: [[unixTime, 5]],
        tags: ['service:backend', 'env:production'],
      },
      {
        host: 'github.com',
        metric: 'example.metric',
        type: 'count',
        points: [[unixTime, 7]],
        tags: ['service:frontend', 'env:development'],
      },
    ])
  })
})

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
