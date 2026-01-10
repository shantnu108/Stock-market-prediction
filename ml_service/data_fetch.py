import pandas as pd
import yfinance as yf


def fetch_stock_data(symbol: str) -> pd.DataFrame:
    df = yf.download(symbol, start="2018-01-01", progress=False)

    # 🔥 FIX: Flatten MultiIndex columns (Yahoo Finance issue)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df.reset_index(inplace=True)

    return df
