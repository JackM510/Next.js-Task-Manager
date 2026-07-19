import TaskList from "../components/TaskList"

export default async function Home() {
  // Send a request to route.ts API to get tasks from MongoDB
  const res = await fetch("http://localhost:3000/api", {
    cache: "no-store"
  });
  const tasks = await res.json(); // Convert HTTP response into JSON

  return (

<div className="h-auto w-full md:w-3/4 mx-auto bg-white font-sans border border-gray-300 px-4 sm:px-6 md:px-8">

      <TaskList
        tasks={tasks}
      />
    </div>
  );
}
