### Special Features (Current Implementation)

Rentverse is more than just a standard property listing website. We have engineered a full-stack, multi-service platform with a focus on solving real-world problems through advanced technology. Our two most significant special features are the AI-Powered Price Simulator and the End-to-End E-Signature Flow with DocuSign.

#### 1. AI-Powered Price Simulator

This feature provides property owners with real-time, data-driven price suggestions as they fill out the property submission form, helping them set competitive market rates.

**How it works:**

- **Data Collection**: We built a sophisticated web scraper using Python and Selenium to collect thousands of real-world property listings.
- **Data Cleaning**: A dedicated Python script cleans this raw data, parsing prices, sizes, and locations into a structured, analysis-ready CSV file.
- **Model Training**: We use this clean data to train several machine learning models. Our script compares their performance and automatically selects the best one (a `RandomForestRegressor` in our case, with an R� score of 0.83).
- **Prediction API**: A FastAPI server loads the saved model and exposes a `/predict` endpoint.
- **Frontend Integration**: The submission form calls this API in real-time to display the suggested price to the user.

#### 2. End-to-End E-Signature Flow with DocuSign

This feature automates the entire contract signing process, providing a secure and legally binding workflow.

**How it works:**

- **Booking & Approval**: A tenant requests to book a property, and the owner approves the request in their dashboard.
- **Envelope Creation**: The owner's approval triggers our backend `DocusignService`, which generates an HTML tenancy agreement and uses the DocuSign API to create a secure "envelope" for signing.
- **Signing Ceremony**: Users click a "Sign Document" button in their dashboard. Our backend generates a secure, one-time URL that redirects them to the DocuSign signing interface.
- **Webhook Confirmation**: Once both parties have signed, DocuSign sends a notification to our secure webhook. Our backend verifies the request and automatically updates the agreement's status to `ACTIVE`.

---

### Future Features (Roadmap)

The current Rentverse platform is a powerful MVP. Here are three key features we would prioritize next to further enhance its value.

1.  **Integrated Payment Gateway**: The most logical next step is to integrate a secure payment gateway (like **Midtrans** or **Xendit** for the Indonesian market). This would allow tenants to pay deposits and monthly rent directly through the platform, creating a complete transactional experience.

2.  **In-App Messaging System**: To keep all communication centralized and secure, we would build a real-time chat feature. This would allow tenants and property owners to discuss details, schedule viewings, or handle maintenance requests directly within the Rentverse app.

3.  **A Reviews and Ratings System**: Trust is the most important currency in the rental market. We would implement a two-way review system where tenants and owners can rate each other after a tenancy period ends. This would help good users build a positive reputation and foster a safer, more transparent community.
