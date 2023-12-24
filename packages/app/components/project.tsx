import React, { useEffect, useState } from "react"
import { Text, TextInput, TextLink, H1 } from 'app/design/typography'
import { Row } from "app/design/layout";
import { projectManager, ProjectData } from "./localStorge";
import { Pressable } from "react-native";
import { SolitoImage } from "solito/image";
import { View } from "app/design/view";


export const ProjectCol: React.FC = () => {
    const { projects, saveProject, addProject, deleteProject, clear, getAllUidData } = projectManager();
    const [name, setName] = useState("");


    return (
        <>
            <View className="h-[10px]"></View>
            <Row className="space-x-1">
                <TextInput
                    onChangeText={(newText) => setName(newText)}
                    value={name}
                    className=' focus:bg-neutral-300 dark:bg-neutral-500 dark:text-white border-b px-2 rounded-full focus:scale-105'
                    placeholder="(請輸入專案名稱)"
                ></TextInput>
                <Pressable onPress={() => {
                    if (name !== "")
                        addProject(name);
                }}>
                    <Text className='bg-pink-500 text-white px-2 py-1 rounded-full transition-transform transform hover:scale-105'>
                        新專案
                    </Text>
                </Pressable>
                <Pressable onPress={getAllUidData}>
                    <Text className='bg-green-600 text-white px-2 py-1 rounded-full transition-transform transform hover:scale-105'>
                        刷新
                    </Text>
                </Pressable>
                <Pressable onPress={async () => clear()}>
                    <Text className='bg-red-600 text-white py-1 px-2 rounded-full transition-transform transform hover:scale-105'>
                        清除
                    </Text>
                </Pressable>
            </Row>
            <View className="h-10"></View>
            {projects ? (
                projects.map((project) => <Project key={project.id} project={project} del={deleteProject} saveProject={saveProject} />)
            ) : (
                <Text>no project</Text>
            )}
        </>
    )
}
const Project: React.FC<{ project: ProjectData, saveProject: (id: string, value: string) => void, del: (id: string) => Promise<void> }> = ({ project, saveProject, del }) => {
    const [clip, setclip] = useState("");

    useEffect(() => {
        setclip(project.value);
        console.log(project.value);
    }, [project]);

    return (
        <Row className='mt-2 w-60 py-2 px-4 justify-center bg-rose-300 rounded-3xl transition-transform transform hover:scale-105 space-x-2 border-4 border-rose-400'>
            <Row className="flex flex-auto justify-between">
                <TextLink href={`/user/u${project.id}`}>
                    <Text className="text-black text-xl font-extrabold">{project.name}</Text>
                </TextLink>
                <TextInput
                    value={clip}
                    className='bg-blue-400 text-white px-2 rounded-full w-10'
                    onChangeText={(newText) => setclip(newText)}
                    onBlur={() => {
                        saveProject(project.id, clip);
                        setclip(project.value);
                    }}
                />
            </Row>
            <Row className=" justify-end items-center space-x-2">
                <TextLink href={`/user/e${project.id}`}>
                    <SolitoImage
                        src={require('./../assets/edit.png')}
                        height={25}
                        width={25}
                        alt=""
                    />
                </TextLink>
                <Pressable onPress={async () => {
                    console.log(project.id);
                    del(project.id);
                }}>
                    <SolitoImage
                        src={require('./../assets/trash.png')}
                        height={30}
                        width={30}
                        alt=""
                    />
                </Pressable>
            </Row>
        </Row>

    );
};

