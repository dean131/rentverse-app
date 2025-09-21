### **1. Prerequisites**

Before you begin, ensure you have the following software installed on your system:

- **Docker & Docker Compose**: Essential for running the containerized services. You can download it from [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Node.js**: Required for package management. It's recommended to use version 18 or later. You can download it from the [official Node.js website](https://nodejs.org/).
- **pnpm**: The package manager used for this monorepo. You can install it by running `npm install -g pnpm`.

---

### **2. Local Setup and Installation**

This step-by-step guide will walk you through getting the entire Rentverse application running.

**Step 1: Clone the Repository**
First, clone the project's source code from your repository to your local machine.

```bash
git clone https://github.com/dean131/rentverse-app
cd rentverse-app
```

**Step 2: Configure Environment Variables**
The backend `core-service` requires a set of secret keys and configuration variables to run.

1.  Navigate to the `apps/core-service` directory.
2.  You will find a file named `.env.example`. Make a copy of this file and name it `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Now, open the new `.env` file with a text editor. You will need to fill in the following values:
    - `DATABASE_URL`: This is already pre-configured to connect to the PostgreSQL database inside Docker. You usually don't need to change this.
    - `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`: Provide long, random, and secret strings for these. You can use an online password generator to create them.
    - `DOCUSIGN_CLIENT_ID`, `DOCUSIGN_IMPERSONATED_USER_ID`, `DOCUSIGN_ACCOUNT_ID`, `DOCUSIGN_PRIVATE_KEY_BASE64`, `DOCUSIGN_WEBHOOK_SECRET`: Fill these in with the credentials you obtained from your DocuSign developer account.

**Step 3: Build and Run the Application**
The entire multi-service application can be started with a single command. From the **root directory** of the project (`rentverse-app`), run:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This command will:

1.  Build the individual Docker images for the `frontend`, `core-service`, and `prediction-service`.
2.  Start all the necessary containers, including the PostgreSQL database.
3.  Run the database seeder to populate your database with sample users and properties.
4.  Enable live reloading, so any changes you make to the code will automatically restart the relevant service.

**Step 4: Access the Services**
Once all containers are running, you can access the different parts of the application in your web browser:

- **Frontend / Main Website**: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
- **Backend Core API**: [http://localhost:8080/api](https://www.google.com/search?q=http://localhost:8080/api)
- **Prediction API**: [http://localhost:8000](https://www.google.com/search?q=http://localhost:8000)

---

### **3. How to Use the Application**

The database seeder has created three sample users for you to test the different roles. The password for all users is **`password123`**.

**1. Tenant Workflow**

- **Email**: `tenant@rentverse.com`
- **Actions**:
  1.  Go to the homepage at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).
  2.  Click on a property to view its details.
  3.  Click the "Request to Book" button and fill in your desired dates.
  4.  Log in, navigate to your dashboard, and go to the "My Agreements" page to see the status of your request.

**2. Property Owner Workflow**

- **Email**: `owner@rentverse.com`
- **Actions**:
  1.  Log in as the property owner. You will be taken to your dashboard.
  2.  Navigate to the "My Agreements" page to see the booking request from the tenant.
  3.  Click the **"Approve"** button. This will trigger the DocuSign integration, and both you and the tenant will receive an email to sign the contract.
  4.  Click the **"Sign Document"** button on the agreement to be taken to the DocuSign signing ceremony.

**3. Admin Workflow**

- **Email**: `admin@rentverse.com`
- **Actions**:
  1.  Log in as the admin. You will be taken to the admin dashboard.
  2.  Here you can see a list of properties that are pending approval.
  3.  Use the "Approve" or "Reject" buttons to manage the listings. Once a property is approved, it will appear on the public marketplace.
