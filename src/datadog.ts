import assert from 'node:assert'
import * as core from '@actions/core'
import { client, v1 } from '@datadog/datadog-api-client'

export type DatadogInputs = {
  datadogApiKey: string
  datadogSite?: string
  datadogMetricsChunkSize: number
}

const createConfiguration = (datadogInputs: DatadogInputs) => {
  const configuration = client.createConfiguration({
    authMethods: {
      apiKeyAuth: datadogInputs.datadogApiKey,
    },
  })
  if (datadogInputs.datadogSite) {
    client.setServerVariables(configuration, {
      site: datadogInputs.datadogSite,
    })
  }
  return configuration
}

export const sendMetrics = async (datadogInputs: DatadogInputs, series: v1.Series[]) => {
  const api = new v1.MetricsApi(createConfiguration(datadogInputs))
  core.info(`Sending all ${series.length} metrics`)
  const chunks = splitArrayToChunks(series, datadogInputs.datadogMetricsChunkSize)
  for (const chunk of chunks) {
    core.info(`Sending ${chunk.length} metrics`)
    const metricsResponse = await api.submitMetrics({ body: { series: chunk } })
    core.info(`Sent the metrics: ${String(metricsResponse.status)}`)
  }
}

export const splitArrayToChunks = <E>(elements: E[], chunkSize: number): E[][] => {
  assert(chunkSize > 0, 'chunkSize must be greater than 0')
  const chunks: E[][] = []
  for (let i = 0; i < elements.length; i += chunkSize) {
    chunks.push(elements.slice(i, i + chunkSize))
  }
  return chunks
}

export const sendEvent = async (datadogInputs: DatadogInputs, event: v1.EventCreateRequest) => {
  const api = new v1.EventsApi(createConfiguration(datadogInputs))
  core.info(`Sending event:\n${JSON.stringify(event, undefined, 2)}`)
  const eventsResponse = await api.createEvent({ body: event })
  core.info(`Sent event: ${String(eventsResponse.status)}`)
}
