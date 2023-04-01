# send-datadog-action [![ts](https://github.com/int128/send-datadog-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/send-datadog-action/actions/workflows/ts.yaml)

This is a general-purpose action to send a custom metric or event to Datadog.

## Getting Started

To send a metric, create a workflow as follows:

```yaml
jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/send-datadog-action@v1
        with:
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
```

### Inputs

| Name | Default | Description
|------|----------|------------
| `datadog-api-key` | (required) | Datadog API key. If not set, this action does not send metrics actually
| `datadog-site` | - | Datadog Server name such as `datadoghq.eu`, `ddog-gov.com`, `us3.datadoghq.com`
| `metric-name` | - | Name of metric
| `metric-type` | - | Type of metric (`count`, `gauge` or `rate`)
| `metric-value` | - | Value of metric
| `metric-tags` | - | Tags of metric (multi-line of `KEY:VALUE`)

### Outputs

None.
