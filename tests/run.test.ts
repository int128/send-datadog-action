import { test, expect, vi } from 'vitest'
import { run } from '../src/run.js'
import { v1 } from '@datadog/datadog-api-client'

const submitMetrics = vi.spyOn(v1.MetricsApi.prototype, 'submitMetrics')
const createEvent = vi.spyOn(v1.EventsApi.prototype, 'createEvent')

test('run successfully', async () => {
  submitMetrics.mockResolvedValue({ status: 'ok' })
  createEvent.mockResolvedValue({ status: 'ok' })
  await expect(
    run({
      datadogApiKey: 'DATADOG_API_KEY',
      metricsCsvPath: 'tests/fixtures/metrics.csv',
      metricsCsvFormat: 'simple',
      metricName: 'my.metric',
      metricType: 'gauge',
      metricValue: 100,
      metricTags: ['key:value'],
      eventTitle: 'my-event',
      eventText: 'My event',
      eventAlertType: 'info',
      eventTags: ['key:value'],
    }),
  ).resolves.toBeUndefined()
})
