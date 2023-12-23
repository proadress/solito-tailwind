import React, { useEffect, useState } from "react"
import { Text, TextInput, TextLink, H1 } from 'app/design/typography'
import { Row } from "app/design/layout";
import { projectManager, ProjectData } from "./localStorge";
import { Pressable } from "react-native";
import { SolitoImage } from "solito/image";
import { View } from "app/design/view";


export const ProjectCol: React.FC = () => {
    const { projects, saveProject, addProject, deleteProject, clear } = projectManager();
    const [name, setName] = useState("");


    return (
        <>

            <View className="h-[10px]"></View>
            <Row className=" space-x-8">
                <Row>
                    <TextInput
                        onChangeText={(newText) => setName(newText)}
                        value={name}
                        // className="border dark:border-white"
                        className=' bg-neutral-300 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'
                        placeholder="(請輸入專案名稱)"
                    ></TextInput>
                    <Pressable onPress={() => {
                        if (name !== "")
                            addProject(name);
                    }}>
                        <Text className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
                            新專案
                        </Text>
                    </Pressable>
                </Row>
                <Pressable onPress={async () => clear()}>
                    <Text className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
                        全部清除
                    </Text>
                </Pressable>
            </Row>
            <View className="h-10"></View>
            <View className=" space-y-4">
                {projects ? (
                    projects.map((project) => <Project key={project.id} project={project} del={deleteProject} saveProject={saveProject} />)
                ) : (
                    <Text>no project</Text>
                )}
            </View>
        </>
    )
}
const Project: React.FC<{ project: ProjectData, saveProject: (id: string, value: string) => void, del: (id: string) => Promise<void> }> = ({ project, saveProject, del }) => {
    const [clip, setclip] = useState("");

    useEffect(() => {
        setclip(project.value);
        console.log(project.value);
    }, []);

    return (
        <View className="w-[250px] h-[60px] space-x-8 justify-center">
            <Row className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
                <TextLink href={`/user/u${project.id}`} className=" my-2">
                    <H1 className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
                        {project.name}
                    </H1>
                </TextLink>
                <Row className=" items-center">
                    <View className="w-[20px]"></View>
                    <TextInput
                        value={clip}
                        className='bg-blue-500 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-700 hover:to-green-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md w-[60px]'
                        onChangeText={(newText) => setclip(newText)}
                        onBlur={() => {
                            saveProject(project.id, clip);
                            setclip(project.value);
                        }}
                    ></TextInput>
                    <View className=" w-[35px] h-[35px] items-center justify-center">
                        <TextLink href={`/user/e${project.id}`}>
                            <SolitoImage
                                src={require('./../assets/edit.png')}
                                height={25}
                                width={25}
                                alt=""
                            />
                        </TextLink>
                    </View>
                    <View className=" w-[35px] h-[35px] items-center justify-center">
                        <Pressable onPress={async () => {
                            console.log(project.id);
                            del(project.id)
                        }}>
                            <SolitoImage
                                src={require('./../assets/trash.png')}
                                height={30}
                                width={30}
                                alt=""
                            />
                        </Pressable>
                    </View>
                </Row>
            </Row>
        </View >
    );
};

