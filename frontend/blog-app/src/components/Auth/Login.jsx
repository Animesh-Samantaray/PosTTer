import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input";
import AUTH_IMAGE from "../../assets/auth_image.jpg";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser,setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError('Please enter valid email address');
      return;
    }
    if(!password){
      setError('Please enter the password');
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN , {
        email,password
      });

      const {token,role}=response.data;
      if(token){
        localStorage.setItem('token' , token);
        updateUser(response.data);

        if(role==='admin'){
          setOpenAuthForm(false);
          navigate('/admin/dashboard');
        }

        setOpenAuthForm(false)
      }
    } catch (error) {
      if(error.response && error.response?.data?.message){
        setError(error.response.data.message)
      }else{
        setError('Something went wrong. Try again')
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 h-full">

      {/* FORM SIDE */}
      <div className="flex items-center justify-center px-6 sm:px-10 py-10">
        <div className="w-full max-w-md">

          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-600 mt-2 mb-8">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

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
              Login
            </button>

            <p className="text-sm text-center text-gray-700">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentPage("signup")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>

          </form>
        </div>
      </div>

      {/* IMAGE SIDE — only md+ */}
      <div className="hidden md:flex items-center justify-center p-10">
        <img
          src={AUTH_IMAGE}
          alt="auth"
          className="
            w-full
            max-w-xl
            lg:max-w-2xl
            max-h-[520px]
            lg:max-h-[640px]
            object-contain
          "
        />
      </div>

    </div>
  );
};

export default Login;
