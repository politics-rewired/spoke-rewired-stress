# Switchboard Artillery Load Testing

Perform load test against a dry run mode (no calls to 3rd party telecom providers) Switchboard deployment.

## Setup

**Stand up Switchboard shard in dry mode**

TBD

**Set up billing.clients, sms.sending_accounts, sms.profiles, etc.**

TBD

**Set values for Artillery use**

Copy and update the provided example `.env`

```sh
cp .env.example .env
vi .env
```

## Running

Artillery scripts can be run like this:

```sh
yarn artillery run \
  --platform=local \
  --environment=staging \
  --dotenv=targets/switchboard/.env \
  targets/switchboard/artillery-scripts/send-message.yaml
```
