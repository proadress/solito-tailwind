import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ElementData {
    id: string;
    type: string;//text,input,get,post
    value: string;
    post: string,
    color: string;
    fontsize: number;
    x: number;
    y: number;
}
interface User {
    email: string;
    password: string;
    name: string;
}

export const saveData = async (obj: ElementData) => {
    try {
        console.log("set", obj);
        const jsonobj = JSON.stringify(obj);
        await AsyncStorage.setItem(obj.id, jsonobj);
    } catch (e) {
        console.log(e);
    }
    return undefined;
};

export const saveUser = async (obj: User) => {
    try {
        console.log("setUser", obj);
        await AsyncStorage.setItem("user", JSON.stringify(obj));
    } catch (e) {
        console.log(e);
    }
}
export const getUser = async (): Promise<User | undefined> => {
    try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString) as User;
            console.log("getUser", user);
            return user;
        }
    } catch (e) {
        console.log(e);
    }
    // Return undefined if no user information is found
    return undefined;
}



export const getAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys != null) {
            const multiGetResults = await AsyncStorage.multiGet(keys);
            console.log(multiGetResults);

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
        const user = await getUser();
        await AsyncStorage.clear();
        if (user)
            await saveUser(user);
        console.log('clear');
    } catch (error) {
        console.error('error clear', error);
    }
};
