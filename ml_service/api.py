from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

from ml_service.data_fetch import fetch_stock_data
from ml_service.feature_engineer import create_features

# -------------------------------------------------
# APP INIT
# -------------------------------------------------
app = FastAPI(
    title="Stock Prediction ML Service",
    description="Regime-aware stock prediction API",
    version="1.0"
)

# -------------------------------------------------
# LOAD MODEL
# -------------------------------------------------
model_data = joblib.load("ml_service/model.pkl")
model = model_data["model"]
feature_cols = model_data["features"]

# -------------------------------------------------
# REQUEST / RESPONSE SCHEMAS
# -------------------------------------------------
class PredictRequest(BaseModel):
    symbol: str = "AAPL"

class PredictResponse(BaseModel):
    symbol: str
    prediction: int
    confidence: float
    regime: int

# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------
@app.get("/")
def health_check():
    return {"status": "ML service running"}

# -------------------------------------------------
# PREDICTION ENDPOINT
# -------------------------------------------------
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    symbol = req.symbol.upper()

    # Fetch stock data
    df = fetch_stock_data(symbol)
    df_feat = create_features(df)

    # Use latest row
    latest = df_feat.iloc[-1:]

    # Regime (still returned)
    regime = int(latest["vol_regime"].values[0])

    # Prepare features
    X = latest[feature_cols]
    X = X.select_dtypes(include=["int64", "float64"])
    X = X.fillna(0)

    # Predict probabilities
    probs = model.predict_proba(X)[0]
    prediction = int(np.argmax(probs))
    confidence = float(np.max(probs))

    return PredictResponse(
        symbol=symbol,
        prediction=prediction,
        confidence=confidence,
        regime=regime
    )
