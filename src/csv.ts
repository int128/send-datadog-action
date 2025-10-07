import assert from 'assert'
import * as core from '@actions/core'
import * as fs from 'fs/promises'
import * as glob from '@actions/glob'
import { v1 } from '@datadog/datadog-api-client'

export type MetricsFromCsvInputs = {
  metricsCsvPath: string
  metricsCsvFormat: string
}

export const parseMetricsCsvFiles = async (inputs: MetricsFromCsvInputs): Promise<v1.Series[]> => {
  const unixTime = Date.now() / 1000
  const series: v1.Series[] = []
  const csvGrobber = await glob.create(inputs.metricsCsvPath, { matchDirectories: false })
  for await (const csvPath of csvGrobber.globGenerator()) {
    core.info(`Reading metrics from ${csvPath}`)
    series.push(...(await parseMetricsCsv(inputs, csvPath, unixTime)))
  }
  return series
}

const parseMetricsCsv = async (
  inputs: MetricsFromCsvInputs,
  csvPath: string,
  unixTime: number,
): Promise<v1.Series[]> => {
  if (inputs.metricsCsvFormat === 'simple') {
    return parseMetricsCsvSimple(csvPath, unixTime)
  }
  if (inputs.metricsCsvFormat === 'use-header-tags') {
    return parseMetricsCsvUseHeaderTags(csvPath, unixTime)
  }
  throw new Error(`Unknown metrics-csv-format: ${inputs.metricsCsvFormat}`)
}

export const parseMetricsCsvSimple = async (csvPath: string, unixTime: number): Promise<v1.Series[]> => {
  const series: v1.Series[] = []
  const csvFileStream = await fs.open(csvPath, 'r')
  for await (const line of csvFileStream.readLines()) {
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

export const parseMetricsCsvUseHeaderTags = async (csvPath: string, unixTime: number): Promise<v1.Series[]> => {
  const series: v1.Series[] = []
  const csvFileStream = await fs.open(csvPath, 'r')
  let metricTagKeys: string[] | undefined
  for await (const line of csvFileStream.readLines()) {
    const columns = line.split(',')

    const metricName = columns.shift()
    assert(metricName, `Metric name column is missing in line: ${line}`)
    const metricType = columns.shift()
    assert(metricType, `Metric type column is missing in line: ${line}`)
    const metricValue = columns.shift()
    assert(metricValue, `Metric value column is missing in line: ${line}`)

    if (metricTagKeys === undefined) {
      metricTagKeys = columns
      continue
    }
    const metricTagValues = columns
    assert.strictEqual(
      metricTagKeys.length,
      metricTagValues.length,
      `Metric tag keys (${metricTagKeys.length}) and values (${metricTagValues.length}) length mismatch in line: ${line}`,
    )
    const metricTags = metricTagKeys.map((metricTagKey, index) => `${metricTagKey}:${metricTagValues[index]}`)

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
