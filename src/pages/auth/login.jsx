import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { loginInitalValue } from "@/constants/initalValue";
import { loginSchema } from "@/constants/validationSchemas";
import { AuthContext } from "@/context/authContext";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginHead from '@/assets/login_head.svg';
import ProductLogo from '@/assets/p_logo2.svg';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/participants");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: loginInitalValue,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("values", values);
        const { data } = await axiosInstance.post("/login", values);
        console.log(data);
        login(data.data.accessToken, data.data.user);
        navigate("/participants");
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Login failed", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleMouseMove = (e) => {
    // Background gradient effect
    const x = (e.clientX / window.innerWidth) * 90;
    const y = (e.clientY / window.innerHeight) * 90;
    document.querySelector(
      ".login-background"
    ).style.background = `radial-gradient(circle at ${x}% ${y}%, #1a1a1a, #071820)`;

    // Logo movement effect
    const logo = document.querySelector(".floating-logo");
    if (logo) {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20; // -10px to +10px movement
      const moveY = (e.clientY / window.innerHeight - 0.5) * 20; // -10px to +10px movement

      logo.style.transform = `translate(${moveX}px, ${moveY}px)`;
      logo.style.transition = "transform 0.2s ease-out";
    }
  };


  return (
    <div
      onMouseMove={handleMouseMove}
      className="flex items-center flex-col justify-center h-screen relative login-background select-none"
    >
      <div className="relative w-full max-w-sm" >
        {/* <img 
        className="lg:absolute -top-16 floating-logo -right-16 z-10 animate-in slide-in-from-right-1/2 slide-in-from-top-1/2 duration-500 opacity-80"  
        src="/pet.png" 
        alt="logo" 
        width={140} 
      /> */}
        <form
          onSubmit={formik.handleSubmit}
          className="border border-gray-400 rounded-2xl p-8  shadow-md w-full bg-[#0D1E26] z-30 relative mb-10"
        >
          <img src={LoginHead} alt="Login" className="mx-auto mt-1 mb-4" />
          <div className="bg-transparent absolute top-0 left-0 w-full  z-0 h-[150px]" />
          <h2 className="text-4xl font-bold text-left text-primary">
            Welcome back!
          </h2>
          <p className="mb-5 text-sm text-white/50">Login to your account</p>
          <div>
            <Input
              name="email"
              label="Email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>
        <img src={ProductLogo} alt="Logo" className="h-10  mx-auto " />
      </div>
      <div className='absolute w-full flex min-h-screen flex-col justify-between top-0 bottom-0 z-0'>
        <div className='relative w-full z-0'>
          <div className='rounded-full w-48 h-48 z-0 bg-[#0CA5EA] blur-[95px] absolute top-20 right-[100px]' />
        </div>
        <div className='relative w-full z-0'>
          <div className='rounded-full w-48 h-48 bg-[#0CA5EA] blur-[95px] absolute left-[100px] bottom-20' />
        </div>
      </div>
    </div>
  );
}

export default Login;
