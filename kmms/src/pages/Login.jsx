import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { loginUser } from "../api/auth";

function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // MAIN LOGIN FUNCTION
  async function handleLogin({ email, password, role, setError }) {
    try {
      setLoading(true);

      const data = await loginUser({ email, password });
      const backendRole = data.role.toLowerCase();

      // New role logic:
      // Admin can log in using Teacher button.
      const allowedRoles = {
        Teacher: ["teacher", "admin"],
        Parent: ["parent"],
      };

      if (!allowedRoles[role].includes(backendRole)) {
        setError(
          `Role mismatch! You selected ${role}, but logged in as ${data.role}`
        );
        return;
      }

      // Store session
      localStorage.setItem("kmms-token", data.token);
      localStorage.setItem("kmms-user", JSON.stringify(data));

      onLogin(data);
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // If a role is selected → show login form screen
  if (selectedRole) {
    return (
      <LoginForm
        role={selectedRole}
        onBack={() => setSelectedRole(null)}
        onSubmit={handleLogin}
        loading={loading}
      />
    );
  }

  // MAIN SCREEN → Role Selection + Branding Panel
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-100">

      {/* LEFT PANEL (Branding) */}
      <div className="hidden md:flex flex-col justify-center items-center text-white 
                      bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 p-12">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-4xl font-bold mb-4">SmartKindy</h1>
          <h2 className="text-3xl font-semibold mb-4">
            Kindergarten Management System
          </h2>
          <p className="text-lg opacity-90">
            Streamline your kindergarten operations with our comprehensive
            management platform.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Role Selection */}
      <div className="flex items-center justify-center p-10">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">

          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Login</h1>
          <p className="text-gray-600 mb-8">Please choose your role below:</p>

          {/* TEACHER BUTTON */}
          <button
            onClick={() => setSelectedRole("Teacher")}
            className="w-full p-4 bg-green-600 text-white rounded-lg mb-4 hover:bg-green-700 transition"
          >
            📘 Login as Teacher
          </button>

          {/* PARENT BUTTON */}
          <button
            onClick={() => setSelectedRole("Parent")}
            className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            👥 Login as Parent
          </button>

        </div>
      </div>

    </div>
  );
}

export default Login;
