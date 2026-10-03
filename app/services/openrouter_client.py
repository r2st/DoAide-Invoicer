from __future__ import annotations

import json
import logging
import re
import time
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class OpenRouterError(RuntimeError):
    pass


_RETRYABLE_STATUS = frozenset({408, 429, 500, 502, 503, 504})
_BACKOFF_BASE_SECONDS = 1.0


def is_configured() -> bool:
    return bool(settings.openrouter_api_key)


def extract_json_object(raw: str) -> dict[str, Any] | None:
    if not raw:
        return None
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip(), flags=re.S)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        return None
    try:
        parsed = json.loads(text[start : end + 1])
    except (ValueError, TypeError):
        return None
    return parsed if isinstance(parsed, dict) else None


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.openrouter_app_url,
        "X-Title": settings.openrouter_app_title,
    }


def _message_text(choice: Any) -> str:
    if not isinstance(choice, dict):
        return ""
    message = choice.get("message")
    if not isinstance(message, dict):
        return ""
    content = message.get("content")
    if isinstance(content, list):
        content = "".join(
            str(part.get("text") or "") for part in content if isinstance(part, dict)
        )
    if content:
        return str(content).strip()
    return str(message.get("reasoning") or "").strip()


def chat_completion(
    messages: list[dict[str, Any]],
    *,
    model: str | None = None,
    temperature: float = 0.1,
    max_tokens: int = 2000,
    timeout: float | None = None,
) -> str:
    if not is_configured():
        raise OpenRouterError("OPENROUTER_API_KEY is not set")

    payload = {
        "model": model or settings.openrouter_model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    url = f"{settings.openrouter_base_url.rstrip('/')}/chat/completions"
    request_timeout = timeout or settings.openrouter_timeout_seconds

    attempts = max(1, settings.openrouter_max_attempts)
    last_error: OpenRouterError | None = None

    for attempt in range(1, attempts + 1):
        try:
            response = httpx.post(
                url, headers=_headers(), json=payload, timeout=request_timeout
            )
        except httpx.HTTPError as exc:
            last_error = OpenRouterError(f"OpenRouter request failed: {exc}")
            if attempt == attempts:
                break
            time.sleep(_BACKOFF_BASE_SECONDS * 2 ** (attempt - 1))
            continue

        if response.status_code in _RETRYABLE_STATUS:
            last_error = OpenRouterError(
                f"OpenRouter returned {response.status_code}: {response.text[:500]}"
            )
            if attempt == attempts:
                break
            time.sleep(_BACKOFF_BASE_SECONDS * 2 ** (attempt - 1))
            continue
        elif response.status_code >= 400:
            raise OpenRouterError(
                f"OpenRouter returned {response.status_code}: {response.text[:500]}"
            )

        data = response.json()
        choices = data.get("choices", [])
        if not choices:
            raise OpenRouterError(f"OpenRouter returned no choices: {str(data)[:300]}")
        text = _message_text(choices[0])
        if not text:
            raise OpenRouterError("OpenRouter returned an empty completion")
        return text

    raise last_error or OpenRouterError("OpenRouter request failed")


def chat_json(
    messages: list[dict[str, Any]],
    *,
    model: str | None = None,
    max_tokens: int = 2000,
    timeout: float | None = None,
) -> dict[str, Any]:
    raw = chat_completion(
        messages, model=model, temperature=0.0, max_tokens=max_tokens, timeout=timeout
    )
    parsed = extract_json_object(raw)
    if parsed is None:
        raise OpenRouterError(f"No JSON object in model response: {raw[:300]}")
    return parsed
