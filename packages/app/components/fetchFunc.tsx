import { useState, useEffect } from 'react';

const local = false;
export const baseurl = local ? "http://127.0.0.1:8000" : "https://nextjs-fastapi-starter-nine-xi.vercel.app";


export const fetchGet = (api: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await fetch(baseurl + api);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (error: any) {
            // Handle error
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading };
};

export const useFetchPost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPost = async (api: string, data: object) => {
        setLoading(true);

        try {
            const response = await fetch(`${baseurl}${api}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error('Error fetching data:', error);
            setError(error.message || 'An error occurred while fetching data.');
            throw error; // rethrow the error to let the caller handle it
        } finally {
            setLoading(false);
        }
    };

    return { fetchPost, loading, error };
};
