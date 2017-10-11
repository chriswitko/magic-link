# Email notification using Webtask.io & Amazon SES

Simple serverless micro service to send notifications.

# Example

Endpoint: https://wt-bd5d5ed4fcff43323d0a094f68f82f65-0.run.webtask.io/magic-link

Method: POST

Tip: Replace ENTER_YOUR_EMAIL with your own reak email

```curl -H "Content-Type: application/json" -X POST -d '{"email": "ENTER_YOUR_EMAIL", "id": "1234", "token": "1a2b3c4d5e6f"}' https://wt-bd5d5ed4fcff43323d0a094f68f82f65-0.run.webtask.io/magic-link```

# Results

You will receive email with a magic token. It's just an example so the signin link will not work.
