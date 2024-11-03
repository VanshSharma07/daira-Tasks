import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNavBar, { SideNavBarItem } from "./components/SideNavBar";
import { GrHomeRounded } from "react-icons/gr";
import { RiGraduationCapLine } from "react-icons/ri";
import { MdOutlineEventNote } from "react-icons/md";

import Home from "./pages/Home";
import MyClass from "./pages/MyClass";
import TakeTests from "./pages/TakeTests";
import SoundDiscriminationTest from "./components/test 16/Test16";
import AudioQuiz from "./components/test 8/Test8";
import Test from "./components/test 6/Test6";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import User from "./pages/User";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmptyPage from "./pages/EmptyPage";
import TestResultsTable from "./pages/TestResultsPage";
import ClassPage from "./pages/ClassPage";
import testsData from "./Data/tests.json";
import { backendURL } from "./definedURL";

function App() {
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
    setTests(testsData);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${backendURL}/validateUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const studentRes = await fetch(`${backendURL}/getChildrenByTeacher`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!studentRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const students = await studentRes.json();
      setStudents(students.children);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddStudent = (updatedStudents) => {
    setStudents(updatedStudents);
  };

  const handleSidebarToggle = (expand) => {
    setIsSidebarExpanded(expand);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchData();
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen overflow-hidden">
      {isAuthenticated && (
        <SideNavBar onToggle={handleSidebarToggle} handleLogout={handleLogout}>
          <SideNavBarItem
            icon={<GrHomeRounded className="text-grey" size={21} />}
            text="Home"
            route="/"
          />
          <SideNavBarItem
            icon={<RiGraduationCapLine className="text-grey" size={21} />}
            text="Classroom"
            route="/myclass"
          />
          <SideNavBarItem
            icon={<MdOutlineEventNote className="text-grey" size={24} />}
            text="Tests"
            route="/taketests"
          />
        </SideNavBar>
      )}

      <main
        className={`transition-all duration-300 ${
          isAuthenticated && isSidebarExpanded
            ? "ml-80"
            : isAuthenticated
            ? "ml-20"
            : ""
        }`}
      >
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home students={students} tests={tests} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/myclass"
            element={
              isAuthenticated ? (
                <MyClass 
                  students={students} 
                  onAddStudent={handleAddStudent}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/taketests"
            element={
              isAuthenticated ? (
                <TakeTests tests={tests} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/test16"
            element={
              isAuthenticated ? (
                <SoundDiscriminationTest />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/test8"
            element={
              isAuthenticated ? (
                <AudioQuiz />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/test6"
            element={
              isAuthenticated ? (
                <Test />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <Settings />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/support"
            element={
              isAuthenticated ? (
                <Support />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/userprofile"
            element={
              isAuthenticated ? (
                <User />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/empty"
            element={
              isAuthenticated ? (
                <EmptyPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/testreports"
            element={
              isAuthenticated ? (
                <TestResultsTable />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/selectstudent"
            element={
              isAuthenticated ? (
                <ClassPage students={students} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;