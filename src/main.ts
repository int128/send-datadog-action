import * as core from '@actions/core'
import { parseEventAlertType, run } from './run'

const main = async (): Promise<void> => {
  await run({
    datadogApiKey: core.getInput('datadog-api-key', { required: true }),
    datadogSite: core.getInput('datadog-site') || undefined,
    metricName: core.getInput('metric-name'),
    metricType: core.getInput('metric-type'),
    metricValue: Number.parseFloat(core.getInput('metric-value')),
    metricTags: core.getMultilineInput('metric-tags'),
    eventTitle: core.getInput('event-title'),
    eventText: core.getInput('event-text'),
    eventAlertType: parseEventAlertType(core.getInput('event-alert-type') || undefined),
    eventTags: core.getMultilineInput('event-tags'),
  })
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
