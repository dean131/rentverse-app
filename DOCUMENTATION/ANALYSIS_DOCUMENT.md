# System Analysis and Design Document: RENTVERSE Project

**Version: 2.3**
**Date: September 10, 2025**
**Status: Approved for Implementation**

---

## 1. Project Summary

### 1.1. Purpose

Project RENTVERSE aims to build a comprehensive, integrated property platform. The application unifies three core functionalities:

1.  **Property Listing Management**: A streamlined workflow for property owners to list properties, including a robust verification and approval process for admins.
2.  **Smart Price Simulator**: A real-time, AI-driven tool to provide data-backed rental price recommendations.
3.  **Automated Agreement Generation**: A system to automatically generate formal rental agreement documents.

### 1.2. Proposed Architecture

The application will be built on a **hybrid microservices architecture**. This model balances initial development speed with long-term scalability by consolidating core business logic into a single `Core Service`, while isolating specialized, resource-intensive tasks (like price prediction and third-party API interactions) into dedicated services or background jobs.

---

## 2. Functional Analysis (User Stories)

This section details the application's features from the perspective of each user role, reflecting the full scope of the redesigned application.

### 2.1. Public User (Unregistered)

- **As a public user**, I want to search and filter properties by location, type, price, and other attributes, so I can find relevant listings quickly.
- **As a public user**, I want to view a property's detail page with a photo gallery, full description, amenities, property views, and a map of nearby facilities, so I can evaluate it thoroughly.

### 2.2. Property Owner (Role: `PROPERTY_OWNER`)

- **As a property owner**, I want to register for an account and log in, so I can access my property management dashboard.
- **As a property owner**, I want to fill out a comprehensive form to list a new property for sale, for rent, or both.
- **As a property owner**, I want to use an **auto-fill** feature based on existing project data to speed up the submission process.
- **As a property owner**, I want to receive a **real-time price suggestion** from a price simulator while filling out the form, so I can set a competitive price.
- **As a property owner**, I want to upload an **ownership document** during submission, so I can get my listing verified and build trust.
- **As a property owner**, I want to view a list of all my submitted properties and their current status (`Pending`, `Approved`, `Rejected`), so I can track my portfolio.
- **As a property owner**, I want to update my personal profile information, including my phone number, country, and profile picture.

### 2.3. Tenant (Role: `TENANT`)

- **As a tenant**, I want to register for an account and log in, so I can interact with the platform's features.
- **As a tenant**, I want to save properties to a **"Favorites"** list, so I can easily revisit them later.
- **As a tenant**, I want to submit a **review and rating** for a property, so I can share my experience with the community.
- **As a tenant**, I want to update my personal profile information.

### 2.4. Admin (Role: `ADMIN`)

- **As an admin**, I want to log in to a secure, dedicated dashboard.
- **As an admin**, I want to view a queue of all properties awaiting approval.
- **As an admin**, I want to review the details of each submission, including the **uploaded ownership document**, to ensure quality and authenticity.
- **As an admin**, I want to **approve** or **reject** property listings to control the content published on the platform.

---

## 3. System Architecture

The system consists of the following key components:

- **Frontend (Next.js)**: A single, responsive user interface for all user roles.
- **API Gateway (Kong)**: The single entry point for all API requests, handling routing, security, and rate limiting.
- **Core Service (Express.js)**: A monolithic service handling the main business logic for Users, Properties, and Documents. This service will also manage background jobs for tasks like discovering nearby facilities.
- **Prediction Service (FastAPI)**: An isolated microservice dedicated to handling AI-powered price predictions.

---

## 4. Database Design

The database will use **PostgreSQL**, managed via the **Prisma ORM**. The design has been updated to support all new features.

### 4.1. Table Schema Summary

The schema includes the following key tables:
| Table Name | Purpose |
| :--- | :--- |
| `Users` | Stores data for all users (`PROPERTY_OWNER`, `TENANT`, `ADMIN`). |
| `Projects` | Master data for property developments (for auto-fill). |
| `Properties` | Core table for individual property listings. |
| `PropertyDocuments`| Stores and tracks verification of ownership documents. |
| `Reviews` | Stores user-submitted ratings and comments. |
| `Favorites` | Manages the relationship between users and their favorited properties. |
| `Views` | Master table for available property views (e.g., "City View"). |
| `PropertyViews` | Links properties to their respective views. |
| `FacilityCategories`| Master table for categories of nearby facilities. |
| `NearbyFacilities`| Stores nearby points of interest for a property, populated automatically. |
| `RentalAgreements`| Stores data for generated rental contracts. |

---

## 5. Technology Stack

| Component                   | Proposed Technology                                   |
| :-------------------------- | :---------------------------------------------------- |
| **Frontend**                | Next.js (React), Tailwind CSS                         |
| **API Gateway**             | Kong                                                  |
| **Core Service**            | Node.js, Express.js, Prisma                           |
| **Prediction Service**      | Python, FastAPI, Scikit-learn                         |
| **Geospatial API**          | Google Places API or OpenStreetMap (via Overpass API) |
| **Database**                | PostgreSQL                                            |
| **Containerization**        | Docker, Docker Compose                                |
| **Deployment (Production)** | Kubernetes                                            |

---

_This document supersedes all previous versions and serves as the primary high-level guide for the project._
