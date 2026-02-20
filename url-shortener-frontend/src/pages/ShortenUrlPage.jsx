import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

const ShortenUrlPage = () => {
    const { url } = useParams();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (url && !hasRedirected.current) {
            hasRedirected.current = true; 
            
            window.location.href = import.meta.env.VITE_BACKEND_URL + `/${url}`;
        }
    }, [url]);

  return <p>Redirecting...</p>;
}

export default ShortenUrlPage