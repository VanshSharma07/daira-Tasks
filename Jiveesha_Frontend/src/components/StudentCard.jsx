import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { BsThreeDotsVertical } from "react-icons/bs";

const StudentCard = ({ student, buttonLabel, onButtonClick, onDelete, onReset }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(false);
    onDelete(student._id);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(false);
    onReset(student._id);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative w-100 h-80 group bg-black rounded-xl">
      <div className="absolute top-0 left-0 w-full h-full shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-xl opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-0"></div>
      <article className="relative w-55 h-80 p-2 bg-white transition-transform duration-300 ease-out transform group-hover:bg-[#ff937a] group-hover:-translate-x-1 group-hover:-translate-y-1 border-2 border-black rounded-xl group-hover:bg-[#fafafa]">
        <div className="absolute top-2 right-2 z-20" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BsThreeDotsVertical className="text-gray-600" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Student
              </button>
              <button
                onClick={handleReset}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset Data
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center pb-2">
          <img
            src={student.imageUrl || "/defaultphp.jpg"}
            alt={`Profile picture of ${student.name}`}
            className="w-24 h-24 mb-4 mt-7 rounded-full object-cover border-2 border-black"
          />
          <h3 className="text-[20px] mb-[0.5] font-bold font-roboto">
            {student.name || "Unknown Student"}
          </h3>
        </div>
        <div className="flex justify-between items-center w-full px-4">
          <div className="flex flex-col items-center justify-center text-sm text-gray-700 space-y-1 w-1/2">
            <p className="text-sm font-roboto group-hover:text-black text-gray-500">Roll No</p>
            <p className="text-sm font-semibold font-roboto group-hover:text-black text-gray-500">
              {student.rollno}
            </p>
          </div>
          <div className="h-8 border border-gray-400"></div>
          <div className="flex flex-col items-center justify-center text-sm text-gray-700 space-y-1 w-1/2">
            <p className="text-sm font-roboto group-hover:text-black text-gray-500">Test Taken</p>
            <p className="text-sm font-semibold font-roboto group-hover:text-black text-gray-500">
              {student.tests_taken}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button label={buttonLabel} onClick={onButtonClick} />
        </div>
      </article>
    </div>
  );
};

export default StudentCard;