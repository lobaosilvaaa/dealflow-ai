#!/bin/bash

WEBHOOK_URL=$1
USERNAME=$2
TITLE=$3
DESCRIPTION=$4
COLOR=$5

AVATAR_URL="https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png"

PAYLOAD=$(jq -n \
  --arg username "$USERNAME" \
  --arg avatar_url "$AVATAR_URL" \
  --arg title "$TITLE" \
  --arg description "$DESCRIPTION" \
  --argjson color "$COLOR" \
  '{
    username: $username,
    avatar_url: $avatar_url,
    embeds: [
      {
        title: $title,
        description: $description,
        color: $color
      }
    ]
  }')

curl -X POST "$WEBHOOK_URL" \
-H "Content-Type: application/json" \
-d "$PAYLOAD"