import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../components/TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosApi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: { username: "", email: "", password: "" },
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post("/api/auth/public/register", data);
            reset();
            navigate("/login");
            toast.success("Registration Successful!");
        } catch (error) {
            toast.error("Registration Failed!");
        } finally {
            setLoader(false);
        }
    };

  return (
    <div className='min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex justify-center items-center px-4 relative overflow-hidden'>
        
        {/* Enhanced Background Glow (Purple for Register) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <form 
            onSubmit={handleSubmit(registerHandler)}
            className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-premium dark:shadow-glass-dark py-12 px-8 sm:px-10 rounded-[2rem] z-10 transition-all duration-300"
        >
            <div className="text-center mb-10">
                <h1 className="font-extrabold text-slate-900 dark:text-white text-3xl tracking-tight mb-2">
                    Create an account.
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Sign up to start scaling your links.
                </p>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                <TextField
                    label="Username"
                    required
                    id="username"
                    type="text"
                    message="*Username is required"
                    placeholder="Choose a username"
                    register={register}
                    errors={errors}
                />

                <TextField
                    label="Email"
                    required
                    id="email"
                    type="email"
                    message="*Email is required"
                    placeholder="Enter your email"
                    register={register}
                    errors={errors}
                />

                <TextField
                    label="Password"
                    required
                    id="password"
                    type="password"
                    message="*Password is required"
                    placeholder="Create a password"
                    register={register}
                    min={6}
                    errors={errors}
                />
            </div>

            <button
                disabled={loader}
                type='submit'
                className={`w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl tracking-wide transition-all duration-200 shadow-md active:scale-95 ${
                    loader ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800 dark:hover:bg-slate-100"
                }`}
            >
                {loader ? "Creating account..." : "Sign up"}
            </button>

            <p className='text-center text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium'>
                Already have an account?{" "}
                <Link
                    className='text-slate-900 dark:text-white font-bold hover:underline transition-all'
                    to="/login"
                >
                    Log in
                </Link>
            </p>
        </form>
    </div>
  )
}

export default RegisterPage;