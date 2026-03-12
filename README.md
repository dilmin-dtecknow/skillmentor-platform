# SkillMentor Platform

SkillMentor is a full-stack online mentoring platform that bridges the gap between students and expert mentors. The platform facilitates specialized learning through one-on-one sessions, streamlined payment workflows, and a robust administrative dashboard for session management.

---

## 🚀 Features

### Student Features
* **Discovery:** Browse public mentor listings and view detailed profiles.
* **Enrollment:** Explore mentor-specific subjects with real-time enrollment counts.
* **Booking:** Schedule one-on-one mentoring sessions.
* **Payments:** Upload bank slip payment proof directly to the platform.
* **Dashboard:** Track session status, payment confirmation, and learning progress.
* **Feedback:** Submit reviews and ratings for completed sessions.

### Admin Features
* **Management:** Create and manage mentor profiles and subject categories.
* **Operations:** View and search all bookings by student or mentor.
* **Workflow:** Confirm payments, add meeting links, and mark sessions as completed.
* **Analytics:** Filter bookings by status and date for operational oversight.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Spring Boot, Spring Security, Spring Data JPA, PostgreSQL |
| **Authentication** | Clerk (JWT-based RBAC) |
| **Mapping/Validation** | ModelMapper, Bean Validation |
| **Documentation** | Swagger / OpenAPI |
| **Deployment** | Vercel (Frontend), Render (Backend), Supabase (Database) |

---

## 📂 Project Structure

```bash
skillmentor-platform/
├── frontend/
│   └── skill-mentor-frontend-as/   # React Application
├── backend/
│   └── skill-mentor-backend/        # Spring Boot API
└── README.md

```

---

## ⚙️ Environment Variables

### Frontend

Create a `.env` file in `frontend/skill-mentor-frontend-as/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=your_backend_base_url

```
Please confirm your clerk's Template is 
``` 
const token = await getToken({ template: "skill-mentor" });
```

### Backend

Configure these in your application properties or environment:

```env
PROFILE=prod
PORT=8080
DATABASE_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
CLERK_ISSUER_URL=your_clerk_issuer_url
CLERK_JWKS_URL=your_clerk_jwks_url
CLERK_AUDIENCE=skill-mentor
FRONTEND_URL=your_frontend_url

```

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dilmin-dtecknow/skillmentor-platform.git
cd skillmentor-platform

```

### 2. Run Frontend

```bash
cd frontend/skill-mentor-frontend-as
npm install
npm run dev

```

### 3. Run Backend

```bash
cd backend/skill-mentor-backend
./mvnw spring-boot:run

```

---

## 📑 API Documentation

### Mentor Endpoints

* `GET /api/v1/mentors` - List all mentors
* `GET /api/v1/mentors/{id}` - Get detailed profile
* `POST /api/v1/mentors` - Create mentor (**Admin Only**)

### Subject Endpoints

* `POST /api/v1/subjects` - Create subject (**Admin only**)

### Session Endpoints

* `POST /api/v1/sessions/enroll` - Enroll in a session
* `GET /api/v1/sessions/my-sessions` - Student dashboard data
* `GET /api/v1/sessions` - Get all bookings (**Admin only**)
* `PATCH /api/v1/sessions/{id}/confirm-payment` - Confirm payment (**Admin Only**)
* `PATCH /api/v1/sessions/{id}/complete` - Mark session finished (**Admin Only**)
* `PATCH /api/v1/sessions/{id}/meeting-link` - Add meeting link (**Admin only**)
* `PATCH /api/v1/sessions/{id}/review` - Submit session feedback

---

## 🔏 Authentication & Authorization 
### This project uses Clerk for authentication and role-based access control.
* Students can access booking and dashboard features
* Admins can access /admin/* routes
* JWT template includes role claims used by the backend

---

## 🔗 Deployment Links

* **Frontend:** [Vercel App](https://skillmentor-platform-two.vercel.app)
* **Backend API:** [Render API](https://skillmentor-platform-t9c8.onrender.com)
* **Documentation:** [Swagger UI](https://skillmentor-platform-t9c8.onrender.com/swagger-ui/index.html)
* **Repository:** [GitHub](https://github.com/dilmin-dtecknow/skillmentor-platform)

---

## 👤 Author

**Dilmin Fernando**

```



```
