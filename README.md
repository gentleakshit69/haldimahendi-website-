# HaldiMahendi - AI Matrimonial Platform

Welcome to the HaldiMahendi repository! This project consists of a decoupled architecture with a Next.js frontend and a fully functioning Django backend.

## 🚀 For the Frontend Developer

This backend is designed to be completely API-driven (REST + WebSockets) to support a dynamic, AI-powered conversational avatar onboarding flow. 

### Backend Setup (Local Development)
If you need to run the backend locally to test your frontend:
1. Navigate to the `backend` folder.
2. Activate the virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
3. Ensure you have a `.env` file in `backend/` with `OPENAI_API_KEY=your_key` and `ELEVENLABS_API_KEY=your_key` (if testing the avatar features).
4. Run the server: `python manage.py runserver`
5. The API will be available at `http://localhost:8000/api/v1/`.

---

### 📚 API Documentation

#### 1. Authentication (Phone OTP)
We use a password-less, OTP-based authentication system.

*   **Send OTP**
    *   **Endpoint:** `POST /api/v1/auth/send-otp/`
    *   **Payload:** `{ "phone_number": "+919876543210" }`
    *   **Response:** `{ "status": "OTP sent successfully." }`
*   **Verify OTP & Login**
    *   **Endpoint:** `POST /api/v1/auth/verify-otp/`
    *   **Payload:** `{ "phone_number": "+919876543210", "otp": "123456" }`
    *   **Response:** `{ "access": "eyJ...", "refresh": "eyJ...", "is_new_user": true/false }`
    *   *Note: Save the `access` token. Pass it as a Bearer token in the `Authorization` header for all protected routes.*

#### 2. Bio-Data Parsing (AI OCR)
Automatically parses uploaded Bio-Data documents into structured JSON.

*   **Endpoint:** `POST /api/v1/profile/biodata/parse/`
*   **Headers:** `Authorization: Bearer <your_access_token>`
*   **Content-Type:** `multipart/form-data`
*   **Payload:** `file` (a JPG, PNG, or PDF file) OR `text` (raw pasted string).
*   **Response:**
    ```json
    {
      "status": "success",
      "raw_extracted_text": "...",
      "structured_data": {
        "full_name": "Sourabh Bansal",
        "date_of_birth": "1998-08-17",
        "height": "6'0\"",
        "complexion": "Fair",
        "education_level": "Graduation (BBA)",
        "occupation": "Business",
        "family_details": "Father: Businessman...",
        "expectations": "Looking for a caring partner..."
      }
    }
    ```
    *Frontend UI Note: You should present this `structured_data` to the user in a form to verify before calling a (future) profile save endpoint.*

#### 3. Real-Time AI Avatar Onboarding (WebSockets)
The core feature: A conversational flow with a 3D Avatar (Priya) to gather profile details interactively.

*   **WebSocket URL:** `ws://localhost:8000/ws/avatar/onboarding/?token=<your_access_token>`
*   **Frontend Action (Sending Audio/Text):**
    You should record the user's mic, run it through your preferred STT (e.g., Deepgram SDK on the frontend), and send the resulting transcribed text over the socket:
    ```json
    { "text": "Hi Priya, my name is Sourabh", "language": "en" }
    ```
*   **Backend Response (Receiving Avatar Audio):**
    The backend will process the text with GPT-4o, generate an audio response via ElevenLabs, and stream it back:
    ```json
    { 
      "type": "avatar_response", 
      "text": "Nice to meet you, Sourabh. What is your profession?", 
      "audio_base64": "UklGRjT2... (base64 encoded audio string)" 
    }
    ```
    *Frontend UI Note: Decode the `audio_base64` string to a blob and play it, while syncing the Avatar's lip movements.*

#### 4. Matchmaking & Search
*   **Endpoint:** `GET /api/v1/matches/search/`
*   **Headers:** `Authorization: Bearer <your_access_token>`
*   **Query Params:** `?q=search_term&gender=male&religion=hindu`
*   **Response:** Returns a JSON array of matching profiles.

---

### ERD / Database Schema
The backend models consist of:
- `User` (Auth via phone_number)
- `OTPVerification`
- `Profile` (Bio-data details)
- `Preference` (Matchmaking preferences)
- `Photo`
- `ChatSession` & `ChatMessage`
- `AIOnboardingSession` (Tracks the context of the WebSocket conversation)

Happy building! Let the backend team know if you need any adjustments to the payloads.
