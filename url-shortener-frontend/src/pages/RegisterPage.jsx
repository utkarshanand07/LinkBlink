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
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/register",
                data
            );
            reset();
            navigate("/login");
            toast.success("Registration Successful!");
        } catch (error) {
            console.log(error);
            toast.error("Registration Failed!");
        } finally {
            setLoader(false);
        }
    };

  return (
    <div className='min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center items-center px-4'>
        
        <form 
            onSubmit={handleSubmit(registerHandler)}
            className="w-full max-w-md bg-white border border-gray-100 shadow-xl shadow-gray-200/40 py-10 px-8 rounded-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="font-extrabold text-black text-3xl tracking-tight mb-2">
                    Create an account.
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                    Sign up to start shortening your links.
                </p>
            </div>

            <div className="flex flex-col gap-5 mb-8">
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
                className={`w-full py-3.5 bg-black text-white font-medium rounded-lg transition-all duration-200 ${
                    loader ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-300"
                }`}
            >
                {loader ? "Creating account..." : "Sign up"}
            </button>

            <p className='text-center text-sm text-gray-500 mt-8 font-medium'>
                Already have an account?{" "}
                <Link
                    className='text-black font-bold hover:underline transition-all'
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