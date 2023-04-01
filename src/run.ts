import * as core from '@actions/core'
import { client, v1 } from '@datadog/datadog-api-client'
import { Series } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1'

type Inputs = {
  datadogApiKey: string
  datadogSite?: string
  metricName: string
  metricType: string
  metricValue: number
  metricTags: string[]
}

export const run = async (inputs: Inputs): Promise<void> => {
  const configuration = client.createConfiguration({
    authMethods: {
      apiKeyAuth: inputs.datadogApiKey,
    },
  })
  if (inputs.datadogSite) {
    client.setServerVariables(configuration, {
      site: inputs.datadogSite,
    })
  }

  const unixTime = Date.now() / 1000
  const metrics = new v1.MetricsApi(configuration)
  const series: Series[] = [
    {
      host: 'github.com',
      metric: inputs.metricName,
      type: inputs.metricType,
      points: [[unixTime, inputs.metricValue]],
      tags: inputs.metricTags,
    },
  ]
  core.info(`Sending metrics:\n${JSON.stringify(series, undefined, 2)}`)
  const metricsResponse = await metrics.submitMetrics({ body: { series } })
  core.info(`Sent metrics: ${String(metricsResponse.status)}`)
}
