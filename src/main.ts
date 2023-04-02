import * as core from '@actions/core'
import { run } from './run'

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
    eventSource: core.getInput('event-source') || undefined,
    eventTags: core.getMultilineInput('event-tags'),
  })
}

main().catch((e) => core.setFailed(e instanceof Error ? e : String(e)))
