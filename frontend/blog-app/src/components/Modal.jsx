import React from "react";

const Modal = ({ isOpen, onClose, title, hideHeader, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        px-4
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full max-w-2xl
          bg-white
          rounded-2xl
          shadow-2xl
          border border-gray-200/70
          p-6 md:p-8
          animate-in fade-in zoom-in-95
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== Header ===== */}
        {!hideHeader && (
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {title}
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="
                p-2 rounded-lg
                text-gray-500 hover:text-gray-800
                hover:bg-gray-100
                transition
              "
            >
              ✕
            </button>
          </div>
        )}

        {/* ===== Close (top-right when header hidden) ===== */}
        {hideHeader && (
          <button
            type="button"
            onClick={onClose}
            className="
              absolute top-4 right-4
              p-2 rounded-lg
              text-gray-500 hover:text-gray-800
              hover:bg-gray-100
              transition
            "
          >
            ✕
          </button>
        )}

        {/* ===== Body ===== */}
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
