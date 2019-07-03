# Serverless Artillery

## Environment Variables

- `BASE_URL` - Base URL to run the artillery scripts against.
- `SESSION_COOKIES_CSV_PATH` - Path to CSV file containing session cookie values. These may be generated using the two scripts in the [`utils`](../utils) directory.
- `AUTOASSIGN_CSV_PATH` - Path to CSV file containing autoassignment request credentials and payloads.

## Before You Begin:

This currently only runs locally with `artillery`, not on Lambda with `serverless-artillery`. Even locally, changes are required to `artillery@v1.6.0-26`.

**CSV**

See [#622 - Regression in CSV parsing because of csv-parse upgrade.](https://github.com/artilleryio/artillery/issues/622) for full details. Until next version is released on npm, this change will need to be made locally.

## Serverless

Install dependencies globally:

    npm i -g serverless serverless-artillery

Follow `serverless-artillery`'s [instructions for running](https://github.com/Nordstrom/serverless-artillery#quick-start--finish).

**Potential Bugs**

- [#97 - Variables set in custom processors not being picked up in test script](https://github.com/Nordstrom/serverless-artillery/issues/97)
- [#115 - Replace Artillery-Core with Artillery](https://github.com/Nordstrom/serverless-artillery/issues/115).
