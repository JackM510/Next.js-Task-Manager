# Next.js Task Manager
A lightweight task manager built with Next.js, TypeScript, Tailwind CSS, and MongoDB. It includes full CRUD operations for tasks, priority levels, and task deadlines via React DatePicker, powered by RESTful API routes.

## Demo
- Follow the Installation instructions below to use Task Manager on your local machine.
- You can optionally pre-load Task data by using the provided seed script to import tasks into MongoDB.




### Desktop Screenshots

### Desktop Video

### Mobile Screenshots

### Mobile Video



## Features
- **Task Management** — Create, update, and delete tasks.
- **Update Task State** — Mark tasks complete or reactivate them using a checkbox.
- **Task Priority** — Add, update, or remove task priority levels.
- **Task Deadlines** — Add, update, or remove task DAT deadlines.
- **Overdue Deadlines** — Automatic overdue detection for deadline tracking.
- **Task Sorting** — Sort tasks by creation date, priority level, or deadline.
- **Responsive Layout** — adapts seamlessly across desktop and mobile devices using Tailwind CSS.

## How It Works
- **Client-side Interactions** — creating, updating, deleting, sorting, and completing tasks is handle through React components.
- **RESTful API Routes** — all requests for creating, updating, and deleting a task and task metadata utilise REST API routes.
- **MongoDB** stores all task data, including titles, priority levels, deadlines, completion status, and timestamps for when the task was created and completed.
- **React DatePicker** — provides date and time selection for task deadlines.
- **Overdue Deadlines** — detected client-side by comparing each deadline against the current DAT to highlight overdue tasks.
- **Sorting Logic** — organises the tasks by creation date timestamps, deadline timestamps, or priority levels (high → low).

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- MongoDB

## Installation
1. Clone the repository to your local machine.
2. Install project dependencies using npm install.
3. Create an environment file named .env.local in the project root.
4. Add your MongoDB connection string: MONGODB_URI=your-mongodb-uri
5. Start the development server with npm run dev.
6. Open the app in your browser at http://localhost:3000.

## Usage


## Future Improvements
- Multiple task lists to organise tasks into separate categories or projects.
- Recurring tasks for daily, weekly, or monthly reminders.
- Task tagging for additional categorisation and filtering.
- Dark theme with a toggle stored in local preferences.