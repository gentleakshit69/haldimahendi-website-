# Haldi Mahendi

Welcome to the Haldi Mahendi project repository!

This project is currently in **active development mode**. We are building a decoupled application using a Django backend and a Next.js frontend.

## Architecture

*   **Backend:** Django (Python) - Serves as the API provider.
*   **Frontend:** Next.js (React) - Consumes the API and provides the user interface.
*   **Database:** SQLite - Currently used for rapid local development. We will switch to a more robust database (like PostgreSQL or MySQL) in the future for staging/production deployments.

## Development Workflow

1.  **AI-Assisted Development:** We are leveraging AI tools to rapidly prototype, develop, and test new APIs and features.
2.  **Frontend/Backend Decoupling:** The frontend developer will exclusively use the `FRONTEND_GUIDE.md` for integrating with the backend. They do not need to understand Django internals.
3.  **Future Deployment:** Once features are stable locally, they will be showcased and then migrated to a production-ready environment.

## Implemented Features

*   **Authentication:** Send & Verify OTP flow using a REST API.
*   **AI Biodata Parsing:** Upload a bio-data image or PDF to extract structured JSON data via LLM (OpenAI/Google Vision).
*   **Profile Management:** Endpoints to fetch and comprehensively update user profiles, including support for uploading multiple profile photos.
*   **Search Engine:** Basic searching and filtering logic for profiles.
*   **Real-time Chat:** Django Channels ASGI configuration supporting WebSocket connections, alongside REST APIs to start sessions and fetch message history.

## Architecture & System Flow

```mermaid
graph TD
    Client[Next.js Frontend]
    
    sublayer[Django Backend]
        REST[REST APIs]
        WS[WebSockets - Django Channels]
        DB[(SQLite Database)]
        LLM[OpenAI/Vision API]
    end

    Client -- HTTP Requests --> REST
    Client -- ws:// --> WS
    
    REST -- Upload BioData --> LLM
    LLM -- JSON Output --> REST
    
    REST -- Read/Write --> DB
    WS -- Real-time Messages --> DB
```

## Database Schema (ER Diagram)

```mermaid
erDiagram
    USER ||--o{ OTP_VERIFICATION : "requests"
    USER ||--o| PROFILE : "has"
    USER ||--o{ CHAT_SESSION : "participates (as user_one or user_two)"
    USER ||--o{ CHAT_MESSAGE : "sends"
    
    PROFILE ||--o| PREFERENCE : "has matchmaking"
    PROFILE ||--o{ PHOTO : "has multiple"
    
    CHAT_SESSION ||--o{ CHAT_MESSAGE : "contains"
    
    USER {
        int id PK
        string phone_number
        boolean is_verified
    }
    
    OTP_VERIFICATION {
        int id PK
        int user_id FK
        string otp_code
        boolean is_used
        datetime expires_at
    }
    
    PROFILE {
        uuid id PK
        int user_id FK
        string full_name
        string gender
        string hobbies
        text family_details
        string occupation
    }
    
    PREFERENCE {
        uuid id PK
        uuid profile_id FK
        int min_age
        int max_age
        string preferred_religion
    }
    
    PHOTO {
        uuid id PK
        uuid profile_id FK
        string image_url
        boolean is_primary
    }
    
    CHAT_SESSION {
        uuid id PK
        int user_one_id FK
        int user_two_id FK
        datetime created_at
    }
    
    CHAT_MESSAGE {
        uuid id PK
        uuid session_id FK
        int sender_id FK
        text message_content
        boolean is_read
        datetime sent_at
    }
```

## Getting Started (Local Development)

### Prerequisites

*   Python 3.10+
*   Node.js 18+

### Backend Setup

1.  Navigate to the `backend` directory.
2.  Activate the virtual environment: `.\venv\Scripts\activate` (Windows)
3.  Install dependencies (if new ones were added): `pip install -r requirements.txt`
4.  Run migrations: `python manage.py migrate`
5.  Start the server: `python manage.py runserver`

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## Resources

*   `FRONTEND_GUIDE.md`: The primary resource for the frontend team regarding API contracts and integration details.
