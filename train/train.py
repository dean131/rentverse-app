# File Path: apps/prediction-service/train.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import numpy as np
import time


def train_and_evaluate():
    """
    Loads cleaned data, removes outliers, trains multiple models, and saves the best one.
    """
    print("Starting model evaluation and training process...")

    # 1. Load the Cleaned Data
    try:
        df = pd.read_csv("properties_cleaned.csv")
        print(f"Successfully loaded {len(df)} cleaned properties.")
    except FileNotFoundError:
        print("Error: 'properties_cleaned.csv' not found.")
        return

    # --- NEW: Outlier Removal ---
    # This is the most critical step to improve model performance.
    # We will remove the most extreme 1% of prices from both the top and bottom.
    lower_bound = df["price"].quantile(0.01)
    upper_bound = df["price"].quantile(0.99)

    original_rows = len(df)
    df_filtered = df[(df["price"] >= lower_bound) & (df["price"] <= upper_bound)]
    print(
        f"Removed {original_rows - len(df_filtered)} outliers based on price. Training with {len(df_filtered)} properties."
    )

    # 2. Feature Engineering
    print("Performing feature engineering (One-Hot Encoding)...")
    df_engineered = pd.get_dummies(
        df_filtered, columns=["location", "listing_type", "property_type"], dtype=int
    )
    df_engineered["price_log"] = np.log1p(df_engineered["price"])

    target = "price_log"
    features = [
        col for col in df_engineered.columns if col not in ["price", "price_log"]
    ]

    X = df_engineered[features]
    y = df_engineered[target]

    X_train, X_test, y_train_log, y_test_log = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training with {len(X_train)} data points and {len(features)} features.")

    # 3. Define Models to Compare
    models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(),
        "Random Forest": RandomForestRegressor(
            n_estimators=100, random_state=42, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=100, random_state=42
        ),
    }

    results = {}
    best_model = None
    best_score = -np.inf

    # 4. Train and Evaluate Each Model
    for name, model in models.items():
        print(f"\n--- Training {name} ---")
        start_time = time.time()

        model.fit(X_train, y_train_log)

        log_predictions = model.predict(X_test)
        predictions = np.expm1(log_predictions)
        y_test_original = np.expm1(y_test_log)

        r2 = r2_score(y_test_original, predictions)
        rmse = np.sqrt(mean_squared_error(y_test_original, predictions))

        end_time = time.time()
        training_time = end_time - start_time

        results[name] = {"R²": r2, "RMSE": rmse, "Time (s)": training_time}

        if r2 > best_score:
            best_score = r2
            best_model = model

    # 5. Display Results
    print("\n--- Model Comparison ---")
    results_df = pd.DataFrame(results).T
    print(results_df.sort_values(by="R²", ascending=False))

    best_model_name = results_df["R²"].idxmax()
    print(f"\nBest performing model: {best_model_name}")

    # 6. Save the Best Model
    if best_model:
        model_filename = "property_price_model.joblib"
        columns_filename = "model_columns.joblib"

        joblib.dump(best_model, model_filename)
        joblib.dump(X_train.columns.tolist(), columns_filename)

        print(f"Best model ('{best_model_name}') saved to '{model_filename}'")
        print(f"Model columns saved to '{columns_filename}'")


if __name__ == "__main__":
    train_and_evaluate()
