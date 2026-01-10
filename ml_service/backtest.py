import numpy as np
import pandas as pd
import joblib

from ml_service.data_fetch import fetch_stock_data
from ml_service.feature_engineer import create_features


# -----------------------------------------------------------
# CAPITAL-AWARE BACKTEST ENGINE (NO OVERLAP)
# -----------------------------------------------------------
def backtest_capital_aware(
    df,
    preds,
    holding_period=5,
    risk_per_trade=0.01,
    cost=0.001,
    slippage=0.0005,
    initial_capital=1.0
):
    capital = initial_capital
    equity_curve = []
    trades = []

    i = 0
    while i < len(preds) - holding_period:
        equity_curve.append(capital)

        signal = preds[i]

        # -----------------------------
        # LONG TRADE
        # -----------------------------
        if signal == 1:
            entry_price = df["Close"].iloc[i] * (1 + slippage)
            exit_price = df["Close"].iloc[i + holding_period] * (1 - slippage)

            position_risk = capital * risk_per_trade
            trade_return = (exit_price - entry_price) / entry_price

            pnl = position_risk * trade_return
            pnl -= position_risk * cost

            capital += pnl
            trades.append(pnl)

            i += holding_period

        # -----------------------------
        # SHORT TRADE
        # -----------------------------
        elif signal == 0:
            entry_price = df["Close"].iloc[i] * (1 - slippage)
            exit_price = df["Close"].iloc[i + holding_period] * (1 + slippage)

            position_risk = capital * risk_per_trade
            trade_return = (entry_price - exit_price) / entry_price

            pnl = position_risk * trade_return
            pnl -= position_risk * cost

            capital += pnl
            trades.append(pnl)

            i += holding_period

        else:
            i += 1

    equity_curve.append(capital)

    return (
        pd.Series(equity_curve),
        pd.Series(trades)
    )

    capital = initial_capital
    equity_curve = []
    trades = []

    i = 0
    while i < len(preds) - holding_period:
        equity_curve.append(capital)

        if preds[i] == 1:
            entry_price = df["Close"].iloc[i] * (1 + slippage)
            exit_price = df["Close"].iloc[i + holding_period] * (1 - slippage)

            position_risk = capital * risk_per_trade
            trade_return = (exit_price - entry_price) / entry_price

            pnl = position_risk * trade_return
            pnl -= position_risk * cost

            capital += pnl

            trades.append(pnl)
            i += holding_period  # NO OVERLAPPING TRADES
        else:
            i += 1

    equity_curve.append(capital)

    return (
        pd.Series(equity_curve),
        pd.Series(trades)
    )


def main():
    symbols = ["AAPL", "MSFT", "NVDA", "META", "SPY"]

    results = []

    for symbol in symbols:
        print(f"\n==============================")
        print(f"📊 BACKTESTING: {symbol}")
        print(f"==============================")

        # -----------------------------
        # FETCH + FEATURES
        # -----------------------------
        df = fetch_stock_data(symbol)
        df_feat = create_features(df)

        # -----------------------------
        # LOAD MODEL (TRAINED PER SYMBOL)
        # -----------------------------
        model_data = joblib.load("ml_service/model.pkl")
        model = model_data["model"]
        feature_cols = model_data["features"]

        # -----------------------------
        # WEEKLY STRUCTURE
        # -----------------------------
        future_return = df_feat["Close"].pct_change(5).shift(-5)
        df_feat["target"] = np.where(future_return > 0, 1, 0)
        df_feat.dropna(inplace=True)

        # -----------------------------
        # REGIME FILTER
        # -----------------------------
        df_feat = df_feat[df_feat["vol_regime"] == 1]

        if len(df_feat) < 300:
            print("⚠️ Not enough samples — skipping")
            continue

        # -----------------------------
        # FEATURES
        # -----------------------------
        X = df_feat[feature_cols]
        X = X.select_dtypes(include=["int64", "float64"])
        X = X.fillna(0)

        preds = model.predict(X)

        # -----------------------------
        # BACKTEST
        # -----------------------------
        equity_curve, trade_pnls = backtest_capital_aware(
            df_feat,
            preds,
            holding_period=5,
            risk_per_trade=0.01,
            cost=0.001,
            slippage=0.0005,
            initial_capital=1.0
        )

        returns = equity_curve.pct_change().dropna()
        sharpe = returns.mean() / returns.std() * np.sqrt(252 / 5)

        rolling_max = equity_curve.cummax()
        drawdown = (equity_curve - rolling_max) / rolling_max
        max_dd = drawdown.min()

        total_return = equity_curve.iloc[-1] - 1
        hit_rate = (trade_pnls > 0).mean()

        bh_return = (
            df_feat["Close"].iloc[-1] /
            df_feat["Close"].iloc[0]
        ) - 1

        print(f"Total Return  : {total_return:.2%}")
        print(f"Sharpe        : {sharpe:.2f}")
        print(f"Max Drawdown  : {max_dd:.2%}")
        print(f"Hit Rate      : {hit_rate:.2%}")
        print(f"Buy & Hold    : {bh_return:.2%}")

        results.append({
            "Symbol": symbol,
            "Sharpe": sharpe,
            "MaxDD": max_dd,
            "Return": total_return
        })

    # -----------------------------
    # SUMMARY
    # -----------------------------
    print("\n\n📋 MULTI-ASSET SUMMARY")
    print("------------------------------")
    for r in results:
        print(
            f"{r['Symbol']:5s} | "
            f"Sharpe: {r['Sharpe']:.2f} | "
            f"MaxDD: {r['MaxDD']:.2%} | "
            f"Return: {r['Return']:.2%}"
        )

if __name__ == "__main__":
    main()
