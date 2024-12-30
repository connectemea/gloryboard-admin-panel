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
    ).style.background = `radial-gradient(circle at ${x}% ${y}%, #1a1a1a, #000000)`;

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
          className="border p-8 rounded shadow-md w-full"
        >
          <h2 className="text-4xl font-bold text-left text-primary">
            Welcome back!
          </h2>
          <p className="mb-10 text-sm text-white/50">Login to your account</p>
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
      </div>
    </div>
  );
}

export default Login;
