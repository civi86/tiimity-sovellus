import React from "react";
import { Link } from "react-router-dom";

export default function TaskCard({ task }) {
  return (
    <Link
      to={`/task/${task._id}`}
      className="block group transform transition duration-300 hover:scale-[1.05] hover:shadow-xl no-underline"
      aria-label={`View details for task: ${task.title}`}
    >
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-full border border-gray-200 hover:border-green-500">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 italic mb-3">
            Luonut {task.creator}
          </p>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
