# Data class

## Data.load()

```
Data.load(url, { type, mainElement, timeout, limit, offset })
```

Load data from url.

- `url` The URL to fetch.
- `type` Type of file being retrieved. `"text"`, `"tsv"`, `"csv"`, `"sparql-results-json"`, `"elasticsearch"`, `"json"` (Optional. Default is `"json"`.)
- `mainElement` The main element of the stanza. Used for spinner and error indication if specified. (Optional. Default is `null`.)
- `timeout` Timeout in milliseconds. (Optional. Default is 10 minutes.)
- `limit` The number of records to try to retrieve. If `type` is `"elasticsearch"`, this parameter is passed as `size` query parameter. Otherwise, passed as `limit`.
- `offset` Starting record offset to try to retrieve. If `type` is `"elasticsearch"`, this parameter is passed as `from` query parameter. Otherwise, passed as `offset`.
