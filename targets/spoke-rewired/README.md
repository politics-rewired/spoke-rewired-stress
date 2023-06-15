# Serverless Artillery

This directory contains:

- A collection of Artillery scripts to stress test various Spoke functionality.

## Environment Variables

- `BASE_URL` - Base URL to run the artillery scripts against.
- `SESSION_COOKIES_CSV_PATH` - Path to CSV file containing session cookie values. These may be generated using the two scripts in the [`utils`](./utils) directory.
- `AUTOASSIGN_CSV_PATH` - Path to CSV file containing autoassignment request credentials and payloads.
