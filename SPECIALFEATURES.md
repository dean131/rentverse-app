Of course. It's a great idea to have a dedicated document that explains the most innovative and complex parts of your project. This will be very impressive for your final submission.

Here is a detailed explanation of the special features we've built for the Rentverse application.

---

### **Rentverse: Special Features Explanation**

Rentverse is more than just a standard property listing website. We have engineered a full-stack, multi-service platform with a focus on solving real-world problems through advanced technology. Our two most significant special features are the AI-Powered Price Simulator and the End-to-End E-Signature Flow with DocuSign.

### 1. AI-Powered Price Simulator

This feature is a key differentiator, providing immense value to property owners by helping them set competitive and fair prices for their listings. Instead of guessing, owners get real-time, data-driven suggestions directly within the submission form.

**How it works:**
The entire feature is powered by a complete, end-to-end data science pipeline that we built from scratch:

- **Data Collection**: We built a sophisticated web scraper using **Python** and **Selenium** to collect thousands of real-world property listings from public websites like `fazwaz.my`. This ensures our model is trained on recent and relevant market data.

- **Data Cleaning**: A dedicated Python script cleans this raw data using the **Pandas** library. This script standardizes prices (e.g., converting "RM 1,200/mo" to `1200`), parses features (e.g., "1,645 Sqft" to `1645`), and engineers a consistent location feature, saving the output to a clean, analysis-ready CSV file.

- **Model Training & Selection**: To ensure we used the best algorithm, we implemented a "model bake-off." Our training script automatically trains and evaluates several industry-standard models (like Linear Regression and Gradient Boosting). It then compares their performance and selects the best one. For our dataset, the **Random Forest Regressor** was the clear winner, achieving a high **R² score of 0.83**. This means our model can explain 83% of the price variance, making it highly effective. The script then saves the trained model for use in our API.

- **Prediction API**: We built a lightweight, high-performance API using **Python** and **FastAPI**. When this service starts, it loads our trained machine learning model. It exposes a simple `/predict` endpoint that receives property details (like size, bedrooms, location) and instantly returns a price prediction.

- **Frontend Integration**: The user experience is seamless. As a property owner fills out the submission form, the frontend "watches" the relevant fields. Using a debounced request to prevent spamming, it calls our prediction API and displays the suggested price directly in the UI, complete with an "Apply" button to use the suggestion.

### 2. End-to-End E-Signature Flow with DocuSign

This feature transforms Rentverse from a simple listing site into a true transaction platform by automating the entire contract signing process. This provides security, convenience, and legal validity to the agreements made between tenants and owners.

**How it works:**
The workflow is fully automated and integrated across our services:

- **Booking Initiation**: A logged-in tenant can request to book a property directly from the detail page. This creates a `TenancyAgreement` in our database with a `PENDING_OWNER_APPROVAL` status.

- **Owner Approval & Envelope Creation**: The property owner sees this request in their "My Agreements" dashboard. When they click "Approve," it triggers the `DocusignService` on our backend. This service:
  1.  Dynamically generates a legal tenancy agreement in HTML with all the relevant details (names, dates, price, property address).
  2.  Uses the DocuSign eSignature API to create a secure "envelope" containing this document.
  3.  Defines the two signers (owner and tenant), including where they need to sign, and sends the envelope. This causes DocuSign to email both parties, notifying them that a document is ready for their signature.
  4.  Saves the unique `envelopeId` from DocuSign to our database to track the signing status.

- **Embedded Signing Ceremony**: Users don't have to leave our platform. When they click "Sign Document" in their dashboard, our backend calls the DocuSign API to generate a secure, one-time URL. The user is then seamlessly redirected to this URL to review and sign the document in an embedded interface.

- **Webhook Confirmation**: The final step is fully automated. We configured a **webhook** in our DocuSign account. Once both parties have signed, DocuSign sends a real-time notification to a secure endpoint on our backend (`/api/webhooks/docusign`). Our backend verifies the request's authenticity using an HMAC signature and then automatically updates the agreement's status in our database to `ACTIVE`, finalizing the booking.
