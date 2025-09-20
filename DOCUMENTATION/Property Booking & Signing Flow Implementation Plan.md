# Rentverse: Property Booking & DocuSign Integration Plan

**Version:** 1.0  
**Date:** September 20, 2025

## 1. Objective

To implement a complete, end-to-end property booking and contract signing workflow within the Rentverse application. This feature will allow tenants to request a booking for a property, property owners to approve or reject these requests, and both parties to legally sign the tenancy agreement electronically using the DocuSign API.

## 2. User Flow Summary

1.  A **Tenant** finds a property and submits a booking request with their desired dates.
2.  The **Property Owner** receives a notification and reviews the request in their dashboard.
3.  The **Owner** approves the request.
4.  The system generates a tenancy agreement and sends it to both parties for e-signature via DocuSign.
5.  Both **Tenant** and **Owner** complete the signing process through the DocuSign interface.
6.  Once fully signed, the agreement becomes active, and the booking is confirmed.

---

## 3. Implementation Steps

This feature will be built in phases, starting with the backend database and API, followed by the frontend user interface.

### Phase 1: Database Schema Update (`core-service`)

The foundation of this feature is the `TenancyAgreement` model.

- **Action**: Update the `schema.prisma` file to include the new `TenancyAgreement` model and the `TenancyStatus` enum.
- **Model Details**:
  - `id`: Unique identifier for the agreement.
  - `status`: Tracks the current state of the agreement (e.g., `PENDING_OWNER_APPROVAL`, `ACTIVE`).
  - `startDate` / `endDate`: The period of the tenancy.
  - `rentAmount`: The agreed-upon rental price.
  - `propertyId`, `ownerId`, `tenantId`: Foreign keys linking the agreement to the property and the two users involved.
  - `docusignEnvelopeId`: A crucial field to store the unique ID from DocuSign for tracking the signing status.
- **Next Step**: Run a new database migration to apply these changes.
  ```bash
  npx prisma migrate dev --name add_tenancy_agreements
  ```

### Phase 2: Backend API Development (`core-service`)

We will create a new `agreements` module in our `core-service` to handle all business logic.

- **Action**: Create a new set of files: `agreements.repository.ts`, `agreements.service.ts`, `agreements.controller.ts`, and `agreements.routes.ts`.
- **API Endpoints to Create**:
  1.  `POST /api/agreements` (Tenant):
      - **Action**: A tenant initiates a booking request for a specific property.
      - **Logic**: Validates input (property exists, dates are valid), creates a new `TenancyAgreement` record with `PENDING_OWNER_APPROVAL` status.
  2.  `GET /api/agreements/my-agreements` (Authenticated Users):
      - **Action**: Fetches a list of all agreements for the logged-in user (both as an owner and as a tenant).
  3.  `PATCH /api/agreements/:id/approve` (Property Owner):
      - **Action**: An owner approves a pending request.
      - **Logic**: Updates the agreement status. This will trigger the DocuSign integration.
  4.  `PATCH /api/agreements/:id/reject` (Property Owner):
      - **Action**: An owner rejects a pending request.
      - **Logic**: Updates the agreement status to `OWNER_REJECTED`.

### Phase 3: DocuSign Integration (`core-service`)

This is the core of the e-signature functionality and will be handled within the `AgreementsService`.

- **Prerequisites**:
  - Create a DocuSign developer (sandbox) account.
  - Obtain API credentials (Integration Key, User ID, Account ID, RSA Private Key).
  - Store these credentials securely as environment variables in the `.env` file.
- **Integration Steps**:
  1.  **Trigger**: The integration is triggered when an owner approves a booking request.
  2.  **Document Generation**: Create a simple HTML or PDF template for the tenancy agreement. The service will dynamically populate this template with user and property details.
  3.  **Create DocuSign Envelope**:
      - Use the DocuSign eSignature REST API client.
      - Create a new "envelope" containing the generated document.
      - Define the signers (tenant and owner) and place signature tabs in the document.
  4.  **Send Envelope**: Send the envelope. DocuSign will email both parties with a link to sign.
  5.  **Track Status**: Save the returned `envelopeId` from DocuSign into our `docusignEnvelopeId` field in the database.
  6.  **Webhook Handling**:
      - Create a new endpoint: `POST /api/webhooks/docusign`.
      - Configure this URL in your DocuSign account to receive real-time updates.
      - When DocuSign sends a notification that an envelope is `Completed` (signed by all parties), this endpoint will find the corresponding `TenancyAgreement` by its `envelopeId` and update its status to `ACTIVE`.

### Phase 4: Frontend UI Development (`frontend`)

We will build the user interface to support the entire booking flow.

- **Property Detail Page**:
  - Add a "Request to Book" button.
  - This button will open a modal where the tenant can select their desired start and end dates.
- **User Dashboard**:
  - Create a new "My Agreements" page accessible from the dashboard sidebar.
  - This page will call the `GET /api/agreements/my-agreements` endpoint.
  - It will display a list of all the user's agreements, showing the property details and the current status.
  - For owners, it will show "Approve" and "Reject" buttons on pending requests.
  - For both parties, it will show a "Sign Document" button for agreements in the `PENDING_SIGNATURES` state.
- **Signing Ceremony**:
  - When a user clicks "Sign Document," we will fetch a unique signing URL for that user from the DocuSign API.
  - For the best user experience, we will embed the DocuSign signing interface directly into our application.
