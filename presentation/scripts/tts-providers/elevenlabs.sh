# ────────────────────────────────────────────────────────────────────
# ElevenLabs provider — Voice Clone + Multilingual v2
#
# Docs:   https://elevenlabs.io/docs/api-reference/text-to-speech
# Env:    ELEVENLABS_API_KEY=...         required
#         ELEVENLABS_VOICE_ID=...        required（你的複製音色 ID）
# Model:  eleven_multilingual_v2         支援繁體中文
#
# 設定步驟：
#   1. 註冊 https://elevenlabs.io（免費方案可用）
#   2. Voice Lab → Add Voice → Instant Voice Clone → 上傳聲音樣本
#   3. 複製 Voice ID（點進你的 voice → 右上角 ID）
#   4. Profile → API Keys → 複製 API key
#   5. export ELEVENLABS_API_KEY=sk-...
#      export ELEVENLABS_VOICE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
# ────────────────────────────────────────────────────────────────────

tts_check() {
  command -v curl >/dev/null || { echo "✗ curl not found" >&2; return 1; }
  command -v jq   >/dev/null || { echo "✗ jq not found" >&2; return 1; }
  [[ -n "${ELEVENLABS_API_KEY:-}" ]] || {
    echo "✗ ELEVENLABS_API_KEY 未設定" >&2; return 1
  }
  [[ -n "${ELEVENLABS_VOICE_ID:-}" ]] || {
    echo "✗ ELEVENLABS_VOICE_ID 未設定" >&2; return 1
  }
}

tts_install_help() {
  cat <<'EOF' >&2

設定 ElevenLabs：

  1. 註冊帳號：https://elevenlabs.io（免費方案即可）
  2. Voice Lab → Add Voice → Instant Voice Clone → 上傳 1~3 分鐘聲音樣本
  3. 複製 Voice ID（點進你的聲音 → 右上角 ID 字串）
  4. Profile → API Keys → 複製 API key

  export ELEVENLABS_API_KEY=sk-xxxxxxxx
  export ELEVENLABS_VOICE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
  PRESENTATION_TTS=elevenlabs npm run synthesize-audio

EOF
}

tts_synthesize() {
  local text="$1" out="$2"
  local voice="${3:-${ELEVENLABS_VOICE_ID:-}}"
  local payload

  payload=$(jq -n --arg t "$text" \
    '{
      text: $t,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.85,
        style: 0.2,
        use_speaker_boost: true
      }
    }')

  curl -fsS -o "$out" -X POST \
    "https://api.elevenlabs.io/v1/text-to-speech/$voice" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -H "Content-Type: application/json" \
    -H "Accept: audio/mpeg" \
    -d "$payload"
}
