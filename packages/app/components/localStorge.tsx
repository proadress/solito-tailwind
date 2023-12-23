import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';

export interface ElementData {
    id: string;
    projectID: string
    type: string;//text,input,get,post
    value: string;
    post: string;
    x: number;
    y: number;
};

export interface ProjectData {
    id: string
    name: string;
    value: string;
};

export const projectManager = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [items, setItems] = useState<ElementData[]>([]);
    const [currentId, setCurrentId] = useState("");

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
            const keys = await AsyncStorage.getAllKeys();
            // 如果 keys 不存在或是空陣列，直接返回空陣列
            if (!keys || keys.length === 0) {
                return [];
            }
            const multiGetResults = await AsyncStorage.multiGet(keys);
            // 使用 Array.map 將結果轉換為 Project 對象陣列
            const data: ProjectData[] = multiGetResults
                .filter(([key, value]) => key !== null && key.length === 36 && value !== null)
                .map(([key, value]) => {
                    const storedProject: ProjectData = JSON.parse(value!);
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
        const project: ProjectData = {
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

    const saveProject = (id: string, value: string) => {
        const p = projects?.map((project) => {
            if (project.id === id) {
                project.value = value;
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
    return { projects, items, setItems, addProject, deleteProject, startPage, saveElement, clear, getAllUidData, setProjects, saveProject }
}

