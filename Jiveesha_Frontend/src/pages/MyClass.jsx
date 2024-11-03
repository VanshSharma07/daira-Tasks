// MyClass.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentCard from "../components/StudentCard";
import { CiCirclePlus } from "react-icons/ci";
import PopupForm from "../components/PopupForm";
import img1 from "../assets/grid.jpg";
import SearchbyName from "../components/SearchbyName";
import { backendURL } from "../definedURL";

export default function MyClass({ students, onAddStudent }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [resettingIds, setResettingIds] = useState(new Set());
  const [localStudents, setLocalStudents] = useState(students);

  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  const handleAddChildClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleChildClick = (studentId) => {
    localStorage.setItem("childId", studentId);
    navigate("/testreports");
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDeleteStudent = async (studentId) => {
    if (deletingIds.has(studentId)) return;
    
    setDeletingIds(prev => new Set([...prev, studentId]));
    try {
      const response = await fetch(`${backendURL}/deleteChild/${studentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const updatedStudents = localStudents.filter(student => student._id !== studentId);
        setLocalStudents(updatedStudents);
        onAddStudent(updatedStudents); // Update parent state
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  // pages/MyClass.jsx

const handleResetStudent = async (studentId) => {
  if (resettingIds.has(studentId)) return;
  
  setResettingIds(prev => new Set([...prev, studentId]));
  try {
    const response = await fetch(`${backendURL}/resetStudentData/${studentId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reset student data');
    }

    const data = await response.json();
    
    // Update local state with the reset student data
    const updatedStudents = localStudents.map(student => 
      student._id === studentId
        ? data.child // Use the updated child data from response
        : student
    );

    setLocalStudents(updatedStudents);
    onAddStudent(updatedStudents); // Update parent state

  } catch (error) {
    console.error('Error resetting student:', error);
  } finally {
    setResettingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
  }
};

  const filteredStudents = localStudents.filter((student) =>
    student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-4" style={{ position: "relative", height: "100vh" }}>
      {/* Rest of your JSX remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-4 px-6">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            buttonLabel="View Test Report"
            onButtonClick={() => handleChildClick(student._id)}
            onDelete={handleDeleteStudent}
            onReset={handleResetStudent}
            isDeleting={deletingIds.has(student._id)}
            isResetting={resettingIds.has(student._id)}
          />
        ))}
        <div onClick={handleAddChildClick} className="flex flex-col items-center justify-top w-full border-2 border-black rounded-xl h-100 bg-white cursor-pointer">
          <CiCirclePlus style={{ fontSize: "4rem", marginTop: "100px" }} />
          <h2 className="mt-2 hover:scale-105">Add Student</h2>
        </div>
      </div>
      {showPopup && (
        <PopupForm
          showPopup={showPopup}
          handleClose={handleClose}
          onStudentAdded={(newStudent) => {
            const updatedStudents = [...localStudents, newStudent];
            setLocalStudents(updatedStudents);
            onAddStudent(updatedStudents);
          }}
        />
      )}
    </div>
  );
}