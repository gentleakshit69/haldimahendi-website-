# Frontend Integration Guide

This document is the single source of truth for the frontend team to integrate with the backend API. It will be continually updated as new features and endpoints are developed.

## Base URL

*   **Local Development:** `http://127.0.0.1:8000/api/v1/`

## General Guidelines

*   **Content-Type:** All requests with a body should use `Content-Type: application/json` or `multipart/form-data` for file uploads.
*   **Authentication:** Requires an `Authorization: Bearer <access_token>` header for protected routes.
*   **Errors:** Standard error responses will follow this format:
    ```json
    {
      "error": "Error message description"
    }
    ```

## Required Pages & Components (Frontend Requirements)

Based on the current APIs, the frontend needs the following pages/flows:

1.  **Authentication Flow (Login/Signup Page)**
    *   **Phone Number Input:** A form to enter phone number.
    *   **Send OTP Button:** Triggers `POST /auth/send-otp/`.
    *   **OTP Verification Input:** A form to enter the received 6-digit OTP.
    *   **Verify OTP Button:** Triggers `POST /auth/verify-otp/`. Stores the returned JWT tokens.

2.  **Profile Creation / Onboarding Page**
    *   **Biodata Upload Section:** A drag-and-drop or file upload button for PDF or Images (JPG/PNG).
    *   **Parse Biodata Button:** Triggers `POST /profile/biodata/parse/` with the file.
    *   **Parsed Data Form:** A pre-filled form that shows the extracted JSON (Name, DOB, etc.) and allows the user to edit before final submission.

3.  **Matches / Search Page**
    *   **Search Bar:** For text queries.
    *   **Filters:** Dropdowns for Gender, Religion, etc.
    *   **Search Button:** Triggers `GET /matches/search/` with query params.
    *   **Profile Cards:** Display the search results (Name, Occupation, Location).

4.  **Chat Interface**
    *   **Chat Window:** To display messages in a session.
    *   **Message Input:** To type and send new messages via WebSockets.

---

## Endpoints

### 1. Authentication: Send OTP
*   **Endpoint:** `POST /auth/send-otp/`
*   **Access:** Public
*   **Payload:**
    ```json
    {
      "phone_number": "+1234567890"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "status": "OTP sent successfully."
    }
    ```

### 2. Authentication: Verify OTP
*   **Endpoint:** `POST /auth/verify-otp/`
*   **Access:** Public
*   **Payload:**
    ```json
    {
      "phone_number": "+1234567890",
      "otp": "123456"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "access": "jwt_access_token_string",
      "refresh": "jwt_refresh_token_string",
      "is_new_user": true
    }
    ```

### 3. Parse Biodata
*   **Endpoint:** `POST /profile/biodata/parse/`
*   **Access:** Protected (Requires Bearer Token)
*   **Payload (multipart/form-data):**
    *   `file`: The PDF or image file.
    *   `text` (Optional): Raw text if no file is uploaded.
*   **Response (200 OK):**
    ```json
    {
        "status": "success",
        "raw_extracted_text": "...",
        "structured_data": {
            "full_name": "John Doe",
            "date_of_birth": "1990-01-01",
            "height": "6'0\"",
            "complexion": "Fair",
            "education_level": "B.Tech",
            "occupation": "Software Engineer",
            "family_details": "...",
            "expectations": "..."
        }
    }
    ```

### 3a. View My Profile
*   **Endpoint:** `GET /profile/me/`
*   **Access:** Protected (Requires Bearer Token)
*   **Response (200 OK):**
    ```json
    {
        "profile": {
            "full_name": "John Doe",
            "gender": "Male",
            "hobbies": "Reading, Coding",
            "family_details": "Father is a businessman...",
            "about_me": "Software engineer looking for...",
            "occupation": "Software Engineer"
        },
        "preferences": {
            "min_age": 25,
            "max_age": 30,
            "preferred_religion": "Hindu"
        },
        "photos": [
            {
                "id": "uuid",
                "url": "/media/profile_photos/img.jpg",
                "is_primary": true
            }
        ]
    }
    ```

### 3b. Update My Profile (Detailed Completion)
*   **Endpoint:** `PATCH /profile/me/`
*   **Access:** Protected (Requires Bearer Token)
*   **Payload (multipart/form-data):**
    *   Any profile or preference fields you want to update (e.g. `hobbies`, `family_details`, `min_age`).
    *   `photos`: Multiple file uploads permitted under this key.
*   **Response (200 OK):**
    ```json
    {
        "status": "success",
        "message": "Profile updated successfully"
    }
    ```

### 4. Search Profiles
*   **Endpoint:** `GET /matches/search/`
*   **Access:** Protected (Requires Bearer Token)
*   **Query Params:**
    *   `q` (string): Text query (matches name, occupation, location).
    *   `gender` (string)
    *   `religion` (string)
*   **Response (200 OK):**
    ```json
    {
        "results": [
            {
                "id": "uuid",
                "full_name": "Jane Doe",
                "gender": "Female",
                "religion": "Hindu",
                "occupation": "Doctor",
                "location_city": "Mumbai"
            }
        ]
    }
    ```

### 5. Chat REST APIs
*   **Start or Get Session:** `POST /api/v1/chat/session/`
    *   **Payload:** `{"target_user_id": "uuid-here"}`
*   **Get Chat History:** `GET /api/v1/chat/history/<session_id>/`

### 6. Chat WebSockets
*   **Endpoint:** `ws://127.0.0.1:8000/ws/chat/<session_id>/`
*   **Access:** Protected (Requires user authentication - usually via cookies/session in local dev, or token sent in headers if supported by WS client).
*   **Send Message Payload:**
    ```json
    {
      "message_content": "Hello!"
    }
    ```
*   **Receive Message Payload:**
    ```json
    {
      "id": "uuid",
      "sender_id": "uuid",
      "sender_phone": "+1234567890",
      "message_content": "Hello!",
      "sent_at": "2026-07-15T10:00:00Z"
    }
    ```
