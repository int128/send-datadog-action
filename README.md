# send-datadog-action [![ts](https://github.com/int128/send-datadog-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/send-datadog-action/actions/workflows/ts.yaml)

This is a general-purpose action to send a custom metric or event to Datadog.

## Getting Started

### Send a metric

To send a metric,

```yaml
name: send-your-awesome-metrics

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

To send an event,

```yaml
name: send-your-awesome-events

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

To send metric from CSV file(s),

```yaml
name: send-your-awesome-metrics

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - run: ./something_to_generate_metrics_csv.sh > metrics.csv
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

Each line should have the following columns:

- Name of metric
- Type of metric (`count`, `gauge` or `rate`)
- Value of metric
- Tag(s) in the form of `KEY:VALUE`. Trailing columns are treated as tags.

See the example of [metrics.csv](tests/fixtures/metrics.csv).

### Inputs

| Name               | Default        | Description                                                             |
| ------------------ | -------------- | ----------------------------------------------------------------------- |
| `datadog-api-key`  | -              | Datadog API key. If not set, this action does not send metrics actually |
| `datadog-site`     | -              | Datadog Site name if different than `datadoghq.com`                     |
| `metrics-csv-path` | -              | Glob pattern to CSV file(s) for metrics                                 |
| `metric-name`      | <sup>\*1</sup> | Name of metric                                                          |
| `metric-type`      | <sup>\*1</sup> | Type of metric (`count`, `gauge` or `rate`)                             |
| `metric-value`     | <sup>\*1</sup> | Value of metric                                                         |
| `metric-tags`      | -              | Tags of metric (multi-line of `KEY:VALUE`)                              |
| `event-title`      | <sup>\*2</sup> | Title of event                                                          |
| `event-text`       | <sup>\*2</sup> | Text of event                                                           |
| `event-alert-type` | -              | Alert type of event (error, warning or info)                            |
| `event-tags`       | -              | Tags of event (multi-line of KEY:VALUE)                                 |

<sup>\*1</sup>: Required inputs if sending a metric.

<sup>\*2</sup>: Required inputs if sending an event.

### Outputs

None.
