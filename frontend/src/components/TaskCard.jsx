// TaskCard.jsx
import React from "react";

export default function TaskCard({ title, description, assignees, deadline }) {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description.map((line, idx) => (
            <p key={idx} className="text-sm">{line}</p>
          ))}
        </div>
        <input type="checkbox" className="form-checkbox w-5 h-5 mt-1" />
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <div className="flex space-x-3">
          <span title="Kommentit">💬</span>
          <span title="Liitteet">📎</span>
        </div>
        <div className="flex space-x-2 items-center">
          {deadline && (
            <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-md">
              {deadline}
            </span>
          )}
          {assignees.map((name, idx) => (
            <span
              key={idx}
              className="bg-gray-700 text-white text-xs w-7 h-7 flex items-center justify-center rounded-full"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
