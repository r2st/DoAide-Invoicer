from app.services.openrouter_client import extract_json_object


def test_extract_json_from_raw():
    raw = '```json\n{"name": "test", "value": 42}\n```'
    result = extract_json_object(raw)
    assert result is not None
    assert result["name"] == "test"
    assert result["value"] == 42


def test_extract_json_with_prose():
    raw = 'Here is the result:\n{"vendor": "ABC", "total": 1000}\nDone.'
    result = extract_json_object(raw)
    assert result is not None
    assert result["vendor"] == "ABC"


def test_extract_json_no_json():
    result = extract_json_object("No JSON here")
    assert result is None


def test_extract_json_empty():
    result = extract_json_object("")
    assert result is None


def test_extract_json_nested():
    raw = '{"items": [{"desc": "A"}, {"desc": "B"}], "total": 100}'
    result = extract_json_object(raw)
    assert result is not None
    assert len(result["items"]) == 2
