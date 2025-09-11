# API Contract Documentation: RENTVERSE Project

**Version: 2.3**
**Date: September 10, 2025**
**Status: Approved for Implementation**

---

## 1. Introduction

### 1.1. Document Purpose

This document is the single source of truth for all API interactions within the RENTVERSE ecosystem. It provides a strict definition for every endpoint, including methods, request structures, and response schemas. Its purpose is to enable parallel development between frontend and backend teams and minimize integration errors.

### 1.2. Specification Format

This specification is written using **OpenAPI Specification (OAS) v3.0.0** in **YAML** format for human readability.

---

## 2. OpenAPI Specification (Version 2.3)

This specification reflects the expanded feature set, now including geolocation, payment periods, property views, and nearby facilities.

```yaml
openapi: "3.0.0"
info:
  title: RENTVERSE API v2.3
  description: A comprehensive API for the RENTVERSE platform, supporting an expanded feature set including geolocation, property views, and automated discovery of nearby facilities.
  version: 2.3.0
servers:
  - url: http://localhost:8080/api
    description: Local Development Server via API Gateway

paths:
  # --- Authentication & User Management ---
  /auth/register:
    post:
      summary: Register a new user
      tags: [Authentication]
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserRegister"
      responses:
        "201":
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserResponse"
        "409":
          description: Email already exists
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /auth/login:
    post:
      summary: Log in a user
      tags: [Authentication]
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserLogin"
      responses:
        "200":
          description: Login successful, returns access token
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/LoginResponse"
        "401":
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
  /users/me:
    get:
      summary: Get current user's profile
      tags: [Users]
      operationId: getCurrentUser
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: User profile data
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserResponse"
    patch:
      summary: Update current user's profile
      tags: [Users]
      operationId: updateCurrentUser
      security: [{ bearerAuth: [] }]
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserProfileUpdate"
      responses:
        "200":
          description: Profile updated successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/UserResponse"

  # --- Property & Project Management ---
  /projects:
    get:
      summary: Get all projects for auto-fill
      tags: [Projects]
      operationId: getAllProjects
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: A list of projects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/ProjectSummary"
  /properties:
    get:
      summary: Get all approved properties (for public view)
      tags: [Properties]
      operationId: getPublicProperties
      responses:
        "200":
          description: A list of public properties
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/PropertySummary"
    post:
      summary: Submit a new property listing
      tags: [Properties]
      operationId: createProperty
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PropertyCreate"
      responses:
        "201":
          description: Property submitted for approval
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PropertyDetailed"
  /properties/{id}:
    get:
      summary: Get details for a single property
      tags: [Properties]
      operationId: getPropertyById
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: Detailed property information
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PropertyDetailed"
        "404":
          description: Property not found

  # --- NEW: Endpoints for Property Attributes ---
  /views:
    get:
      summary: Get all available property view types
      tags: [Attributes]
      operationId: getAllViews
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: A list of available views
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/ViewResponse"
  /properties/{id}/nearby-facilities:
    get:
      summary: Get nearby facilities for a specific property
      tags: [Properties]
      operationId: getNearbyFacilities
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: A list of nearby facilities, grouped by category
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/NearbyFacilityCategory"

  # --- Admin Endpoints ---
  /admin/properties/pending:
    get:
      summary: Get all properties awaiting approval
      tags: [Admin]
      operationId: getPendingPropertiesAdmin
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: A list of pending properties
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/PropertySummary"
        "403":
          description: Forbidden (user is not an Admin)
  /admin/properties/{id}/status:
    patch:
      summary: Approve or reject a property
      tags: [Admin]
      operationId: updatePropertyStatusAdmin
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/StatusUpdate"
      responses:
        "200":
          description: Property status updated
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PropertyDetailed"

  # --- Engagement & Uploads ---
  /properties/{id}/favorite:
    post:
      summary: Add a property to favorites
      tags: [Favorites]
      operationId: addFavorite
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: Property added to favorites
    delete:
      summary: Remove a property from favorites
      tags: [Favorites]
      operationId: removeFavorite
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      responses:
        "204":
          description: Property removed from favorites
  /properties/{id}/reviews:
    post:
      summary: Submit a review for a property
      tags: [Reviews]
      operationId: createReview
      security: [{ bearerAuth: [] }]
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ReviewCreate"
      responses:
        "201":
          description: Review submitted successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ReviewResponse"
  /uploads/signed-url:
    get:
      summary: Get a secure URL for file uploads
      tags: [Uploads]
      operationId: getSignedUrl
      security: [{ bearerAuth: [] }]
      parameters:
        - in: query
          name: fileName
          required: true
          schema: { type: string }
        - in: query
          name: fileType
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Secure upload URL provided
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SignedUrlResponse"

  # --- Prediction Service ---
  /predict:
    post:
      summary: Predict a rental price
      tags: [Prediction]
      operationId: predictPrice
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/PredictionRequest"
      responses:
        "200":
          description: Successful price prediction
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PredictionResponse"

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    # --- User Schemas ---
    UserRegister:
      type: object
      required: [fullName, email, password, role]
      properties:
        fullName: { type: string, example: "Budi Siregar" }
        email:
          { type: string, format: email, example: "budi.siregar@example.com" }
        password:
          { type: string, format: password, example: "SecurePassword123" }
        role: { type: string, enum: [PROPERTY_OWNER, TENANT] }
    UserLogin:
      type: object
      properties:
        email: { type: string, format: email }
        password: { type: string, format: password }
    LoginResponse:
      type: object
      properties:
        accessToken: { type: string }
    UserResponse:
      type: object
      properties:
        id: { type: integer }
        fullName: { type: string }
        email: { type: string }
        phone: { type: string, nullable: true }
        country: { type: string, nullable: true }
        profilePictureUrl: { type: string, nullable: true }
        role: { type: string, enum: [PROPERTY_OWNER, TENANT, ADMIN] }
    UserProfileUpdate:
      type: object
      properties:
        fullName: { type: string }
        phone: { type: string }
        country: { type: string }

    # --- Property & Project Schemas ---
    ProjectSummary:
      type: object
      properties:
        id: { type: integer }
        projectName: { type: string }
    PropertyCreate:
      type: object
      required:
        [title, listingType, propertyType, sizeSqft, latitude, longitude]
      properties:
        title: { type: string }
        description: { type: string }
        listingType: { type: string, enum: [SALE, RENT, BOTH] }
        propertyType:
          {
            type: string,
            enum: [APARTMENT, HOUSE, PENTHOUSE, STUDIO, COMMERCIAL],
          }
        rentalPrice: { type: number, nullable: true }
        paymentPeriod:
          {
            type: string,
            enum: [MONTHLY, QUARTERLY, BI_ANNUALLY, YEARLY],
            nullable: true,
          }
        salePrice: { type: number, nullable: true }
        maintenanceFee: { type: number, nullable: true }
        sizeSqft: { type: integer }
        bedrooms: { type: integer }
        bathrooms: { type: integer }
        furnishingStatus:
          {
            type: string,
            enum: [UNFURNISHED, PARTIALLY_FURNISHED, FULLY_FURNISHED],
          }
        latitude: { type: number, format: float, example: -6.2088 }
        longitude: { type: number, format: float, example: 106.8456 }
        projectId: { type: integer, nullable: true }
        ownershipDocumentUrl:
          {
            type: string,
            format: uri,
            description: "URL from signed-url endpoint",
          }
        viewIds:
          type: array
          items:
            type: integer
          description: An array of IDs for the selected property views.
          example: [1, 3]
    PropertySummary:
      type: object
      properties:
        id: { type: integer }
        title: { type: string }
        rentalPrice: { type: number, nullable: true }
        salePrice: { type: number, nullable: true }
        bedrooms: { type: integer }
        bathrooms: { type: integer }
        sizeSqft: { type: integer }
        imageUrl: { type: string, format: uri } # Primary image
    PropertyDetailed:
      allOf:
        - $ref: "#/components/schemas/PropertySummary"
        - type: object
          properties:
            description: { type: string }
            listingType: { type: string, enum: [SALE, RENT, BOTH] }
            propertyType:
              {
                type: string,
                enum: [APARTMENT, HOUSE, PENTHOUSE, STUDIO, COMMERCIAL],
              }
            furnishingStatus:
              {
                type: string,
                enum: [UNFURNISHED, PARTIALLY_FURNISHED, FULLY_FURNISHED],
              }
            status:
              {
                type: string,
                enum: [PENDING, APPROVED, REJECTED, RENTED, SOLD],
              }
            images:
              type: array
              items:
                type: object
                properties:
                  id: { type: integer }
                  imageUrl: { type: string }
            reviews:
              type: array
              items:
                $ref: "#/components/schemas/ReviewResponse"
            views:
              type: array
              items:
                $ref: "#/components/schemas/ViewResponse"
    StatusUpdate:
      type: object
      required: [status]
      properties:
        status: { type: string, enum: [APPROVED, REJECTED] }

    # --- New & Modified Schemas ---
    ViewResponse:
      type: object
      properties:
        id: { type: integer }
        name: { type: string }
    NearbyFacility:
      type: object
      properties:
        name: { type: string, example: "Grand Indonesia Mall" }
        distance: { type: string, example: "500m" }
    NearbyFacilityCategory:
      type: object
      properties:
        category: { type: string, example: "Shopping" }
        icon: { type: string, example: "shopping-cart-icon" }
        facilities:
          type: array
          items:
            $ref: "#/components/schemas/NearbyFacility"
    PredictionRequest:
      type: object
      required:
        [sizeSqft, bedrooms, bathrooms, propertyType, latitude, longitude]
      properties:
        sizeSqft: { type: number }
        bedrooms: { type: number }
        bathrooms: { type: number }
        propertyType: { type: string }
        furnishingStatus: { type: string }
        latitude: { type: number, format: float }
        longitude: { type: number, format: float }
    PredictionResponse:
      type: object
      properties:
        predictedPrice: { type: number }
        confidenceScore: { type: number }
        priceRange: { type: array, items: { type: number } }
    ReviewCreate:
      type: object
      required: [rating]
      properties:
        rating: { type: integer, minimum: 1, maximum: 5 }
        comment: { type: string, nullable: true }
    ReviewResponse:
      type: object
      properties:
        id: { type: integer }
        rating: { type: integer }
        comment: { type: string, nullable: true }
        author:
          type: object
          properties:
            fullName: { type: string }
            profilePictureUrl: { type: string, nullable: true }
        createdAt: { type: string, format: date-time }
    SignedUrlResponse:
      type: object
      properties:
        uploadUrl:
          { type: string, description: "The pre-signed URL to PUT the file to" }
        fileUrl:
          {
            type: string,
            description: "The final URL of the file after upload",
          }
    ErrorResponse:
      type: object
      properties:
        message: { type: string }
```

## 3. Key Implementation Notes (Version 2.3)

### 3.1. Authentication Flow

The system uses JWT Bearer Tokens. The client must acquire a token via the /auth/login endpoint and include it in the Authorization: Bearer <token> header for all protected endpoints. The API Gateway will be responsible for validating these tokens.

### 3.2. File Upload Workflow (Pre-signed URL)

To upload files (e.g., ownership documents, profile pictures), the client must follow a two-step process: request a secure link from GET /uploads/signed-url, PUT the file to that URL, and then use the returned fileUrl when submitting the main form data. This enhances security and performance.

### 3.3. Geolocation-Based Automation

The latitude and longitude provided during property creation are critical. They will be used not only for map display but also as the primary input for the Prediction Service and to trigger a background job that automatically populates the NearbyFacilities data for that property.
