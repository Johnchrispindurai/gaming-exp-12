# GAMEZONE — Experiment 12 (Full Stack + Vercel)

A full-stack student-record CRUD application with a gaming-community visual theme.

## Technologies
- React.js + Vite frontend
- Node.js + Express.js backend
- MongoDB Atlas database
- Vercel hosting (React static build + serverless Express API)

## Lab-manual CRUD requirements
| Operation | HTTP method | Endpoint | MongoDB method |
|---|---|---|---|
| Create | POST | `/api/students` | `insertOne()` |
| Read | GET | `/api/students` | `find()` |
| Update | PUT | `/api/students/:id` | `updateOne()` |
| Delete | DELETE | `/api/students/:id` | `deleteOne()` |

Database: `CollegeDB`  
Collection: `Students`

## 1. MongoDB Atlas
1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/atlas.
2. Create a database user and strong password.
3. In Network Access, add an IP access rule that allows your deployment to connect. For a student demo, `0.0.0.0/0` allows access from anywhere; use a strong unique database password.
4. Choose Connect → Drivers → Node.js and copy the connection string.
5. Keep the URI private. If its password contains special characters, URL-encode them.

## 2. Push to GitHub
Extract the ZIP, open the project root folder in VS Code, then:

```bash
git init
git branch -M main
git add .
git commit -m "Add GAMEZONE full stack student CRUD application"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If `origin` already exists, use `git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git`.

## 3. Deploy on Vercel
1. Import the GitHub repository at https://vercel.com/new.
2. Framework Preset: **Other** (Vite is also acceptable if detected).
3. Root Directory: `./`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install`
7. Add the environment variable below before deploying (or add it in Settings and redeploy).

Environment variable:
- Key: `MONGO_URI`
- Value: your complete MongoDB Atlas connection string
- Environments: Production, Preview and Development

Do not upload `.env` or a real connection string to GitHub. Vercel's `api/index.js` exports the Express app as a serverless function. The `vercel.json` rewrite sends `/api/...` requests to that function. The frontend is built by Vite and served from `dist`.

## 4. Local development
Create a private `.env` file in the project root using `.env.example` as a guide and set `MONGO_URI` to your Atlas URI.

Terminal 1:
```bash
npm install
npm start
```

Terminal 2:
```bash
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173). The Vite development proxy forwards `/api` requests to `http://localhost:5000`.

For local backend development, install dotenv if needed:
```bash
npm install dotenv
```
The provided local server loads `.env` using dotenv.

## 5. Test after deployment
- Open `/` and check the dashboard.
- Add a student name and department.
- Refresh and confirm the record remains.
- Edit the record.
- Delete the record.
- Check the `CollegeDB` → `Students` collection in MongoDB Atlas.

## Notes
This experiment follows the supplied lab manual's student CRUD data model and API endpoint names, presented with GAMEZONE styling. It is a lab demonstration, not an authenticated production student information system.
