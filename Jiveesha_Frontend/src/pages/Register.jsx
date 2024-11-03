import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.css";
import { backendURL } from "../definedURL";  // Ensure this is defined

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (email?.length === 0 || password?.length === 0) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);  // Store the token in localStorage
        navigate("/login");  // Navigate to home or login page after successful registration
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while registering. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1>Register</h1>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <p className={styles.loginText}>
            Already a user? <span onClick={handleLoginRedirect} className={styles.loginLink}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;