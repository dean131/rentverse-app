### **How to Use the Rentverse Project**

This guide provides step-by-step instructions to get the entire Rentverse application running on a local machine using Docker.

### **1. Prerequisites**

Before you begin, please ensure you have the following software installed on your system:

- **Docker & Docker Compose**: Essential for running our containerized services. You can download it from [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Node.js**: Required for package management. We recommend version 18 or later. You can download it from the [official Node.js website](https://nodejs.org/).
- **pnpm**: The package manager used for this monorepo. You can install it globally by running `npm install -g pnpm`.

---

### **2. Local Setup and Installation**

Follow these steps to get the application running.

**Step 1: Clone the Repository**
First, clone the project's source code from your repository to your local machine and navigate into the project directory.

```bash
git clone [Your GitHub Repository Link]
cd rentverse-app
```

**Step 2: Configure Environment Variables**
Our backend `core-service` requires a set of secret keys to function correctly.

1.  Navigate to the `apps/core-service` directory.
2.  You will find a file named `.env.example`. Make a copy of this file and name it `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Now, open the new `.env` file with a text editor. You will need to fill in the following values:
    - `DATABASE_URL`: This is already pre-configured to connect to the PostgreSQL database inside Docker. You can leave this as is.
    - `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`: Provide long, random, and secret strings for these. You can use an online password generator to create them.
    - `DOCUSIGN_*` variables: Fill these in with the credentials you obtained from your DocuSign developer account. Remember to use the base64 encoded version for your private key.

**Step 3: Build and Run the Application**
The entire multi-service application can be started with a single command. From the **root directory** of the project (`rentverse-app`), run:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This command will:

1.  Build the individual Docker images for the `frontend`, `core-service`, and `prediction-service`.
2.  Start all the necessary containers, including the PostgreSQL database.
3.  Run the database seeder to populate your database with realistic sample users and properties for the demo.
4.  Enable live reloading, so any changes you make to the code will automatically restart the relevant service.

**Step 4: Access the Services**
Once all containers are running, you can access the different parts of the application in your web browser:

- **Frontend / Main Website**: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
- **Backend Core API**: [http://localhost:8080/api](https://www.google.com/search?q=http://localhost:8080/api)
- **Prediction API**: [http://localhost:8000](https://www.google.com/search?q=http://localhost:8000)

---

### **3. Using the Application (Demo Flow)**

The database seeder has created three sample users for you to test the different roles. The password for all users is **`password123`**.

**1. Admin Workflow (Approve a Property)**

- **Email**: `admin@rentverse.com`
- **Actions**:
  1.  Log in as the admin. You will be taken to the admin dashboard.
  2.  You will see a list of properties that are "pending approval."
  3.  Use the "Approve" or "Reject" buttons to manage these listings. Once a property is approved, it will become visible on the public marketplace.

**2. Property Owner Workflow**

- **Email**: `owner@rentverse.com`
- **Actions**:
  1.  Log in as the property owner. You will be taken to your dashboard, which shows an overview of your listings.
  2.  Navigate to the "My Agreements" page to see booking requests from tenants.
  3.  Click the **"Approve"** button on a pending request. This will trigger the DocuSign integration and send signature request emails to both you and the tenant. The status will change to "pending signatures."
  4.  Click the **"Sign Document"** button to be taken to the DocuSign signing ceremony to sign your part of the contract.

**3. Tenant Workflow**

- **Email**: `tenant1@rentverse.com`
- **Actions**:
  1.  Go to the homepage at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) and browse the properties.
  2.  Click on an approved property to view its details.
  3.  Click the "Request to Book" button and fill in your desired dates.
  4.  Log in, navigate to your dashboard, and go to the "My Agreements" page to see the status of your request.
  5.  Once the owner has approved your request, you will see a **"Sign Document"** button. Click it to complete the signing process.
