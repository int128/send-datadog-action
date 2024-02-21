import { parseMetricsCsv } from '../src/csv'

describe('parseMetricsCsv', () => {
  it('parses the metrics csv', async () => {
    const csvPath = 'tests/fixtures/metrics.csv'
    const unixTime = 1614556800
    const series = await parseMetricsCsv(csvPath, unixTime)
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
