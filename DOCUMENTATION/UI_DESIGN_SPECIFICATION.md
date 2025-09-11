# Implementation Roadmap: RENTVERSE Project

**Version: 2.3**
**Date: September 10, 2025**
**Status: Approved for Development**

---

## 1. Introduction

### 1.1. Document Purpose

This document outlines the strategic, phased implementation plan for the RENTVERSE project. It breaks down the development process into logical stages, each with clear objectives and deliverables. This roadmap will guide the development team from the initial setup to the final, feature-complete application.

### 1.2. Development Methodology

The project will follow an iterative, **MVP-first (Minimum Viable Product)** approach. We will build and stabilize the core functionality first before layering on more advanced and auxiliary features.

---

## 2. Phased Implementation Plan

### Phase 1: MVP - Core Listing Workflow

**Goal**: To build the absolute essential functionality allowing a `PROPERTY_OWNER` to register, log in, and successfully submit a new property listing with an ownership document.

**Key Tasks**:

1.  **Project Setup**:

    - Establish repositories for each service (`frontend`, `core-service`, `prediction-service`).
    - Initialize the `Core Service` (Express.js) and `Frontend` (Next.js) projects.
    - Configure Docker and Docker Compose for a unified local development environment.

2.  **`Core Service` Development (Backend)**:

    - Implement the full Version 2.3 database schema using Prisma, including all new tables (`PropertyDocuments`, `Views`, etc.).
    - Develop the following core API endpoints:
      - User registration and login (`/auth/register`, `/auth/login`).
      - Secure file upload endpoint (`/uploads/signed-url`).
      - Property submission (`POST /properties`), including logic to create entries in `Properties`, `PropertyDocuments`, and `PropertyViews`.
      - Fetch projects for auto-fill (`GET /projects`) and available views (`GET /views`).

3.  **`Frontend` Development (UI)**:
    - Build the Registration and Login pages based on the Figma designs.
    - Implement the full Property Submission Form component, including:
      - The two-step file upload process for the ownership document.
      - Map integration to capture `latitude` and `longitude`.
      - Dynamic checklists/dropdowns for `views` and other attributes.
    - Integrate the form with all necessary backend APIs.
    - Implement client-side state management for user authentication and form data.

**Expected Outcome for Phase 1**: A functional application where a property owner can create an account and submit a complete, detailed property listing for admin review.

---

### Phase 2: Admin Approval and Verification Workflow

**Goal**: To empower the `ADMIN` role with the tools necessary to moderate and verify new property listings and their associated documents.

**Key Tasks**:

1.  **`Core Service` Updates (Backend)**:

    - Implement role-based authorization middleware to protect admin-only endpoints.
    - Develop the following admin-specific API endpoints:
      - Fetch pending properties (`/admin/properties/pending`).
      - Fetch full details of a single property for review, including its linked documents.
      - Update property status (`PATCH /admin/properties/{id}/status`).
      - _(Future)_ Update document verification status (`/admin/documents/{id}/status`).

2.  **`Frontend` Updates (UI)**:
    - Build the Admin Dashboard page, protected by role-based access.
    - Create a detailed "Review" page where an admin can see all property details and view the uploaded ownership document.
    - Implement the functionality for the "Approve" and "Reject" buttons.

**Expected Outcome for Phase 2**: A complete, end-to-end listing and approval workflow. Admins can now effectively manage the quality and authenticity of content on the platform.

---

### Phase 3: Tenant Engagement and Public Marketplace

**Goal**: To build the features that allow `TENANT` users to interact with the platform and to launch the public-facing property marketplace.

**Key Tasks**:

1.  **`Core Service` Updates (Backend)**:

    - Develop API endpoints for:
      - Adding and removing properties from favorites (`POST` & `DELETE /properties/{id}/favorite`).
      - Submitting reviews (`POST /properties/{id}/reviews`).
      - Fetching public, `APPROVED` properties (`GET /properties`), including support for filtering and pagination.
      - Fetching nearby facilities for a property (`GET /properties/{id}/nearby-facilities`).

2.  **`Frontend` Updates (UI)**:
    - Build the public-facing Homepage and Property Search/Listing pages based on Figma designs.
    - Create the rich, detailed Property View page, displaying all data including images, views, amenities, reviews, and the nearby facilities map.
    - Implement the "Add to Favorites" button and the "My Favorites" page in the user dashboard.
    - Implement the review submission form and the review display section.

**Expected Outcome for Phase 3**: The platform is now a fully interactive marketplace for tenants, with core features for browsing, saving, and reviewing properties.

---

### Phase 4: Integration of Advanced Services and Automation

**Goal**: To integrate the specialized microservices and background automation that complete the full vision of the RENTVERSE platform (Challenge 2 & 3).

**Key Tasks**:

1.  **`Prediction Service` Development (Backend)**:

    - Initialize the FastAPI (Python) project.
    - Train a baseline Machine Learning model for price prediction, using `latitude` and `longitude` as key inputs.
    - Develop and deploy the `/predict` API endpoint.

2.  **Automation & Integration**:

    - In the `Core Service`, implement the background job that triggers on new property creation to fetch and save data for `NearbyFacilities` using a third-party geospatial API.
    - Configure the API Gateway (Kong) to correctly route traffic to all services.
    - Integrate the `/predict` API call into the frontend's Property Submission Form, including a _debounce_ mechanism.

3.  **Agreement Generation (Challenge 3)**:
    - Add logic to the `Core Service` for `RentalAgreement` generation, including PDF creation (e.g., via Puppeteer).
    - Build the UI on the frontend for initiating and managing rental agreements.

**Expected Outcome for Phase 4**: All three core challenges are fully implemented and integrated. The platform now features intelligent pricing, automated data enrichment, and document generation, making it a feature-complete and powerful tool.
