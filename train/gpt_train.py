import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

# === Load dataset ===
df = pd.read_csv("properties_cleaned.csv")

# Features and target
X = df.drop("price", axis=1)
y = df["price"]

# Log-transform target (to reduce skewness)
y_log = np.log1p(y)

# Identify categorical and numerical columns
cat_cols = ["location", "listing_type", "property_type"]
num_cols = ["area_sqft", "bedrooms", "bathrooms"]

# Preprocessor: OneHotEncode categorical, keep numerical as is
preprocessor = ColumnTransformer(
    [
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ("num", "passthrough", num_cols),
    ]
)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_log, test_size=0.2, random_state=42
)

# Define models
models = {
    "Linear Regression": LinearRegression(),
    "Decision Tree": DecisionTreeRegressor(random_state=42),
    "Random Forest": RandomForestRegressor(random_state=42, n_jobs=-1),
    "Gradient Boosting": GradientBoostingRegressor(random_state=42),
}

# Evaluate models
results = []
for name, model in models.items():
    pipeline = Pipeline([("preprocessor", preprocessor), ("model", model)])
    pipeline.fit(X_train, y_train)
    preds_log = pipeline.predict(X_test)

    # Convert back from log-scale
    preds = np.expm1(preds_log)
    y_true = np.expm1(y_test)

    rmse = np.sqrt(mean_squared_error(y_true, preds))
    mae = mean_absolute_error(y_true, preds)
    r2 = r2_score(y_true, preds)

    results.append({"Model": name, "RMSE": rmse, "MAE": mae, "R2": r2})

# Results DataFrame
results_df = pd.DataFrame(results).sort_values(by="RMSE")
print(results_df)
