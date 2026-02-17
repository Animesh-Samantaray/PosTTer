import React, { useRef, useState } from "react";
import { LuFileImage, LuTrash } from "react-icons/lu";

const CoverImageSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewurl, setPreviewurl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);

    const url = URL.createObjectURL(file);
    setPreviewurl(url);

    if (setPreview) setPreview(url);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewurl(null);
    if (setPreview) setPreview(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* UPLOAD CARD */}
      {!image && !preview ? (
        <div
          onClick={onChooseFile}
          className="
            w-full h-60
            flex flex-col items-center justify-center gap-3
            rounded-2xl
            border-2 border-dashed border-indigo-300
            bg-gradient-to-br from-indigo-50 to-purple-50
            cursor-pointer
            transition-all duration-200
            hover:border-indigo-500
            hover:shadow-md
            hover:scale-[1.01]
            group
          "
        >
          <div
            className="
              w-16 h-16
              flex items-center justify-center
              rounded-full
              bg-white
              shadow-sm
              group-hover:shadow-md
              transition
            "
          >
            <LuFileImage className="text-2xl text-indigo-600" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">
              Upload Cover Image
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Click to browse • JPG / PNG
            </p>
          </div>
        </div>
      ) : (
        /* PREVIEW CARD */
        <div
          className="
            relative w-full h-60
            rounded-2xl
            overflow-hidden
            border border-slate-200
            shadow-sm
            bg-slate-100
            group
          "
        >
          <img
            src={preview || previewurl}
            alt="Cover"
            className="
              w-full h-full
              object-contain
              p-2
              transition-transform duration-300
              group-hover:scale-105
            "
          />

          {/* hover overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-black/20 to-transparent
              opacity-0 group-hover:opacity-100
              transition
            "
          />

          <button
            type="button"
            onClick={handleRemoveImage}
            className="
              absolute top-3 right-3
              bg-white/90 backdrop-blur
              text-rose-600
              p-2.5
              rounded-full
              shadow-md
              hover:bg-rose-50
              hover:scale-110
              transition-all
            "
          >
            <LuTrash className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverImageSelector;
