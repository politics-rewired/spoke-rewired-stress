# Spoke Stress Testing Utils

Spoke utilities for stress testing.

## Usage

[**`fake-file`**](./fakeFile.js)

Used to generate a Spoke-style CSV of contacts with appropriate fields. Cell numbers are not guaranteed to be valid.

```sh
yarn fake-file row_count output_file.csv
```

[**`get-cookies-via-db`**](./get-cookies-via-db.js)

Used to generate the `cookies.csv` file that is used to authenticate the stress test requests.

```sh
node get-cookies-via-db.js 'https://text.domain.com/00000000-0000-4000-0000-000000000000/join' 10
```

[**`delete-users-except`**](./delete-users-except.js)

Used to clean up Auth0 users created for testing purposes.

```sh
node delete-users-except.js user1@domain.com,user2@domain.com,user3@domain.com
```
