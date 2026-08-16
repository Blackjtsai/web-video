# ────────────────────────────────────────────────────────────────────
# edge-tts provider — Microsoft Edge neural TTS, free, no API key.
#
# Install:  pip install edge-tts
# Voices:   python3 -m edge_tts --list-voices | grep zh-TW
#   zh-TW-HsiaoChenNeural   (Female, Friendly)
#   zh-TW-HsiaoYuNeural     (Female, Friendly)
#   zh-TW-YunJheNeural      (Male,   Friendly)
#
# Default voice: zh-TW-HsiaoChenNeural
# ────────────────────────────────────────────────────────────────────

tts_check() {
  python3 -c "import edge_tts" 2>/dev/null || {
    echo "✗ edge_tts python module not found." >&2
    return 1
  }
}

tts_install_help() {
  cat <<'EOF' >&2
Install edge-tts (free, Microsoft Edge neural TTS, no API key required):
  pip install edge-tts
List available voices:
  python3 -m edge_tts --list-voices | grep zh-TW
EOF
}

tts_synthesize() {
  local text="$1" out="$2" voice="${3:-zh-TW-HsiaoChenNeural}"
  python3 -m edge_tts \
    --text "$text" \
    --voice "$voice" \
    --write-media "$out" \
    >/dev/null 2>&1
}
