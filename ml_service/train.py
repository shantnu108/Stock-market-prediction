from ml_service.data_fetch import fetch_stock_data
from ml_service.feature_engineer import create_features

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix
)

import joblib
import numpy as np
import os
import pandas as pd


# -----------------------------------------------------------
# WALK-FORWARD VALIDATION FUNCTION (TIME-SERIES SAFE)
# -----------------------------------------------------------
def walk_forward_validate(X, y, folds=5):
    fold_size = len(X) // folds
    scores = []

    for i in range(folds - 1):
        start = 0
        end = fold_size * (i + 1)
        next_end = fold_size * (i + 2)

        X_train, X_test = X.iloc[start:end], X.iloc[end:next_end]
        y_train, y_test = y[start:end], y[end:next_end]

        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=10,
            min_samples_leaf=3,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1
        )

        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        bal_acc = balanced_accuracy_score(y_test, preds)
        scores.append(bal_acc)

    return np.mean(scores), scores
















# -----------------------------------------------------------
# TRAIN & EVALUATE MODEL FOR A SINGLE VOLATILITY REGIME
# -----------------------------------------------------------
def train_per_regime(df_regime, regime_id):
    print(f"\n==============================")
    print(f"Training model for VOL_REGIME = {regime_id}")
    print(f"Samples: {len(df_regime)}")
    print(f"==============================")

    # -----------------------------
    # Split features / target
    # -----------------------------
    X = df_regime.drop(columns=["target"])
    y = df_regime["target"].astype(int).values

    X = X.select_dtypes(include=["int64", "float64"])

    valid_idx = ~np.isnan(X).any(axis=1)
    X = X.loc[valid_idx]
    y = y[valid_idx]

    if len(X) < 200:
        print("⚠️ Not enough samples — skipping regime")
        return None

    # -----------------------------
    # Time-based split
    # -----------------------------
    split = int(len(X) * 0.8)

    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y[:split], y[split:]

    # -----------------------------
    # Train model
    # -----------------------------
    model = RandomForestClassifier(
        n_estimators=400,
        max_depth=10,
        min_samples_leaf=3,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    bal_acc = balanced_accuracy_score(y_test, preds)

    print(f"Balanced Accuracy: {bal_acc:.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, preds))

    return bal_acc
















def main():
    print("📥 Fetching data...")
    df = fetch_stock_data("AAPL")

    print("🧠 Engineering features...")
    df_feat = create_features(df)

    # -------------------------------------------------
    # CREATE TARGET (NOISE-FILTERED DIRECTION)
    # -------------------------------------------------
    future_return = df_feat["Close"].pct_change(5).shift(-5)


    df_feat["target"] = np.where(
        future_return > 0.002, 1,
        np.where(future_return < -0.002, 0, np.nan)
    )

    df_feat.dropna(inplace=True)

    print("\nTarget distribution:")
    print(df_feat["target"].value_counts())

    # -------------------------------------------------
    # SPLIT FEATURES / TARGET
    # -------------------------------------------------
    X = df_feat.drop(
        columns=["target", "Open", "High", "Low", "Close", "Volume"]
    )
    y = df_feat["target"].astype(int).values


    # -------------------------------------------------
    # SANITY CLEANING
    # -------------------------------------------------
    X = X.select_dtypes(include=["int64", "float64"])

    valid_idx = ~np.isnan(X).any(axis=1)
    X = X.loc[valid_idx]
    y = y[valid_idx]

    # -------------------------------------------------
    # TRAIN / TEST SPLIT (TIME-BASED)
    # -------------------------------------------------
    split = int(len(X) * 0.8)

    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y[:split], y[split:]

    # -------------------------------------------------
    # TRAIN MODEL
    # -------------------------------------------------
    print("🤖 Training RandomForestClassifier...")

    model = RandomForestClassifier(
        n_estimators=500,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=3,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    # -------------------------------------------------
    # EVALUATION
    # -------------------------------------------------
    predictions = model.predict(X_test)

    acc = accuracy_score(y_test, predictions)
    bal_acc = balanced_accuracy_score(y_test, predictions)

    print(f"\nTest Accuracy          : {acc:.4f}")
    print(f"Test Balanced Accuracy : {bal_acc:.4f}")

    print("\nClassification Report:")
    print(classification_report(y_test, predictions, zero_division=0))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, predictions))

    # -------------------------------------------------
    # WALK-FORWARD VALIDATION (TRAIN DATA ONLY)
    # -------------------------------------------------
    wf_mean, wf_scores = walk_forward_validate(
        X.iloc[:split],
        y[:split]
    )

    print(f"\nWalk-Forward Balanced Accuracy Mean : {wf_mean:.4f}")
    print("Walk-Forward Fold Scores:", [round(s, 4) for s in wf_scores])

    # -------------------------------------------------
    # BASELINE (MAJORITY CLASS)
    # -------------------------------------------------
    majority_class = np.bincount(y_train).argmax()
    baseline_pred = np.full_like(y_test, majority_class)

    baseline_acc = accuracy_score(y_test, baseline_pred)
    baseline_bal_acc = balanced_accuracy_score(y_test, baseline_pred)

    print(f"\nBaseline Accuracy          : {baseline_acc:.4f}")
    print(f"Baseline Balanced Accuracy : {baseline_bal_acc:.4f}")
    # -------------------------------------------------
    # FINAL MODEL: MEDIUM VOLATILITY ONLY
    # -------------------------------------------------
    print("\n🎯 TRAINING FINAL MODEL (VOL_REGIME = 1 ONLY)")

    df_regime_1 = df_feat[df_feat["vol_regime"] == 1]

    train_per_regime(df_regime_1, regime_id=1)



    # -------------------------------------------------
    # SAVE MODEL IF IT BEATS BASELINE
    # -------------------------------------------------
    if bal_acc > baseline_bal_acc:
        os.makedirs("ml_service", exist_ok=True)

        feature_cols = [
            col for col in X.columns
            if col not in ["Open", "High", "Low", "Close", "Volume"]
        ]

        joblib.dump(
            {
                "model": model,
                "features": feature_cols
            },
            "ml_service/model.pkl"
        )

        print("\n✅ Classifier beats baseline — model saved")
    else:
        print("\n❌ Classifier does NOT beat baseline — model NOT saved")


if __name__ == "__main__":
    main()
