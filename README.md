# AI-Powered Personal Diet Planner with Cloud Storage

A full-stack educational wellness application that allows authenticated users to create a personal profile, generate a general diet plan, save plans in a cloud database, and manage personal files using private cloud storage.

> **Disclaimer:** This project provides educational/general wellness examples and is not medical or clinical advice.

## Features

- User registration and login
- Protected user-specific dashboard
- Personal nutrition profile
- AI-ready diet-plan generation
- Local rule-based fallback when an external AI API is unavailable
- Cloud database storage using Supabase PostgreSQL
- Saved diet plans
- Private cloud file storage
- File upload, retrieval and deletion
- Signed URLs for private files
- User-specific data isolation
- REST API using Flask
- React + Vite frontend
- CORS configuration for frontend/backend communication
- Environment-variable based secrets
- Responsive health-tech style interface

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Lucide React

### Backend
- Python
- Flask
- Flask-CORS
- python-dotenv
- Requests

### Cloud
- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage

### AI
The application contains an AI integration layer that can call an external AI API when credentials are configured.

For the current free/local implementation, an automatic rule-based fallback engine generates the diet plan when AI API credentials are unavailable.

## System Architecture

```text
                    React Frontend
                         |
                         | REST API
                         v
                  Flask Backend
                 /      |       \
                /       |        \
               v        v         v
        Authentication  AI       Storage
             |          |          |
             v          v          v
          Supabase   AI API     Supabase
           Auth      /Fallback   Storage
             |
             v
        PostgreSQL
```

## Project Structure

```text
AI-Powered-Personal-Diet-Planner-Cloud/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── ...
│
├── backend/
│   ├── app.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── profile_routes.py
│   │   ├── plan_routes.py
│   │   └── file_routes.py
│   ├── services/
│   │   ├── supabase_service.py
│   │   └── storage_service.py
│   └── .env
│
├── ai_engine/
│   ├── diet_engine.py
│   └── food_data.json
│
├── cloud/
├── tests/
├── screenshots/
├── docs/
├── sample_data/
├── README.md
├── requirements.txt
├── .env.example
└── .gitignore
```

## Main Application Flow

### Authentication

```text
Register
   ↓
Supabase Authentication
   ↓
User ID
   ↓
Profile created
   ↓
Login
   ↓
Access token
   ↓
Protected application
```

The backend validates the authenticated user's token before accessing protected resources.

### Diet Plan Generation

```text
User Profile
     ↓
POST /api/generate-plan
     ↓
AI integration layer
     ↓
External AI API if configured
     ↓
Fallback engine if unavailable
     ↓
Generated meal plan
     ↓
Supabase diet_plans table
     ↓
Dashboard / Saved Plans
```

### Cloud File Management

```text
Select File
    ↓
POST /api/upload
    ↓
Private Supabase Storage
    ↓
user_files metadata
    ↓
Signed URL
    ↓
Open / Download
```

