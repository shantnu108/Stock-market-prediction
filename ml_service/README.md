# Stock Market Prediction ML Service

Overview
This document describes the actual implementation of the ML service and how the Node.js backend integrates with it.

Service Overview
- Two API implementations exist in this repository:
  - FastAPI service (ml_service/api.py) — actively used by the backend
  - Flask app (ml_service/app.py) — legacy/demo, not used by the backend
- The service loads a trained model from ml_service/model.pkl and serves a /predict endpoint.

Model Artifact
- Path: ml_service/model.pkl
- Contents: a dict with keys
  - model: a scikit-learn classifier with predict_proba
  - features: list[str] of feature column names used for prediction

FastAPI Service (in use)
- File: ml_service/api.py
- Server: FastAPI app with two endpoints
  - GET / -> { "status": "ML service running" }
  - POST /predict -> PredictResponse
- Request schema (PredictRequest):
  - symbol: string (e.g., "AAPL")
- Response schema (PredictResponse):
  - symbol: string (uppercase)
  - prediction: int (argmax class)
  - confidence: float (max class probability)
  - regime: int (volatility regime from engineered features)
- Processing pipeline in /predict:
  1) Fetch latest OHLCV data using ml_service/data_fetch.py: fetch_stock_data(symbol)
  2) Generate engineered features using ml_service/feature_engineer.py: create_features(df)
  3) Take the latest row, extract "vol_regime" and the configured feature columns
  4) Clean feature frame (numeric only, fillna(0))
  5) Predict class probabilities with model.predict_proba and return the most likely class and confidence

Flask App (legacy/demo)
- File: ml_service/app.py
- Endpoint: POST /predict expects JSON with keys: ma10, ma50, return and returns { predicted_price }
- Runs on port 5000 by default if launched directly. The backend does NOT call this app.

Backend Integration
- The Node.js backend calls the FastAPI service at http://127.0.0.1:8000/predict
- Location: backend/routes/predict.js
- Flow:
  - Accepts POST /api/predict with body { symbol }
  - Forwards to ML service: POST http://127.0.0.1:8000/predict with same { symbol }
  - Receives response { symbol, prediction, confidence, regime }
  - Persists to MongoDB via backend/models/Prediction.js
  - Responds with { source: "ML Service", data, stored: true, id }
- Note: backend/controllers/predictController.js contains a similar flow but references an undefined Prediction; the active route implements persistence correctly.

How to Run
1) Start the FastAPI ML service
   - Ensure dependencies installed: pip install -r ml_service/requirements.txt
   - Launch with: uvicorn ml_service.api:app --reload --port 8000
2) Start the Node.js backend
   - cd backend
   - npm install
   - npm start (server listens on port 5000 by default)
3) Make a prediction via backend
   - POST http://localhost:5000/api/predict
   - Body: { "symbol": "AAPL" }

Contracts and Types
- ML Request: { symbol: string }
- ML Response: { symbol: string, prediction: number, confidence: number, regime: number }
- Backend Response: { source: string, data: ML Response, stored: boolean, id: string }

Environment Expectations
- ML service reachable at 127.0.0.1:8000
- MongoDB connection configured in backend/server.js

Notes and Caveats
- Do not mix up the Flask port (5000) with the FastAPI port (8000). The backend expects 8000.
- Ensure model.pkl contains the correct keys ("model" and "features"). If missing, FastAPI startup will fail.
- Feature engineering expects columns produced by create_features; changes require retraining and updating model.pkl.

File Map
- ml_service/api.py — FastAPI service (in use)
- ml_service/app.py — Flask demo (not used by backend)
- ml_service/data_fetch.py — Data ingestion
- ml_service/feature_engineer.py — Feature creation, includes vol_regime
- backend/routes/predict.js — Node route that integrates with ML service
- backend/models/Prediction.js — Mongoose model persisted by backend

Changelog
- 2026-01-12: Updated documentation to reflect FastAPI usage and Node.js backend integration.