import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onClick={() => inputRef.current.click()}
          className="
            w-24 h-24 rounded-full
            bg-sky-50 border border-sky-200
            flex items-center justify-center
            cursor-pointer hover:bg-sky-100
            transition relative
          "
        >
          <LuUser className="text-4xl text-sky-500" />

          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white flex items-center justify-center">
            <LuUpload />
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="preview"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <button
            type="button"
            onClick={removeImage}
            className="
              absolute -bottom-1 -right-1
              w-8 h-8 rounded-full
              bg-red-500 text-white
              flex items-center justify-center
            "
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
