import pandas as pd
import numpy as np
import re
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# --- 1. Load Data ---
try:
    df = pd.read_csv("dataset.csv")
    print("✅ Dataset loaded successfully.")
except FileNotFoundError:
    print(
        "❌ Error: dataset.csv not found. Please ensure the file is in the same directory."
    )
    exit()

# --- 2. Data Cleaning and Feature Engineering Functions ---


# NEW: Define a named function to handle facility splitting
def split_facilities(facility_string):
    """Custom tokenizer to split the facilities string by semicolon."""
    if isinstance(facility_string, str):
        return [facility.strip() for facility in facility_string.split(";")]
    return []


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

# --- 4. Prepare Data and Preprocessing Pipeline ---
X = df.drop("price_numeric", axis=1)
y = df["price_numeric"]

# Split data to evaluate the final model's performance
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

numerical_features = ["size_sqft", "bedrooms_cleaned", "bathrooms_cleaned"]
categorical_features = ["property_type", "city", "state"]
text_features = "description"
facility_features = "facilities"

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
        # UPDATED: Use the named function instead of the lambda
        ("fac", TfidfVectorizer(tokenizer=split_facilities), facility_features),
    ],
    remainder="drop",
)

# --- 5. Define and Train the Final RandomForest Model ---
# We create the final pipeline with our winning model
final_model_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(random_state=42, n_jobs=-1)),
    ]
)

print("\n⚙️  Training the final Random Forest model on the full training data...")
final_model_pipeline.fit(X_train, y_train)
print("✅ Final model training complete.")

# --- 6. Evaluate the Final Model ---
y_pred = final_model_pipeline.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\n--- Final Model Performance ---")
print(f"Mean Absolute Error (MAE): RM {mae:.2f}")
print(f"R-squared (R²): {r2:.2f}")
print("-----------------------------")

# --- 7. Save the Model to a File ---
# The model is saved to a file for later use in predictions.
# The .joblib file contains the entire pipeline (preprocessor + model).
MODEL_FILENAME = "property_price_model.joblib"
print(f"\n💾 Saving the final model to '{MODEL_FILENAME}'...")
joblib.dump(final_model_pipeline, MODEL_FILENAME)
print(f"✅ Model saved successfully.")

# --- 8. Example: How to Load and Use the Model ---
print("\n--- Prediction Example ---")
# Load the model from the file
loaded_model = joblib.load(MODEL_FILENAME)
print("Model loaded successfully.")

# Create new, unseen data for prediction
# This must be a DataFrame with the same columns as the original training data
new_data = pd.DataFrame(
    {
        "size": ["1,200 Sqft"],
        "bedrooms": [3],
        "bathrooms": [2],
        "property_type": ["Condo"],
        "location": ["Mont Kiara, Kuala Lumpur, Malaysia"],
        "description": [
            "A beautiful fully furnished condo with a great view, near the city center."
        ],
        "facilities": ["Pool Access; Gym; 24-hour Security"],
        # Other original columns can be omitted if they are not used as features
    }
)

# FIXED: Apply the same feature engineering to the new data
print("Processing new data for prediction...")
new_data["size_sqft"] = new_data["size"].apply(clean_size)
new_data["bedrooms_cleaned"] = new_data["bedrooms"].apply(clean_bedrooms)
new_data["bathrooms_cleaned"] = pd.to_numeric(new_data["bathrooms"], errors="coerce")
new_location_df = new_data["location"].apply(extract_location_parts).apply(pd.Series)
new_location_df.columns = ["city", "state"]
new_data = pd.concat([new_data, new_location_df], axis=1)

# Use the loaded model to make a prediction
predicted_price = loaded_model.predict(new_data)
print(f"\nPredicted price for the new property: RM {predicted_price[0]:.2f}/mo")
print("--------------------------")
