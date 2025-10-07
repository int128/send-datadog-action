import { describe, it, expect } from 'vitest'
import { parseMetricsCsvSimple, parseMetricsCsvUseHeaderTags } from '../src/csv.js'

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
