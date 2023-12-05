import React, { useState } from 'react';
import { View } from 'app/design/view';
import { Text } from 'app/design/typography';
import { Pressable, TextInput } from 'react-native';

const MyTextInput = () => {
    const [input, setInput] = useState('');

    const handleInput = (text: string) => {
        setInput(text);
    };

    const handleSubmit = () => {
        console.log('Submitted:', input);
    };

    return (
        <View>
            <Text >buttonName</Text>
            <TextInput
                keyboardType="default"
                onChangeText={handleInput}
                value={input}
            />
            {/* 添加 Pressable 作为提交按钮 */}
            <Pressable
                onPress={handleSubmit}
            >
                <Text >Submit</Text>
            </Pressable>
        </View>
    );
};

export default MyTextInput;
