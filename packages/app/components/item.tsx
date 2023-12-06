import React, { useRef, useState, useEffect } from 'react';
import { Text, TextInput } from 'app/design/typography'
import { View } from 'moti';

interface TextElementProps {
    initialX: number;
    initialY: number;
    value: string;
    inputId: string;
}

export const TextElement: React.FC<TextElementProps> = ({ inputId, value, initialX, initialY }) => {
    const textClassName = `absolute left-[${initialX}px] top-[${initialY}px]`;

    console.log(initialX, initialY);
    return (
        <View className={textClassName}>
            <View className="w-[100px] h-[100px] absolute left-[10px] top-[15px] bg-red-500"></View>
            <Text className='dark:text-gray-50 text-center'>
                {value}
            </Text>
        </View>
    );
};