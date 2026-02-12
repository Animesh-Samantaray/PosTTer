import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input.jsx";
import AUTH_IMAGE from "../../assets/auth_image.jpg";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPath.js";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import uploadImage from "../../utils/uploadImage.js";
import toast from "react-hot-toast";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [fullName, setFullName] = useState("");

  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    // ✅ Validation toasts
    if (!fullName) {
      toast.error("Full name is required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      // ✅ upload image if present
      if (profilePic) {
        const uploadRes = await uploadImage(profilePic);
        profileImageUrl = uploadRes?.imageUrl || "";
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        {
          name: fullName,
          email,
          password,
          profileImageUrl,
          adminAccessToken,
        }
      );

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        toast.success("Account created successfully 🎉");
      }

      setOpenAuthForm(false);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Signup failed — try again";

      toast.error(msg);
    }
  };

  return (
    <div className="grid md:grid-cols-2 h-full">

      {/* LEFT */}
      <div className="flex items-center justify-center px-6 sm:px-10 py-10">
        <div className="w-full max-w-md">

          <h3 className="text-2xl font-semibold text-gray-900">
            Create Account
          </h3>

          <p className="text-sm text-gray-600 mt-2 mb-8">
            Enter your details below
          </p>

          <form onSubmit={handleSignUp} className="space-y-5">

            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
            />

            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              type="text"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="text"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
            />

            <Input
              value={adminAccessToken}
              onChange={(e) => setAdminAccessToken(e.target.value)}
              label="Admin Invite Token"
              type="number"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              Sign Up
            </button>

            <p className="text-sm text-center text-gray-700">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentPage("login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Log in
              </button>
            </p>

          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex items-center justify-center p-10">
        <img
          src={AUTH_IMAGE}
          alt="auth"
          className="w-full max-w-xl object-contain"
        />
      </div>

    </div>
  );
};

export default SignUp;
