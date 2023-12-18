import { useState, useEffect } from 'react';

const local = true;
const baseurl = local ? "http://127.0.0.1:8000" : "https://nextjs-fastapi-starter-nine-xi.vercel.app";

export const fetchGet = (api: string) => {
    const [getdata, setGetData] = useState('');
    const [getloading, setLoading] = useState(true);
    const startGet = async () => {
        setLoading(true);
        try {
            const response = await fetch(api);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setGetData(result)
        } catch (error: any) {
            console.error('Error fetching data:', error);
            setGetData("error")
        } finally {
            setLoading(false);
        }
    };
    return { getdata, getloading, startGet };
};

export const fetchPost = (api: string) => {
    const [postdata, setPostData] = useState("none")
    const [loading, setLoading] = useState(false);

    const startPost = async (inputdata: string) => {
        setLoading(true);
        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers as needed
                },
                body: inputdata,
            });
            const result = await response.json();
            console.log(result);
            setPostData(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
            setPostData('error');
        } finally {
            setLoading(false);
        }
    };
    return { postdata, loading, startPost };
};
