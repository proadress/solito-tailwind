import { useState, useEffect } from 'react';

const local = false;

export const fetchGet = (api: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const baseurl = local ? "http://127.0.0.1:8000" : "https://nextjs-fastapi-starter-nine-xi.vercel.app";

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
            setError(error.message || 'An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    };



    return { data, loading, error };
};

export const fetchPost = (api: string, id: string, value: string, x: number, y: number) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseurl = local ? "http://127.0.0.1:8000" : "https://nextjs-fastapi-starter-nine-xi.vercel.app";

    useEffect(() => {
        fetchData();
    }, [api, id, value, x, y]);

    const fetchData = async () => {
        try {
            const response = await fetch(baseurl + api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers as needed
                },
                body: JSON.stringify({
                    id: id,
                    value: value,
                    x: x,
                    y: y,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
            setError(error.message || 'An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error };
};
