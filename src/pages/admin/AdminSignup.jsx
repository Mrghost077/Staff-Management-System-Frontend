import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TechGridLogo from "../../assets/TechGrid.png";

const AdminSignup = () => {
  const navigate = useNavigate();
  const apiUrl = "http://localhost:3301";

  // States
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!role) newErrors.role = "Please select a role.";
    if (!firstName) newErrors.firstName = "First Name is required.";
    if (!lastName) newErrors.lastName = "Last Name is required.";
    if (!dob) newErrors.dob = "Date of Birth is required.";
    if (!address) newErrors.address = "Address is required.";
    if (role === "Teacher" && !subject)
      newErrors.subject = "Subject is required.";
    if (!contact) newErrors.contact = "Contact Number is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          firstName,
          lastName,
          dob,
          address,
          subject: role === "Teacher" ? subject : "",
          contact,
          email,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        alert("Account created successfully! Please login.");
        navigate("/"); // ✅ Updated path for SignInPage
      } else {
        alert(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      alert("Server connection failed. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E5F0FF] px-4 py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 flex items-center justify-center">
          <img
            src={TechGridLogo}
            alt="TechGrid Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-black mt-2">TechGrid</h2>
        <p className="text-sm text-gray-500">Teacher Management System</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Fill in your details to register
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.role ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
            >
              <option value="">Select Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.dob ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address}
              </p>
            )}
          </div>

          {/* Subject */}
          {role === "Teacher" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
                placeholder="Enter your subject"
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subject}
                </p>
              )}
            </div>
          )}

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.contact ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your contact number"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-black font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
