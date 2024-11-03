import React, { useState } from "react";
import Popup from "reactjs-popup";
import { backendURL } from "../definedURL";

export default function PopupForm({ showPopup, handleClose, onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    age: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rollno: "",
      age: "",
    });
    setIsSubmitting(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${backendURL}/addChild`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student');
      }

      const newStudent = {
        ...data,
        _id: data._id || data.id, // Handle different id formats
        tests_taken: 0,
        imageUrl: "/defaultphp.jpg",
        name: formData.name,
        rollno: formData.rollno,
        age: formData.age
      };
      
      onStudentAdded(newStudent);
      resetForm();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      resetForm();
      handleClose();
    }
  };

  return (
    <Popup 
      open={showPopup} 
      onClose={handleModalClose}
      modal
      nested
      closeOnDocumentClick={false}
    >
      {() => (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50" onClick={handleModalClose}></div>
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 relative z-50">
            <h2 className="text-2xl font-semibold mb-4">Enter Details</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-left font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-left font-medium">Roll No</label>
                <input
                  type="text"
                  name="rollno"
                  value={formData.rollno}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-left font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`hover:bg-green-500 bg-white hover:text-white text-green-500 border-2 border-green-500 px-4 py-2 rounded hover:bg-green-600 transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="hover:bg-red-500 bg-white hover:text-white text-red-500 border-2 border-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Popup>
  );
}