"""
Tests for the Bank Marketing Prediction API.

Run from the `backend/` directory (so bank_logistic_model.pkl resolves
correctly, since main.py loads it via a relative path):

    cd backend
    pytest tests/ -v
"""

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app, raise_server_exceptions=False)

# A known-good payload matching every field the model expects.
VALID_CUSTOMER = {
    "age": 48,
    "job": "management",
    "marital": "married",
    "education": "tertiary",
    "default": "no",
    "balance": 1500,
    "housing": "yes",
    "loan": "no",
    "contact": "cellular",
    "day": 10,
    "month": "may",
    "duration": 300,
    "campaign": 2,
    "pdays": -1,
    "previous": 0,
    "poutcome": "unknown",
}


def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bank Marketing Prediction API"}


def test_predict_returns_200():
    response = client.post("/predict", json=VALID_CUSTOMER)
    assert response.status_code == 200


def test_predict_response_shape():
    response = client.post("/predict", json=VALID_CUSTOMER)
    body = response.json()

    assert "prediction" in body
    assert "probability" in body
    assert "result" in body

    assert body["prediction"] in (0, 1)
    assert isinstance(body["probability"], float)
    assert 0.0 <= body["probability"] <= 1.0
    assert body["result"] in (
        "Customer likely to subscribe",
        "Customer unlikely to subscribe",
    )


def test_predict_result_matches_prediction_flag():
    response = client.post("/predict", json=VALID_CUSTOMER)
    body = response.json()

    if body["prediction"] == 1:
        assert body["result"] == "Customer likely to subscribe"
    else:
        assert body["result"] == "Customer unlikely to subscribe"


def test_predict_with_unknown_categorical_values():
    """
    Fields like job/contact/poutcome can legitimately be "unknown" in this
    dataset. The endpoint should not error out on them.
    """
    customer = {**VALID_CUSTOMER, "job": "unknown", "contact": "unknown"}
    response = client.post("/predict", json=customer)
    assert response.status_code == 200


def test_predict_missing_field_returns_error():
    """
    main.py currently accepts a raw dict, so a missing field will likely
    surface as a 500 from inside the sklearn pipeline rather than a clean
    422. This test documents current behavior — if you add a Pydantic
    request model to main.py, tighten this to expect 422 instead.
    """
    incomplete_customer = VALID_CUSTOMER.copy()
    del incomplete_customer["duration"]

    response = client.post("/predict", json=incomplete_customer)
    assert response.status_code >= 400


@pytest.mark.parametrize("field,value", [
    ("age", 22),
    ("age", 90),
    ("balance", -500),   # negative balances are valid in this dataset
    ("campaign", 1),
    ("previous", 0),
])
def test_predict_accepts_boundary_values(field, value):
    customer = {**VALID_CUSTOMER, field: value}
    response = client.post("/predict", json=customer)
    assert response.status_code == 200


def test_cors_headers_present():
    response = client.options(
        "/predict",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"