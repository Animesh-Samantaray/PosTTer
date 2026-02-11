import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input.jsx";
import AUTH_IMAGE from "../../assets/auth_image.jpg";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPath.js";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import uploadImage from '../../utils/uploadImage.js'

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [fullName, setFullName] = useState("");

  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER , {
          name:fullName,
          email,
          password,
          profileImageUrl,
          adminAccessToken
        });

        const {token , role} = response.data;

        if(token){
          localStorage.setItem('token',token);
          updateUser(response.data)
        }

        if(role==='admin'){
          setOpenAuthForm(false);
          navigate('/admin/dashboard');
        }
        navigate('/')
        setOpenAuthForm(false);
      
    } catch (error) {
      if (error.response && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Try again");
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 h-full">

      {/* ===== LEFT — FORM ===== */}
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
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Animesh"
              type="text"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="name@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
            />

            <Input
              value={adminAccessToken}
              onChange={(e) => setAdminAccessToken(e.target.value)}
              label="Admin Invite Token"
              placeholder="6 digit code"
              type="number"
            />

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="
                w-full
                bg-blue-600 hover:bg-blue-700
                text-white
                py-3
                rounded-lg
                font-medium
                transition
              "
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

      {/* ===== RIGHT — IMAGE ===== */}
      <div className="hidden md:flex items-center justify-center p-10">
        <img
          src={AUTH_IMAGE}
          alt="auth"
          className="
            w-full
            max-w-xl
            lg:max-w-2xl
            max-h-[540px]
            lg:max-h-[680px]
            object-contain
          "
        />
      </div>

    </div>
  );
};

export default SignUp;
