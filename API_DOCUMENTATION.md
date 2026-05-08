# Grievance Portal API Documentation

This document outlines the available endpoints for the Grievance Portal API, including authentication, department management, and complaint handling.

## Base URL
All API endpoints are prefixed with: `http://localhost:<PORT>/api` (e.g., `http://localhost:5000/api`)

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register a New Citizen
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new citizen user.
- **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Responses**:
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: If any fields are missing or a user with the email already exists.

### 1.2 Login User
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user and returns a JSON Web Token (JWT) for subsequent authenticated requests.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Responses**:
  - `200 OK`: Returns the token and user details.
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "userId": 1,
      "fullName": "John Doe",
      "role": "Citizen"
    }
    ```
  - `400 Bad Request`: Invalid email or password.

---

## 2. Department Endpoints (`/api/departments`)

### 2.1 Get All Departments
- **Endpoint**: `GET /departments`
- **Description**: Retrieves a list of all available departments in alphabetical order.
- **Authentication**: None required.
- **Responses**:
  - `200 OK`:
    ```json
    [
      {
        "departmentId": 1,
        "departmentName": "Public Works"
      },
      ...
    ]
    ```

---

## 3. Complaint Endpoints (`/api/complaints`)

### 3.1 Submit a Complaint
- **Endpoint**: `POST /complaints`
- **Description**: Submits a new grievance/complaint. 
- **Authentication**: Required (Citizen). Include `Authorization: Bearer <token>` in headers.
- **Request Body**:
  ```json
  {
    "departmentId": 1,
    "title": "Pothole on Main St",
    "description": "There is a large pothole near the intersection."
  }
  ```
- **Responses**:
  - `201 Created`: Returns a unique tracking number.
    ```json
    {
      "trackingNumber": "GRV-20231027-A1B2",
      "message": "Complaint filed successfully"
    }
    ```

### 3.2 Track a Complaint
- **Endpoint**: `GET /complaints/track/:trackingNumber`
- **Description**: Retrieves the details and current status of a specific complaint using its tracking number.
- **Authentication**: None required (Publicly accessible).
- **Responses**:
  - `200 OK`:
    ```json
    {
      "trackingNumber": "GRV-20231027-A1B2",
      "title": "Pothole on Main St",
      "departmentName": "Public Works",
      "citizenName": "John Doe",
      "description": "There is a large pothole...",
      "submittedAt": "2023-10-27T10:00:00Z",
      "updatedAt": "2023-10-27T10:00:00Z",
      "status": "Pending"
    }
    ```
  - `404 Not Found`: Complaint not found with this tracking number.

### 3.3 Get All Complaints (Admin Only)
- **Endpoint**: `GET /complaints`
- **Description**: Retrieves a list of all submitted complaints, sorted by submission date (newest first).
- **Authentication**: Required (Admin only). Include `Authorization: Bearer <token>` in headers.
- **Responses**:
  - `200 OK`: Array of all complaints with full details.

### 3.4 Update Complaint Status (Admin Only)
- **Endpoint**: `PATCH /complaints/:id/status`
- **Description**: Updates the status of a specific complaint. `:id` is the internal `complaint_id`, not the tracking number.
- **Authentication**: Required (Admin only). Include `Authorization: Bearer <token>` in headers.
- **Request Body**:
  ```json
  {
    "status": "InProgress" 
  }
  ```
  *(Valid statuses: `Pending`, `InProgress`, `Resolved`)*
- **Responses**:
  - `200 OK`: Status updated successfully.
  - `400 Bad Request`: If the status provided is invalid.
  - `404 Not Found`: Complaint not found.
