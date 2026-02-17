import React, { useState } from "react";

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    const key = e.key;

    if ((key === "Enter" || key === ",") && input.trim()) {
      e.preventDefault();

      const newTag = input.trim();

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setInput("");
    } 
    else if (key === "Backspace" && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemove = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  return (
    <div className="w-full">
      
      {/* TAG CONTAINER */}
      <div className="
        flex flex-wrap gap-2
        p-3
        rounded-xl
        border border-slate-300
        bg-white
        focus-within:ring-2 focus-within:ring-indigo-500
        transition
      ">
        
        {/* TAG CHIPS */}
        {tags.map((tag, index) => (
          <div
            key={index}
            className="
              flex items-center gap-2
              bg-indigo-50
              text-indigo-700
              text-sm font-medium
              px-3 py-1.5
              rounded-full
              border border-indigo-200
              hover:bg-indigo-100
              transition
            "
          >
            {tag}
            <button
              onClick={() => handleRemove(index)}
              className="
                text-indigo-500
                hover:text-rose-600
                font-bold
                text-sm
                leading-none
              "
              type="button"
            >
              ×
            </button>
          </div>
        ))}

        {/* INPUT */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type tag and press Enter"
          className="
            flex-1 min-w-[140px]
            outline-none
            text-sm
            px-2 py-1
            bg-transparent
          "
        />
      </div>

      {/* HINT TEXT */}
      <p className="text-xs text-slate-500 mt-2">
        Press Enter or comma to add • Backspace to remove last
      </p>
    </div>
  );
};

export default TagInput;
