import React, { useState } from "react";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";

const SearchBarPopup = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = async () => {
    if (!query) return;

    setQuery("");
    setIsOpen(false);
    navigate(`/search?query=${query}`);
  };
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} hideHeader>
      <div className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 border border-slate-200 rounded-full"
        />
        <button
          onClick={handleSearch}
          className="bg-sky-500 text-white px-8 py-3.5 rounded-full hover:bg-blue-600 transition-all tracking-widest"
        >
          Search
        </button>
      </div>
    </Modal>
  );
};

export default SearchBarPopup;
