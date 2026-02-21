import React, { useState } from 'react';
import { useStoreContext } from '../../contextApi/ContextApi';
import { useForm } from 'react-hook-form';
import TextField from '../../components/TextField';
import { Tooltip } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import api from '../../api/axiosApi';
import toast from 'react-hot-toast';

const CreateNewShorten = ({ setOpen, refetch }) => {
    const { token } = useStoreContext();
    const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: "",
    },
    mode: "onTouched",
  });

  const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
        const { data: res } = await api.post("/api/urls/shorten", data, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          });

          const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${res.shortUrl}`}`;
          navigator.clipboard.writeText(shortenUrl).then(() => {
            toast.success("Short URL Copied to Clipboard", {
                position: "bottom-center",
                className: "mb-5",
                duration: 3000,
            });
          });

          // THIS IS THE MAGIC LINE: It triggers the dashboard to update instantly
          if (refetch) {
              await refetch();
          }
          
          reset();
          setOpen(false);
    } catch (error) {
        toast.error("Create ShortURL Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full max-w-md">
      <form
        onSubmit={handleSubmit(createShortUrlHandler)}
        className="w-full bg-white relative shadow-2xl shadow-black/10 py-8 px-6 sm:px-8 rounded-2xl"
      >
        
        {/* Header Section */}
        <div className="mb-6 pr-8">
            <h1 className="font-extrabold text-black text-2xl tracking-tight mb-1">
                Create short link.
            </h1>
            <p className="text-gray-500 text-sm font-medium">
                Paste your long URL below to instantly shorten it.
            </p>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <TextField
            label="Destination URL"
            required
            id="originalUrl"
            placeholder="https://example.com/very/long/path"
            type="url"
            message="Please enter a valid URL"
            register={register}
            errors={errors}
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className={`w-full py-3.5 bg-black text-white font-medium rounded-lg transition-all duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-300"
          }`}
          type="submit"
        >
          {loading ? "Creating..." : "Shorten URL"}
        </button>

        {/* Close Button */}
        {!loading && (
          <Tooltip title="Close">
            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors duration-200 focus:outline-none"
              aria-label="Close form"
            >
              <RxCross2 className="text-xl" />
            </button>
          </Tooltip>
        )}

      </form>
    </div>
  )
}

export default CreateNewShorten;