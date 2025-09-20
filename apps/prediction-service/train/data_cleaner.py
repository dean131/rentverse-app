# File Path: apps/prediction-service/data_cleaner.py
import pandas as pd
import re


def parse_price(price_str):
    """Extracts the numeric value from a price string."""
    if not isinstance(price_str, str):
        return None
    price_numeric_str = re.sub(r"[^\d.]", "", price_str.split("/")[0])
    if price_numeric_str:
        return float(price_numeric_str)
    return None


def parse_size(size_str):
    """Extracts the numeric value from a size string."""
    if not isinstance(size_str, str):
        return None
    match = re.search(r"([\d,]+)", size_str)
    if match:
        return float(match.group(1).replace(",", ""))
    return None


def clean_dataframe(df, listing_type):
    """Applies cleaning functions to a dataframe."""
    print(f"Cleaning {listing_type} data...")
    df["listing_type"] = listing_type

    # Apply parsing functions to create new, clean columns
    df["price_cleaned"] = df["price"].apply(parse_price)
    df["size_sqft_cleaned"] = df["size"].apply(parse_size)
    df["bedrooms_cleaned"] = df["bedrooms"].replace("Studio", 1)
    df["bedrooms_cleaned"] = pd.to_numeric(df["bedrooms_cleaned"], errors="coerce")
    df["bathrooms_cleaned"] = pd.to_numeric(df["bathrooms"], errors="coerce")
    df["location_primary"] = df["location"].str.split(",").str[0].str.strip()

    # CORRECTED: Select only the new, cleaned columns with the correct names
    df_final = df[
        [
            "price_cleaned",
            "size_sqft_cleaned",
            "bedrooms_cleaned",
            "bathrooms_cleaned",
            "location_primary",
            "listing_type",
            "property_type",
        ]
    ].copy()

    # Rename columns to their final, simple names
    df_final.columns = [
        "price",
        "area_sqft",
        "bedrooms",
        "bathrooms",
        "location",
        "listing_type",
        "property_type",
    ]

    df_final.dropna(inplace=True)
    return df_final


def main():
    """Loads, cleans, combines, and saves the property datasets."""
    print("Starting data cleaning process...")
    try:
        df_rent = pd.read_csv("dataset_for_rent.csv")
        df_sale = pd.read_csv("dataset_for_sale.csv")
    except FileNotFoundError as e:
        print(f"Error: {e}.")
        return

    rent_cleaned = clean_dataframe(df_rent, "rent")
    sale_cleaned = clean_dataframe(df_sale, "sale")

    combined_df = pd.concat([rent_cleaned, sale_cleaned], ignore_index=True)

    output_filename = "properties_cleaned.csv"
    combined_df.to_csv(output_filename, index=False)

    print(
        f"\nData cleaning complete! Saved {len(combined_df)} properties to '{output_filename}'"
    )
    print("Dataset preview:")
    print(combined_df.head())


if __name__ == "__main__":
    main()
