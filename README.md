# RLS Guard Dog

RLS Guard Dog is a sample project demonstrating robust Row-Level Security (RLS) using [Supabase](https://supabase.com/) and [MongoDB](https://www.mongodb.com/) to control classroom and progress data visibility in an educational platform. It leverages modern frontend styling via [TailwindCSS](https://tailwindcss.com/) (or similar libraries) to deliver a clean UI.

## Project Goals

- **Student Privacy:** Students only see their own rows in classroom and progress tables.
- **Teacher Access:** Teachers can view all rows and have edit privileges via a dedicated teacher's page.
- **Secure Design:** All data access is enforced through RLS policies (Supabase), not just frontend filtering.
- **Integration Tests:** Automated tests prove that policies hold under various user roles.

---

## Tech Stack

- **Supabase** (PostgreSQL, Auth, RLS Policies)
- **MongoDB** (Mongoose models for backend)
- **Node.js/Express** (backend API)
- **React** (frontend)
- **Redux** (frontend state management)
- **TailwindCSS** (or similar for UI)
- **Jest** or similar (integration testing framework)

---

## Features

- **Progress Table:** Students can only see their own progress. Teachers see all students' progress.
- **Classroom Table:** Students view only their own classroom record. Teachers see all classroom data.
- **Teacher's Page:** Dedicated interface for teachers to add/edit student/classroom data.
- **Authentication:** Secure login with role assignment (student/teacher).
- **Integration Tests:** End-to-end tests validating RLS enforcement.

---

## Folder Structure

```
rls-guard-dog/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Progress.js
│   │   └── Classroom.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── progress.js
│   │   └── classroom.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── progressController.js
│   │   └── classroomController.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.js
│   │   │   │   └── PrivateRoute.js
│   │   │   ├── Student/
│   │   │   │   ├── StudentDashboard.js
│   │   │   │   └── StudentProgress.js
│   │   │   ├── Teacher/
│   │   │   │   ├── TeacherDashboard.js
│   │   │   │   ├── ClassroomManager.js
│   │   │   │   └── ProgressManager.js
│   │   │   └── Auth/
│   │   │       ├── Login.js
│   │   │       └── Register.js
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── progressSlice.js
│   │   │   │   └── classroomSlice.js
│   │   │   └── api/
│   │   │       └── apiSlice.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/RahulChauhan-2002/RLS-Guard-Dog.git
cd RLS-Guard-Dog
```

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 3. Configure Supabase

- Create a project on [Supabase](https://app.supabase.com/).
- Set up tables for `students`, `teachers`, `progress`, `classrooms`.
- Configure authentication providers.
- **Define RLS policies** to ensure:
  - Students can only `SELECT` their own rows.
  - Teachers can `SELECT`, `INSERT`, `UPDATE`, `DELETE` all rows.

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-api-key
MONGODB_URI=your-mongodb-connection-string
```

### 5. Run the Application

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd ../frontend
npm start
```

### 6. Run Integration Tests

#### Backend

```bash
npm test
```

---

## Example RLS Policy (Supabase)

```sql
-- Students: can select only their own progress
CREATE POLICY "Students can view their own progress"
ON progress
FOR SELECT
USING (auth.uid() = user_id);

-- Teachers: can select all, and insert/update/delete
CREATE POLICY "Teachers can manage all progress"
ON progress
FOR ALL
USING (EXISTS (
  SELECT 1 FROM teachers WHERE teachers.user_id = auth.uid()
));
```

---

## Contributing

Pull requests and suggestions are welcome!  
Please open an issue for feature requests and bug reports.

---

## License

MIT

---

## Credits

Made by [Rahul Chauhan](https://github.com/RahulChauhan-2002)  
Powered by Supabase, MongoDB, Node.js, React, and TailwindCSS.
