import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../components/TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosApi';
import toast from 'react-hot-toast';
import { useStoreContext } from '../contextApi/ContextApi';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const { setToken } = useStoreContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: { username: "", email: "", password: "" },
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post("/api/auth/public/login", data);
            setToken(response.token);
            localStorage.setItem("JWT_TOKEN", JSON.stringify(response.token));
            toast.success("Login Successful!");
            reset();
            navigate("/dashboard");
        } catch (error) {
            toast.error("Login Failed!");
        } finally {
            setLoader(false);
        }
    };

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-brand-950 transition-colors duration-300 flex justify-center items-center px-4 relative overflow-hidden'>
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <form 
            onSubmit={handleSubmit(loginHandler)}
            className="w-full max-w-md bg-white/80 dark:bg-brand-900/50 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-premium dark:shadow-glass-dark py-12 px-8 sm:px-10 rounded-[2rem] z-10 transition-all duration-300"
        >
            <div className="text-center mb-10">
                <h1 className="font-black text-slate-900 dark:text-white text-3xl tracking-tight mb-2">
                    Welcome back.
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Enter your details to access your links.
                </p>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                <TextField
                    label="Username"
                    required
                    id="username"
                    type="text"
                    message="*Username is required"
                    placeholder="Type your username"
                    register={register}
                    errors={errors}
                />

                <TextField
                    label="Password"
                    required
                    id="password"
                    type="password"
                    message="*Password is required"
                    placeholder="Type your password"
                    register={register}
                    min={6}
                    errors={errors}
                />
            </div>

            <button
                disabled={loader}
                type='submit'
                className={`w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl tracking-wide transition-all duration-200 shadow-lg shadow-black/5 dark:shadow-white/5 active:scale-95 ${
                    loader ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800 dark:hover:bg-slate-100"
                }`}
            >
                {loader ? "Logging in..." : "Log in"}
            </button>

            <p className='text-center text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium'>
                Don't have an account?{" "}
                <Link
                    className='text-slate-900 dark:text-white font-bold hover:underline transition-all'
                    to="/register"
                >
                    Sign up
                </Link>
            </p>
        </form>
    </div>
  )
}

export default LoginPage;