import { v1 } from '@datadog/datadog-api-client'
import { MetricsFromCsvInputs, parseMetricsCsvFiles } from './csv.js'
import { DatadogInputs, sendEvent, sendMetrics } from './datadog.js'

type Inputs = DatadogInputs & MetricInputs & EventInputs & MetricsFromCsvInputs

export const run = async (inputs: Inputs): Promise<void> => {
  if (inputs.metricsCsvPath) {
    const metrics = await parseMetricsCsvFiles(inputs)
    await sendMetrics(inputs, metrics)
  }
  if (inputs.metricName) {
    const metrics = parseMetricInputs(inputs)
    await sendMetrics(inputs, metrics)
  }
  if (inputs.eventTitle) {
    const event = parseEventInputs(inputs)
    await sendEvent(inputs, event)
  }
}

type MetricInputs = {
  metricName: string
  metricType: string
  metricValue: number
  metricTags: string[]
}

const parseMetricInputs = (inputs: MetricInputs): v1.Series[] => {
  const unixTime = Date.now() / 1000
  return [
    {
      host: 'github.com',
      metric: inputs.metricName,
      type: inputs.metricType,
      points: [[unixTime, inputs.metricValue]],
      tags: inputs.metricTags,
    },
  ]
}

type EventInputs = {
  eventTitle: string
  eventText: string
  eventAlertType?: v1.EventAlertType
  eventTags: string[]
}

export const parseEventAlertType = (s: string): v1.EventAlertType | undefined => {
  if (!s) {
    return undefined
  }
  if (s === 'error' || s === 'warning' || s === 'info' || s === 'success') {
    return s
  }
  throw new Error(`event-alert-type must be either 'error', 'warning', 'success' or 'info'`)
}

const parseEventInputs = (inputs: EventInputs): v1.EventCreateRequest => {
  const unixTime = Date.now() / 1000
  return {
    host: 'github.com',
    title: inputs.eventTitle,
    text: inputs.eventText,
    dateHappened: unixTime,
    alertType: inputs.eventAlertType,
    tags: inputs.eventTags,
  }
}
