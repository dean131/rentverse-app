import pandas as pd
import numpy as np
import re
import time

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import mean_absolute_error, r2_score

# --- Import all models ---
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import lightgbm as lgb
import catboost as cb

# --- 1. Load and Inspect Data ---
try:
    df = pd.read_csv("dataset.csv")
    print("\u2705 Dataset loaded successfully.")
    print(f"Shape of the dataset: {df.shape}")
except FileNotFoundError:
    print(
        "\u274c Error: dataset.csv not found. Please make sure the file is in the same directory."
    )
    exit()


# --- 2. Data Cleaning and Feature Engineering Functions ---
def clean_price(price_str):
    if isinstance(price_str, str):
        numbers = re.findall(r"\d+\.?\d*", price_str)
        return float(numbers[0]) if numbers else np.nan
    return np.nan


def clean_size(size_str):
    if isinstance(size_str, str):
        numbers = re.findall(r"[\d,]+", size_str)
        if numbers:
            return float(numbers[0].replace(",", ""))
    return np.nan


def clean_bedrooms(bedrooms_val):
    if isinstance(bedrooms_val, str) and bedrooms_val.lower() == "studio":
        return 0
    try:
        return int(bedrooms_val)
    except (ValueError, TypeError):
        return np.nan


def extract_location_parts(location_str):
    if not isinstance(location_str, str):
        return "Unknown", "Unknown"
    parts = [part.strip() for part in location_str.split(",")]
    if len(parts) >= 3:
        city = parts[-3]
        state = parts[-2]
        return city, state
    elif len(parts) == 2:
        return parts[0], parts[1]
    elif len(parts) == 1:
        return parts[0], "Unknown"
    return "Unknown", "Unknown"


# --- 3. Apply Cleaning and Create Features ---
df["price_numeric"] = df["price"].apply(clean_price)
df["size_sqft"] = df["size"].apply(clean_size)
df["bedrooms_cleaned"] = df["bedrooms"].apply(clean_bedrooms)
df["bathrooms_cleaned"] = pd.to_numeric(df["bathrooms"], errors="coerce")

location_df = df["location"].apply(extract_location_parts).apply(pd.Series)
location_df.columns = ["city", "state"]
df = pd.concat([df, location_df], axis=1)

df["description"] = df["description"].fillna("")
df["facilities"] = df["facilities"].fillna("")
df.dropna(subset=["price_numeric"], inplace=True)

# --- 4. Prepare Data for Modeling ---
X = df.drop("price_numeric", axis=1)
y = df["price_numeric"]

numerical_features = ["size_sqft", "bedrooms_cleaned", "bathrooms_cleaned"]
categorical_features = ["property_type", "city", "state"]
text_features = "description"
facility_features = "facilities"

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# --- 5. Build the Advanced Preprocessing Pipeline ---
# This preprocessor will be used by all models
numeric_transformer = Pipeline(
    steps=[("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]
)

categorical_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numerical_features),
        ("cat", categorical_transformer, categorical_features),
        (
            "text",
            TfidfVectorizer(max_features=100, stop_words="english"),
            text_features,
        ),
        ("fac", TfidfVectorizer(tokenizer=lambda x: x.split(";")), facility_features),
    ],
    remainder="drop",
)

# --- 6. Define Models to Compare ---
models = {
    "Linear Regression": LinearRegression(n_jobs=-1),
    "Random Forest": RandomForestRegressor(random_state=42, n_jobs=-1),
    "XGBoost": xgb.XGBRegressor(random_state=42, n_jobs=-1),
    "LightGBM": lgb.LGBMRegressor(random_state=42, n_jobs=-1),
    "CatBoost": cb.CatBoostRegressor(random_state=42, verbose=0),
}

# --- 7. Train and Evaluate All Models ---
results = {}

for name, model in models.items():
    print(f"\u2699\ufe0f  Training {name}...")
    start_time = time.time()

    # Create the full pipeline with the current model
    model_pipeline = Pipeline(
        steps=[("preprocessor", preprocessor), ("regressor", model)]
    )

    # Train the model
    model_pipeline.fit(X_train, y_train)

    # Make predictions
    y_pred = model_pipeline.predict(X_test)

    # Calculate metrics
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    end_time = time.time()

    # Store results
    results[name] = {
        "R-squared (R�)": r2,
        "Mean Absolute Error (MAE)": mae,
        "Training Time (s)": end_time - start_time,
    }
    print(f"\u2705 {name} trained in {end_time - start_time:.2f} seconds.")

# --- 8. Display Final Comparison ---
results_df = pd.DataFrame(results).T
results_df = results_df.sort_values(by="Mean Absolute Error (MAE)", ascending=True)

print("\n\n--- Final Model Performance Comparison ---")
print(results_df)
print("\n--- Conclusion ---")
print(
    f"\U0001f3c6 The best performing model is '{results_df.index[0]}' with an MAE of RM {results_df.iloc[0]['Mean Absolute Error (MAE)']:.2f} and an R� of {results_df.iloc[0]['R-squared (R�)']:.2f}."
)
