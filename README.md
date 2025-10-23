### **Rentverse: Full-Stack Property Rental & Management Platform**

**Submission for the Rentverse Challenge**
**Team**: [Amoeba]
**Submission Date**: September 21, 2025

---

### **1. Introduction**

Rentverse is a modern, full-stack property rental platform designed to streamline the entire lifecycle of a property listing—from creation and pricing to booking and legal contract signing. Built on a robust microservices architecture, the application provides a seamless and intuitive experience for three key user roles: Tenants, Property Owners, and Administrators.

Our platform stands out by integrating advanced features like an **AI-powered price simulator** to help owners set competitive rates and a secure, automated **e-signature workflow** powered by the DocuSign API, making property rental simpler, smarter, and more secure for everyone involved.

### **Key Features**

- **Role-Based Access Control**: Tailored dashboards and functionalities for Tenants, Property Owners, and Admins.
- **AI-Powered Price Simulator**: Real-time price suggestions for property owners based on a machine learning model trained on real-world data.
- **End-to-End Booking Flow**: A complete workflow from a tenant's booking request to the owner's approval.
- **DocuSign E-Signature Integration**: Automated generation and sending of tenancy agreements for legally binding electronic signatures.
- **Admin Approval System**: A secure dashboard for administrators to review and approve new property listings.
- **Advanced Search & Filtering**: A powerful public-facing marketplace for tenants to find properties.

### **Tech Stack & Architecture**

Rentverse is built as a monorepo with a microservices architecture, orchestrated with Docker Compose.

| Service                  | Technology Stack                                 | Description                                                             |
| :----------------------- | :----------------------------------------------- | :---------------------------------------------------------------------- |
| **`frontend`**           | Next.js, React, TypeScript, Tailwind CSS         | The main user-facing web application.                                   |
| **`core-service`**       | Node.js, Express, TypeScript, Prisma, PostgreSQL | The primary backend API for handling users, properties, and agreements. |
| **`prediction-service`** | Python, FastAPI, Scikit-learn, Pandas            | An AI service that provides property price predictions.                 |
| **`scraper-service`**    | Python, Selenium, Beautiful Soup                 | A utility service for collecting training data for the ML model.        |

---

### **2. How-to-Use Instructions (Local Setup)**

Follow these steps to get the entire Rentverse application running on your local machine.

### **Prerequisites**

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation) package manager

### **Step 1: Clone the Repository**

```bash
git clone [https://github.com/dean131/rentverse-app]
cd rentverse-app
```

### **Step 2: Configure Environment Variables**

You will need to create a `.env` file for the `core-service`.

1.  Navigate to the `apps/core-service` directory.
2.  Copy the example environment file:

<!-- end list -->

```bash
cp .env.example .env
```

3.  Open the new `.env` file and fill in your secret keys for the database, JWT, and the DocuSign API credentials you obtained.

### **Step 3: Run the Application**

From the **root directory** of the project (`rentverse-app`), run the following command:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This command will:

1.  Build the Docker images for the `frontend`, `core-service`, and `prediction-service`.
2.  Start all the necessary containers, including the PostgreSQL database.
3.  Set up live reloading, so any changes you make to the code will automatically restart the relevant service.

### **Step 4: Access the Services**

Once all containers are running, you can access the different parts of the application:

- **Frontend / Main Website**: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
- **Backend Core API**: [http://localhost:8080/api](https://www.google.com/search?q=http://localhost:8080/api)
- **Prediction API**: [http://localhost:8000](https://www.google.com/search?q=http://localhost:8000)

---

### **3. Special Features Explanation**

### **AI-Powered Price Simulator**

This feature provides property owners with real-time, data-driven price suggestions as they fill out the property submission form, helping them set competitive market rates.

**How it works:**

1.  **Data Collection**: We built a sophisticated web scraper using Python and Selenium to collect thousands of real-world property listings from public websites like `fazwaz.my`.
2.  **Data Cleaning**: A dedicated Python script cleans this raw data, parsing prices, sizes, and locations, and saves it into a structured CSV file.
3.  **Model Training**: We then use this clean data to train several machine learning models. Our script compares their performance and automatically selects the best one (a `RandomForestRegressor` in our case, with an R² score of 0.83). The trained model is saved to a file.
4.  **Prediction API**: A FastAPI server loads the saved model and exposes a `/predict` endpoint.
5.  **Frontend Integration**: The property submission form watches for changes in key fields. Using a debounced request, it calls the prediction API and displays the suggested price to the user in real time.

### **DocuSign E-Signature Integration**

This feature automates the entire contract signing process, providing a secure and legally binding workflow.

**How it works:**

1.  **Tenant Request**: A tenant requests to book a property, creating a `TenancyAgreement` in our database with a `PENDING_OWNER_APPROVAL` status.
2.  **Owner Approval**: The property owner reviews the request in their dashboard and clicks "Approve."
3.  **Envelope Creation**: This triggers a call to our `DocusignService` on the backend. The service:
    - Generates an HTML tenancy agreement with all the relevant details.
    - Uses the DocuSign eSignature API to create an "envelope" with this document and defines the two signers (owner and tenant).
    - Sends the envelope, which causes DocuSign to email both parties.
    - Saves the unique `envelopeId` to our database.
4.  **Signing Ceremony**: Users can click a "Sign Document" button in their dashboard. This calls another backend endpoint that generates a secure, one-time URL for the DocuSign signing interface, which is then loaded for the user.
5.  **Webhook Confirmation**: Once both parties have signed, DocuSign sends a notification to our public webhook (`/api/webhooks/docusign`). Our backend verifies the request using an HMAC signature and then automatically updates the agreement's status to `ACTIVE`.

---

### **4. Submission Links**


- **GitHub Repository**: https://github.com/dean131/rentverse-app
- **Presentation**: https://www.canva.com/design/DAGyXgrHnfk/gKBoBam0-7xR6QZrQM9OqQ/edit
- **Figma**: https://www.figma.com/design/ZZ3fkpjjuwtTEElaDDrWr2/MetaAirflow-x-USH?node-id=0-1&t=BI3tS3dOKX1tlJ7L-1
