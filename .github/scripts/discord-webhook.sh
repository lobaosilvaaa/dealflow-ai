#!/bin/bash

WEBHOOK_URL=$1
USERNAME=$2
TITLE=$3
DESCRIPTION=$4
COLOR=$5

AVATAR_URL="https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png"

curl -X POST "$WEBHOOK_URL" \
-H "Content-Type: application/json" \
-d "{
  \"username\": \"$USERNAME\",
  \"avatar_url\": \"$AVATAR_URL\",
  \"embeds\": [{
    \"title\": \"$TITLE\",
    \"description\": \"$DESCRIPTION\",
    \"color\": $COLOR
  }]
}"