import * as core from '@actions/core'
import { client, v1 } from '@datadog/datadog-api-client'
import { UnparsedObject } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-common/util'
import { Series } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1'
import * as EventAlertType from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/EventAlertType'
import { MetricsFromCsvInputs, sendMetricsFromCsv } from './csv'

type Inputs = {
  datadogApiKey: string
  datadogSite?: string
} & MetricInputs &
  EventInputs &
  MetricsFromCsvInputs

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
  if (inputs.metricsCsvPath) {
    const api = new v1.MetricsApi(configuration)
    await sendMetricsFromCsv(api, inputs)
  }
  if (inputs.metricName) {
    const api = new v1.MetricsApi(configuration)
    await sendMetric(api, inputs)
  }
  if (inputs.eventTitle) {
    const api = new v1.EventsApi(configuration)
    await sendEvent(api, inputs)
  }
}

type MetricInputs = {
  metricName: string
  metricType: string
  metricValue: number
  metricTags: string[]
}

const sendMetric = async (api: v1.MetricsApi, inputs: MetricInputs) => {
  const unixTime = Date.now() / 1000
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
  const metricsResponse = await api.submitMetrics({ body: { series } })
  core.info(`Sent metrics: ${String(metricsResponse.status)}`)
}

type EventInputs = {
  eventTitle: string
  eventText: string
  eventAlertType?: v1.EventAlertType
  eventTags: string[]
}

export const parseEventAlertType = (s?: string): v1.EventAlertType | undefined =>
  validateEventAlertType(s) ? s : undefined

const validateEventAlertType = (s?: string | UnparsedObject): s is v1.EventAlertType | undefined => {
  const options = [EventAlertType.ERROR, EventAlertType.WARNING, EventAlertType.INFO]
  if (s === undefined || (typeof s === 'string' && options.includes(s))) {
    return true
  }
  throw new Error(`event-alert-type must be one of ${options.join(', ')}`)
}

const sendEvent = async (api: v1.EventsApi, inputs: EventInputs) => {
  const unixTime = Date.now() / 1000
  const event: v1.EventCreateRequest = {
    host: 'github.com',
    title: inputs.eventTitle,
    text: inputs.eventText,
    dateHappened: unixTime,
    alertType: inputs.eventAlertType,
    tags: inputs.eventTags,
  }
  core.info(`Sending event:\n${JSON.stringify(event, undefined, 2)}`)
  const eventsResponse = await api.createEvent({ body: event })
  core.info(`Sent event: ${String(eventsResponse.status)}`)
}
