import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ElementData {
    id: string;
    name: string;
    type: string;//text,input,get,post
    value: string;
    post: string,
    color: string;
    fontsize: number;
    x: number;
    y: number;
}

export const saveData = async (obj: ElementData) => {
    try {
        console.log("set", obj);
        const jsonobj = JSON.stringify(obj);
        await AsyncStorage.setItem(obj.id, jsonobj);
    } catch (e) {
        // saving error
    }
};


export const getAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys != null) {
            const multiGetResults = await AsyncStorage.multiGet(keys);
            const data: ElementData[] = multiGetResults.reduce(
                (acc: ElementData[], [key, value]) => {
                    if (key !== null && key.length === 36 && value !== null) {
                        acc.push(JSON.parse(value));
                    }
                    return acc;
                },
                []
            );
            console.log('Data:', data);

            return data;
        }
        return [];
    } catch (error) {
        console.error('Error retrieving keys:', error);
        return [];
    }
};



export const clear = async () => {
    try {
        await AsyncStorage.clear();
        console.log('clear');
    } catch (error) {
        console.error('error clear', error);
    }
};
