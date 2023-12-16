import React, { useState } from "react"
import { Text, TextInput, TextLink, H1 } from 'app/design/typography'
import { Row } from "app/design/layout";
import { clear, saveUser, getUser } from "./localStorge";
import { Pressable } from "react-native";
import { SolitoImage } from "solito/image";
import { View } from "app/design/view";




const Project: React.FC<{ initname: string }> = ({ initname }) => {
    const [name, setName] = useState(initname);

    return (
        <View className="w-[250px] h-[60px] border dark:border-white space-x-8 justify-center">
            <Row>
                <TextLink href="/user/use" >
                    <H1>{name} </H1>
                    <View className="w-[110px]"></View>
                </TextLink>
                <Row className=" float-right border dark:border-white justify-end">
                    <View className=" w-[35px] h-[35px] bg-gray-300 items-center justify-center">
                        <TextLink href="/user/edit">
                            <SolitoImage
                                src={require('./../assets/edit.png')}
                                height={25}
                                width={25}
                                alt=""
                            />
                        </TextLink>
                    </View>
                    <View className=" w-[35px] h-[35px] bg-gray-300 items-center justify-center">
                        <Pressable onPress={async () => clear()}>
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
export const ProjectCol: React.FC = () => {
    const user = getUser()
    return (
        <>
            <Project initname={"123"} />
        </>
    )
}