Deletion removes both the stored file and its database metadata.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/register` | Register a user |
| POST | `/api/login` | Authenticate a user |
| POST | `/api/logout` | Logout |
| GET | `/api/profile` | Get authenticated user's profile |
| PUT | `/api/profile` | Update authenticated user's profile |
| POST | `/api/generate-plan` | Generate and save a diet plan |
| GET | `/api/plans` | Get user's saved plans |
| GET | `/api/plans/{id}` | Get one user's plan |
| DELETE | `/api/plans/{id}` | Delete user's plan |
| POST | `/api/upload` | Upload a personal file |
| GET | `/api/files` | List user's cloud files |
| DELETE | `/api/files/{id}` | Delete a personal file |
| GET | `/api/health` | Backend health check |

## Database

### `users`

Stores authenticated users' application profiles.

Important fields include:

- `user_id`
- `name`
- `email`
- `age`
- `sex`
- `height_cm`
- `weight_kg`
- `activity_level`
- `dietary_preference`
- `goal`
- `allergies`
- `cuisines`
- `budget_per_day`
- `timeline_weeks`
- `created_at`

### `diet_plans`

Stores generated diet plans.

- `plan_id`
- `user_id`
- `breakfast`
- `lunch`
- `snack`
- `dinner`
- `nutrition_summary`
- `created_at`

### `user_files`

Stores metadata for uploaded files.

- `file_id`
- `user_id`
- `filename`
- `storage_path`
- `uploaded_at`

## Security

The project uses several basic security controls:

- API authentication using Supabase access tokens
- Protected profile, plan and file endpoints
- User ID filtering on database operations
- Row Level Security in Supabase
- Private Storage bucket
- Signed URLs for file access
- Secrets stored in environment variables
- `.env` excluded from Git
- `.env.example` provided without real secrets
- CORS restricted to development frontend origins

Never commit API keys, Supabase secret keys, passwords or access tokens to GitHub.

## Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_key
AI_API_URL=
AI_API_KEY=
AI_MODEL=
```

The AI variables can remain empty when using the local fallback engine.

Never commit the real `.env` file.

## Running Locally

### 1. Backend

Open Command Prompt in the backend folder.

Activate the virtual environment:

```text
venv\Scripts\activate
```

Install dependencies if necessary:

```text
pip install -r requirements.txt
```

Run Flask:

```text
python app.py
```

Backend:

```text
https://ai-powered-personal-diet-planner-with.onrender.com
```

Health check:

```text
https://ai-powered-personal-diet-planner-with.onrender.com/api/health
```

### 2. Frontend

Open another terminal in the frontend folder:

```text
npm install
```

Start Vite:

```text
npm run dev
```

Frontend:

```text
https://ai-powered-personal-diet-planner-with.onrender.com
```

## Testing Performed

The following application workflows were tested during development:

- User registration
- User login
- Invalid login rejection
- Protected profile endpoint
- Protected diet-plan endpoint
- Protected cloud-file endpoint
- Profile update
- Diet-plan generation
- Diet-plan database saving
- Saved-plan retrieval
- Saved-plan deletion
- Cloud file upload
- Cloud file retrieval/opening
- Cloud file deletion
- Logout
- Frontend/backend CORS communication
- Backend health check

## AI Fallback

The local fallback engine uses `ai_engine/food_data.json` and generates a general wellness meal plan.

The fallback exists so the application remains functional when:

- No AI API key is configured
- The external AI service is unavailable
- The API request fails
- The returned response does not match the expected structure

This allows the project to operate without requiring a paid AI API account.

## Cloud Computing Concepts Demonstrated

This project demonstrates:

- Cloud authentication
- Cloud database
- Cloud object/file storage
- REST API communication
- User-specific cloud data
- Authentication and authorization
- Row Level Security
- Signed URLs
- Environment-based configuration
- Cloud-ready application architecture
- Failure handling and fallback design

## Deployment

The application is structured for separate frontend and backend deployment.

Potential deployment architecture:

```text
User Browser
     |
     v
React Frontend Hosting
     |
     v
Flask Backend Hosting
     |
     +------> Supabase Auth
     |
     +------> Supabase PostgreSQL
     |
     +------> Supabase Storage
     |
     +------> Optional AI API
```

Production deployment should use HTTPS, production CORS origins, secure environment variables and appropriate authentication/security configuration.

## Future Improvements

- Connect a production AI API
- Add richer nutritional calculations
- Add plan export to PDF
- Add nutrition charts
- Add stronger file validation
- Add automated backend tests
- Add production deployment
- Add monitoring and logging
- Add more personalized meal constraints

## Educational Purpose

This project was created as a cloud-computing educational project to demonstrate full-stack development, authentication, cloud databases, cloud storage, APIs, AI integration architecture and basic application security.

It should not be used as a substitute for advice from a qualified nutrition or medical professional.
