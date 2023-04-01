import { run } from '../src/run'
import { v1 } from '@datadog/datadog-api-client'

jest.mock('@datadog/datadog-api-client')
const metricsApiMock = {
  submitMetrics: jest.fn<Promise<v1.IntakePayloadAccepted>, [v1.MetricsApiSubmitMetricsRequest]>(),
}
const metricsApiConstructor = v1.MetricsApi as jest.Mock
metricsApiConstructor.mockReturnValue(metricsApiMock)

test('run successfully', async () => {
  metricsApiMock.submitMetrics.mockResolvedValue({ status: 'ok' })
  await expect(
    run({
      datadogApiKey: 'DATADOG_API_KEY',
      metricName: 'my.metric',
      metricType: 'gauge',
      metricValue: 100,
      metricTags: ['key:value'],
    })
  ).resolves.toBeUndefined()
})
