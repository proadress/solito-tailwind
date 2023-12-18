import React, { useState } from "react"
import { Text, TextInput, TextLink, H1 } from 'app/design/typography'
import { Row } from "app/design/layout";
import { projectManager } from "./localStorge";
import { Pressable } from "react-native";
import { SolitoImage } from "solito/image";
import { View } from "app/design/view";

export const ProjectCol: React.FC = () => {
    const { projects, addProject, deleteProject, clear } = projectManager();
    const [name, setName] = useState("");
    return (
        <>
            <Row className=" space-x-8">
                <Row>
                    <TextInput
                        onChangeText={(newText) => setName(newText)}
                        value={name}
                        placeholder="(請輸入專案名稱)"
                    ></TextInput>
                    <Pressable onPress={async () => addProject(name)}>
                        <Text>add</Text>
                    </Pressable>
                </Row>
                <Pressable onPress={async () => clear()}>
                    <Text>clear</Text>
                </Pressable>
            </Row>
            {projects ? (
                projects.map((project) => <Project key={project.id} initname={project.name} id={project.id} del={deleteProject} />)
            ) : (
                <Text>no project</Text>
            )}
        </>
    )
}
const Project: React.FC<{ initname: string, id: string, del: (id: string) => Promise<void> }> = ({ initname, id, del }) => {
    const [name, setName] = useState(initname);

    return (
        <View className="w-[250px] h-[60px] border dark:border-white space-x-8 justify-center">
            <Row>
                <TextLink href={`/user/u${id}`} >
                    <H1>{name} </H1>
                    <View className="w-[110px]"></View>
                </TextLink>
                <Row className=" float-right border dark:border-white justify-end">
                    <View className=" w-[35px] h-[35px] bg-gray-300 items-center justify-center">
                        <TextLink href={`/user/e${id}`}>
                            <SolitoImage
                                src={require('./../assets/edit.png')}
                                height={25}
                                width={25}
                                alt=""
                            />
                        </TextLink>
                    </View>
                    <View className=" w-[35px] h-[35px] bg-gray-300 items-center justify-center">
                        <Pressable onPress={async () => {
                            console.log(id);
                            del(id)
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

