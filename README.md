# send-datadog-action [![ts](https://github.com/int128/send-datadog-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/send-datadog-action/actions/workflows/ts.yaml)

This is a general-purpose action to send a custom metric or event to Datadog.

## Getting Started

### Send a metric

To send a metric, create a workflow as follows:

```yaml
jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/send-datadog-action@v1
        with:
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          metric-name: your_awesome_metric
          metric-type: count
          metric-value: 1
```

### Send an event

To send an event, create a workflow as follows:

```yaml
jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/send-datadog-action@v1
        with:
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          event-title: Your awesome event
          event-text: This is an example event
```

### Send metrics from CSV

To send metric from CSV file(s), create a workflow as follows:

```yaml
jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/send-datadog-action@v1
        with:
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          metrics-csv-path: |
            metrics.csv
```

A CSV file should be formatted as follows:

```csv
metric_name,metric_type,metric_value,tag_key:tag_value,...
```

See the example of [metrics.csv](tests/fixtures/metrics.csv).

### Inputs

| Name               | Default                        | Description                                                                     |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------- |
| `datadog-api-key`  | (required)                     | Datadog API key. If not set, this action does not send metrics actually         |
| `datadog-site`     | -                              | Datadog Server name such as `datadoghq.eu`, `ddog-gov.com`, `us3.datadoghq.com` |
| `metrics-csv-path` | -                              | Glob pattern to CSV file(s) for metrics                                         |
| `metric-name`      | (required if sending a metric) | Name of metric                                                                  |
| `metric-type`      | (required if sending a metric) | Type of metric (`count`, `gauge` or `rate`)                                     |
| `metric-value`     | (required if sending a metric) | Value of metric                                                                 |
| `metric-tags`      | -                              | Tags of metric (multi-line of `KEY:VALUE`)                                      |
| `event-title`      | (required if sending an event) | Title of event                                                                  |
| `event-text`       | (required if sending an event) | Text of event                                                                   |
| `event-alert-type` | -                              | Alert type of event (error, warning or info)                                    |
| `event-tags`       | -                              | Tags of event (multi-line of KEY:VALUE)                                         |

### Outputs

None.
