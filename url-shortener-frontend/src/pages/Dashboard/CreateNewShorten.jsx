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

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { originalUrl: "" },
    mode: "onTouched",
  });

  const createShortUrlHandler = async (data) => {
    setLoading(true);
    try {
        const { data: res } = await api.post("/api/urls/shorten", data, { headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Bearer " + token } });
        const shortenUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${res.shortUrl}`;
        navigator.clipboard.writeText(shortenUrl).then(() => toast.success("Short URL Copied!"));
        if (refetch) await refetch();
        reset();
        setOpen(false);
    } catch (error) {
        toast.error("Failed to create Short URL");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full max-w-md">
      <form onSubmit={handleSubmit(createShortUrlHandler)} className="w-full bg-white/90 dark:bg-brand-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 relative shadow-premium dark:shadow-glass-dark py-10 px-8 rounded-[2rem]">
        
        <div className="mb-8 pr-8">
            <h1 className="font-black text-slate-900 dark:text-white text-3xl tracking-tight mb-2">Create short link.</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Paste your long URL below to instantly shorten it.</p>
        </div>

        <div className="mb-8">
          <TextField
            label="Destination URL"
            required id="originalUrl" type="url"
            placeholder="https://example.com/long/path"
            message="Please enter a valid URL"
            register={register} errors={errors}
          />
        </div>

        <button disabled={loading} type="submit" className={`w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl tracking-wide transition-all duration-200 active:scale-95 shadow-lg shadow-black/5 dark:shadow-white/5 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800 dark:hover:bg-slate-100"}`}>
          {loading ? "Creating..." : "Shorten URL"}
        </button>

        {!loading && (
          <Tooltip title="Close">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-5 top-5 p-2.5 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-brand-800 rounded-full transition-colors duration-200">
              <RxCross2 className="text-xl" />
            </button>
          </Tooltip>
        )}
      </form>
    </div>
  )
}

export default CreateNewShorten;