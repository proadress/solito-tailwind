import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key: string, value: string) => {
    try {
        console.log("set", key, value);
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
    }
};

export const getAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys != null) {
            const multiGetResults = await AsyncStorage.multiGet(keys);
            const data = multiGetResults.reduce((acc: Record<string, any>, [key, value]) => {
                if (key.length == 36)
                    acc[key] = value; // 將每個 key-value 對添加到對象中
                return acc;
            }, {});
            console.log('Data:', data);

            return data;
        }
        return {};
    } catch (error) {
        console.error('Error retrieving keys:', error);
        return {};
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
