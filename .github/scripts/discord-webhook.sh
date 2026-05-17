#!/bin/bash

# 🚀 DealFlow AI Discord Webhook

WEBHOOK_URL=$1
USERNAME=$2
TITLE=$3
DESCRIPTION=$4
COLOR=$5

AVATAR_URL="https://raw.githubusercontent.com/lobaosilvaaa/dealflow-ai/main/src/assets/LogoDealFlowAI.png"

# 🛡️ Verifica jq
if ! command -v jq &> /dev/null
then
    echo "❌ jq não instalado"
    exit 1
fi

# 🛡️ Verifica parâmetros
if [ -z "$WEBHOOK_URL" ] ||
   [ -z "$USERNAME" ] ||
   [ -z "$TITLE" ] ||
   [ -z "$DESCRIPTION" ] ||
   [ -z "$COLOR" ]
then

    echo "❌ Uso incorreto"

    echo "
Uso:

./discord-webhook.sh \
WEBHOOK_URL \
USERNAME \
TITLE \
DESCRIPTION \
COLOR
"

    exit 1

fi

# 📦 Payload JSON
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

# 🚀 Envia webhook
HTTP_RESPONSE=$(curl -s -o /tmp/discord_response.txt -w "%{http_code}" \
-X POST "$WEBHOOK_URL" \
-H "Content-Type: application/json" \
--max-time 10 \
--retry 3 \
-d "$PAYLOAD")

# ✅ Sucesso
if [ "$HTTP_RESPONSE" -eq 204 ]
then

    echo "✅ Webhook enviado"

else

    echo "❌ Falha webhook"

    echo "HTTP: $HTTP_RESPONSE"

    cat /tmp/discord_response.txt

    exit 1

fi