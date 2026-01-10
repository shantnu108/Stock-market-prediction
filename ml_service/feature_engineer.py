import pandas as pd
import numpy as np

from ta.momentum import RSIIndicator
from ta.trend import MACD, SMAIndicator, EMAIndicator
from ta.volatility import AverageTrueRange, BollingerBands
from ta.volume import VolumeWeightedAveragePrice


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    # Ensure Close/High/Low/Volume are Series, not DataFrame columns
    for col in ["Open", "High", "Low", "Close", "Volume"]:
        if isinstance(df[col], pd.DataFrame):
            df[col] = df[col].iloc[:, 0]

    df = df.copy()

    # --- BASIC RETURNS ---
    df["return_1"] = df["Close"].pct_change()
    df["return_5"] = df["Close"].pct_change(5)
    df["return_10"] = df["Close"].pct_change(10)

    # --- VOLATILITY REGIME (IMPORTANT) ---
    df["vol_20"] = df["return_1"].rolling(window=20).std()

    df["vol_regime"] = pd.qcut(
        df["vol_20"],
        q=3,
        labels=[0, 1, 2]
    )

    # convert AFTER NaNs are removed later



    # --- RSI ---
    df["rsi_14"] = RSIIndicator(close=df["Close"], window=14).rsi()

    # --- MACD ---
    macd = MACD(close=df["Close"])
    df["macd"] = macd.macd()
    df["macd_signal"] = macd.macd_signal()
    df["macd_diff"] = macd.macd_diff()

    # --- TREND ---
    df["sma_20"] = SMAIndicator(df["Close"], window=20).sma_indicator()
    df["ema_20"] = EMAIndicator(df["Close"], window=20).ema_indicator()

    df["trend_sma_ema"] = (df["ema_20"] > df["sma_20"]).astype(int)

    # --- VOLATILITY ---
    
    atr = AverageTrueRange(
        high=df["High"],
        low=df["Low"],
        close=df["Close"],
        window=14
    )
    df["atr_14"] = atr.average_true_range()
    df["atr_pct"] = df["atr_14"] / df["Close"]

    # --- BOLLINGER BANDS ---
    bb = BollingerBands(close=df["Close"], window=20, window_dev=2)
    df["bb_high"] = bb.bollinger_hband()
    df["bb_low"] = bb.bollinger_lband()
    df["bb_width"] = (df["bb_high"] - df["bb_low"]) / df["Close"]

    # --- VWAP ---
    vwap = VolumeWeightedAveragePrice(
        high=df["High"],
        low=df["Low"],
        close=df["Close"],
        volume=df["Volume"],
        window=14
    )
    df["vwap"] = vwap.volume_weighted_average_price()
    df["close_vs_vwap"] = (df["Close"] > df["vwap"]).astype(int)

    # --- CLEANUP ---
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)

    return df
