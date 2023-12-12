import { useFetchPost } from "./fetchFunc";
import { clear, getAllData, saveData, ElementData } from "./localStorge";

export const useButton = () => {
    const { fetchPost, loading, error } = useFetchPost();

    const updateButton = async (id: string) => {
        try {
            const newData = await getAllData();
            const postData = { id: id, value: JSON.stringify(newData) };
            const result = await fetchPost('/api/update', postData);
            console.log('Data fetched successfully:', result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getButton = async (id: string) => {
        try {
            const postData = { id: id };
            const result = await fetchPost('/api/get', postData);
            console.log('Data fetched successfully:', result);

            const dataObject: ElementData[] = JSON.parse(result.value);
            console.log(dataObject);

            dataObject.forEach((item) => {
                saveData(item);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return { updateButton, getButton }
}