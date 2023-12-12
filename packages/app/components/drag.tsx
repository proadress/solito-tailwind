import React, { useRef, useState, useEffect } from 'react';
import { View } from 'app/design/view';
import { Text, TextInput } from 'app/design/typography'
import { PanResponder, StyleSheet, Animated } from 'react-native';
import { saveData, ElementData } from './models/localStorge';
import { Row } from 'app/design/layout';
import { Pressable } from 'react-native';



export const DraggableElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const pan = useRef<any>(new Animated.ValueXY({ x: data.x, y: data.y })).current;
  const initialPosition = useRef({ x: 0, y: 0 });
  const [edit, setEdit] = useState(data);
  const [Draging, setDraging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = new Animated.Value(isExpanded ? 40 : 0);

  const handleToggle = () => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 40 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };


  useEffect(() => {
    saveData({ ...edit, x: pan.x._value, y: pan.y._value });
  }, [edit, Draging]);

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


  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        height: 0,
      }}
      {...panResponder.panHandlers}
    ><View className='border  w-[200px] dark:border-gray-50 border-gray-800 items-center justify-center '>
        <Row>
          <TextInput
            value={edit.value}
            style={{ color: edit.color, fontSize: data.fontsize }}
            className='dark:text-white text-center'
            onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
          />
          <Pressable onPress={handleToggle}>
            <View className=' bg-white'>
              <Text> = </Text>
            </View>
          </Pressable>
        </Row>
        <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
          <Row>
            <Text className='dark:text-white font-bold'>color:</Text>
            <TextInput
              value={edit.color}
              className='dark:text-white text-center'
              onChangeText={(newText) => { setEdit({ ...edit, color: newText }); }}
            />
          </Row>
          <Row>
            <Text className='dark:text-white font-bold'>size:</Text>
            <TextInput
              value={edit.fontsize.toString()}
              className='dark:text-white text-center'
              keyboardType="numeric"
              onChangeText={(newText) => {
                setEdit({
                  ...edit, fontsize:
                    newText ? parseInt(newText, 10) : 0
                });
              }}
            />
          </Row>
        </Animated.View>
      </View>
    </Animated.View >
  );
};


export const TextElement: React.FC<{ data: ElementData }> = ({ data }) => {
  console.log(data.value);

  return (
    <View className=' absolute items-center justify-center' style={{ transform: [{ translateX: data.x-10 }, { translateY: data.y }] }}>
      <Text
        className="dark:text-gray-50 text-center"
        style={{ fontSize: data.fontsize, color: data.color }}
      >
        {data.value}
      </Text>
    </View>
  );
};