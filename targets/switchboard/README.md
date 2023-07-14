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

Artillery scripts can be run locally like this:

```sh
yarn artillery run \
  --platform=local \
  --environment=staging \
  --dotenv=targets/switchboard/.env \
  targets/switchboard/artillery-scripts/send-message.yaml
```

Artillery scripts can be run from AWS Lambda like this:

Get session for MFA-enabled users. The session returned by the command may be set as the AWS credentials [a few different ways](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

```sh
aws sts get-session-token \
  --serial-number arn:aws:iam::123456789012:mfa/user \
  --token-code code-from-token
```

Run the script on Lambda:

```sh
yarn artillery run \
  --platform=aws:lambda \
  --platform-opt region=us-east-1 \
  --platform-opt memory-size=2048 \
  --environment=staging \
  --count=20 \
  --dotenv=targets/switchboard/.env \
  targets/switchboard/artillery-scripts/send-message.yaml
```

Lambda limits the file descriptor count [to 1024 per worker](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html). You will need to specify a worker count (`--count`) that will support the maximum concurrent virtual users for the script.
