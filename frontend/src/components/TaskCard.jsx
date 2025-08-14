import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TaskCard({ task }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(task.likes || 0);

  const fakeCommentsCount = 12;

  const toggleLike = (e) => {
    e.preventDefault();
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

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

        <div className="flex items-center justify-between mt-6">
          {/* Likes on the left */}
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? "Unlike task" : "Like task"}
            className={`flex items-center space-x-1 focus:outline-none transition-colors duration-300 ${
              liked ? "text-pink-600" : "text-gray-400 hover:text-green-600"
            }`}
          >
            <span className="text-lg" aria-hidden="true">
              {liked ? "❤️" : "🤍"}
            </span>
            <span className="text-sm select-none">{likesCount}</span>
          </button>

          {/* Comments on the right */}
          <div
            role="img"
            aria-label="Comments"
            title="Kommentit"
            className="flex items-center space-x-1 text-gray-400 text-sm cursor-default select-none"
          >
            <span className="text-lg">💬</span>
            <span>{fakeCommentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
