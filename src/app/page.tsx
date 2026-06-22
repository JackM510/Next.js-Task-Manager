
import TaskList from "../components/TaskList"

export default async function Home() {
  // Send a request to route.ts API to get tasks from MongoDB
  const res = await fetch("http://localhost:3000/api", {
    cache: "no-store"
  });
  const tasks = await res.json(); // Convert HTTP response into JSON


  return (
    <div className="flex flex-col w-full lg:w-3/4 mx-auto bg-white font-sans border border-gray-300">
      < TaskList
        tasks={tasks}
      />
    </div>
  );
}
