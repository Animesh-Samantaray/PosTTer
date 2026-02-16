import React from "react";

const DeleteAlertContent = ({ 
  title = "Delete", 
  content = "", 
  onDelete 
}) => {
  return (
    <div className="p-4 w-full max-w-sm">
      
      {/* Title */}
      <h3 className="text-base font-semibold text-red-600 mb-2">
        {title}
      </h3>

      {/* Content */}
      <p className="text-sm text-gray-700 mb-4">
        {content}
      </p>

      {/* Button */}
      <button
        type="button"
        className="
          w-full
          py-2
          text-sm font-medium
          text-white
          bg-red-600
          rounded-md
          hover:bg-red-700
          active:scale-[0.98]
          transition
        "
        onClick={() => onDelete && onDelete()}
      >
        Delete
      </button>

    </div>
  );
};

export default DeleteAlertContent;
