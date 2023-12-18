import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';

export interface ElementData {
    id: string;
    projectID: string
    type: string;//text,input,get,post
    value: string;
    post: string,
    color: string;
    fontsize: number;
    x: number;
    y: number;
};
interface AuthContextProps {
    user?: User;
    checkSignin: () => void;
    saveUser: (obj: User) => void;
};
interface User {
    email: string;
    password: string;
    name: string;
    project: Project[];
};
export interface Project {
    id: string
    name: string;
    value: string;
};

export const projectManager = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [items, setItems] = useState<ElementData[]>([]);
    const [currentId, setCurrentId] = useState("");
    let startTime = performance.now();

    useEffect(() => {
        console.log('start project');
        getAllUidData();
    }, []);

    useEffect(() => {
        saveData();
    }, [projects]);

    const startPage = async (id: string) => {
        setCurrentId(id);
        if (projects) {
            const project = projects.find((project) => project.id === id)!;
            if (project !== undefined && project.value !== "")
                setItems(JSON.parse(project.value));
        }
    }

    const saveData = async () => {
        try {
            if (projects) {
                // 將 projects 數組轉換為鍵值對數組
                const projectsKeyValuePairs: [string, string][] = projects.map((project) => [project.id, JSON.stringify(project)]);
                // 使用 multiSet 一次性將多個鍵值對存儲到 AsyncStorage 中
                await AsyncStorage.multiSet(projectsKeyValuePairs);
                console.log('Projects saved successfully');
            }
        } catch (error) {
            console.log('Error saving projects:', error);
        }
    }

    const getAllUidData = async () => {
        try {
            startTime = performance.now();
            const keys = await AsyncStorage.getAllKeys();
            // 如果 keys 不存在或是空陣列，直接返回空陣列
            if (!keys || keys.length === 0) {
                return [];
            }
            const multiGetResults = await AsyncStorage.multiGet(keys);
            // 使用 Array.map 將結果轉換為 Project 對象陣列
            const data: Project[] = multiGetResults
                .filter(([key, value]) => key !== null && key.length === 36 && value !== null)
                .map(([key, value]) => {
                    const storedProject: Project = JSON.parse(value!);
                    const { name, value: combinedValue } = storedProject;
                    return {
                        ...storedProject,
                        combinedValue,
                    };
                });

            setProjects(data);
        } catch (error) {
            console.error('Error retrieving keys:', error);
            return [];
        }
    };


    const addProject = async (name: string) => {
        const project: Project = {
            id: v4(),
            name: name,
            value: ""
        }
        if (projects) {
            setProjects([...projects, project]);
        }
        else {
            setProjects([project]);
        }
    };
    const deleteProject = async (id: string) => {
        if (projects) {
            setProjects(projects.filter((project) => project.id !== id));
            await AsyncStorage.removeItem(id);
        }
    };

    const saveElement = async (obj: ElementData) => {
        const index = items.findIndex(element => element.id === obj.id);
        if (index !== -1) {
            // 如果找到相同 id 的元素，更新它
            items[index] = obj;
            console.log("update", obj);
        } else {
            // 如果沒有找到相同 id 的元素，將新元素添加到 items 中
            items.push(obj);
            console.log("push", obj);
        }
        // 現在的 items 數組已經包含了更新後的元素
        console.log(items);
        const p = projects?.map((project) => {
            if (project.id === currentId) {
                project.value = JSON.stringify(items);
                return project;
            }
            // 如果不是目標項目，保持原樣
            return project;
        });
        setProjects(p);
    };
    const clear = async () => {
        await AsyncStorage.clear();
        setProjects([]);
    }
    return { projects, items, setItems, addProject, deleteProject, startPage, saveElement, clear, getAllUidData }
}
// 創建上下文，並指定上下文的預設值
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 上下文提供者
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User>();
    const checkUser = async () => {
        try {
            // 使用 await 等待異步操作完成
            const userExists = await getUser();
            setUser(userExists)
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    // 使用Effect進行初始化檢查
    useEffect(() => {
        // 呼叫異步函數
        checkUser();
    }, []); // 空的依賴數組表示只在組件第一次渲染時執行

    const checkSignin = () => checkUser();
    const saveUser = async (obj: User) => {
        try {
            console.log("setUser", obj);
            await AsyncStorage.setItem("user", JSON.stringify(obj));
        } catch (e) {
            console.log(e);
        };
    }
    return (
        <AuthContext.Provider value={{ user, checkSignin, saveUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const getUser = async (): Promise<User | undefined> => {
    try {
        const startTime = performance.now();
        const userString = await AsyncStorage.getItem("user");
        if (!userString) return undefined
        const user = JSON.parse(userString) as User;
        const t = (performance.now() - startTime).toFixed(2);
        console.log("getUser", user, t, "ms");
        return user;
    } catch (e) {
        console.log(e);
    }
    return undefined;
}
