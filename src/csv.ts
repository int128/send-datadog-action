import * as core from '@actions/core'
import * as fs from 'fs/promises'
import * as glob from '@actions/glob'
import { v1 } from '@datadog/datadog-api-client'
import assert from 'assert'

export type MetricsFromCsvInputs = {
  metricsCsvPath: string
}

export const sendMetricsFromCsv = async (api: v1.MetricsApi, inputs: MetricsFromCsvInputs) => {
  const unixTime = Date.now() / 1000
  const series: v1.Series[] = []

  const csvGrobber = await glob.create(inputs.metricsCsvPath, { matchDirectories: false })
  for await (const csvPath of csvGrobber.globGenerator()) {
    core.info(`Reading metrics from ${csvPath}`)
    series.push(...(await parseMetricsCsv(csvPath, unixTime)))
  }

  core.info(`Sending all ${series.length} metrics`)
  const metricsResponse = await api.submitMetrics({ body: { series } })
  core.info(`Sent the metrics: ${String(metricsResponse.status)}`)
}

export const parseMetricsCsv = async (csvPath: string, unixTime: number): Promise<v1.Series[]> => {
  const series: v1.Series[] = []
  const f = await fs.open(csvPath, 'r')
  for await (const line of f.readLines()) {
    const columns = line.split(',')

    const metricName = columns.shift()
    assert(metricName, `Metric name column is missing in line: ${line}`)
    const metricType = columns.shift()
    assert(metricType, `Metric type column is missing in line: ${line}`)
    const metricValue = columns.shift()
    assert(metricValue, `Metric value column is missing in line: ${line}`)
    const metricTags = columns

    series.push({
      host: 'github.com',
      metric: metricName,
      type: metricType,
      points: [[unixTime, Number(metricValue)]],
      tags: metricTags,
    })
  }
  return series
}
