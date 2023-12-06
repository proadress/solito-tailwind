import React, { useRef, useState, useEffect } from 'react';
import { View } from 'app/design/view';
import { Text, TextInput } from 'app/design/typography'
import { PanResponder, StyleSheet, Animated } from 'react-native';
import { setData } from './models/localStorge';

interface DraggableElementProps {
  initialX: number;
  initialY: number;
  value: string;
  inputId: string;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({ inputId, value, initialX, initialY }) => {
  const pan = useRef<any>(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const initialPosition = useRef({ x: 0, y: 0 });
  const [editText, setEditText] = useState(value);
  const [Draging, setDraging] = useState(false);

  useEffect(() => {
    const s = {
      "value": editText, "x": pan.x._value, "y": pan.y._value
    }
    setData(inputId, JSON.stringify(s));
  }, [editText, Draging]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // 在拖曳開始時，記錄元素的初始位置
      initialPosition.current = { x: pan.x._value, y: pan.y._value };
    },
    onPanResponderMove: (event, gestureState) => {
      // 計算偏移，並將 pan.x 和 pan.y 設置為初始位置加上偏移
      pan.setValue({
        x: initialPosition.current.x + gestureState.dx,
        y: initialPosition.current.y + gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      setDraging(!Draging);
    },
  });
  const handleInputChange = (newText: string) => {
    setEditText(newText);
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        width: 0,
        height: 0,
      }}
      {...panResponder.panHandlers}
    ><View className='border h-[100px] w-[100px] dark:border-gray-50 border-gray-800 items-center justify-center'>
        <TextInput
          className="dark:text-gray-50 text-center"
          value={editText}
          onChangeText={handleInputChange}
        />
      </View>
    </Animated.View>
  );
};