import React, { useRef, useState, useEffect } from 'react';
import { View } from 'app/design/view';
import { Text } from 'app/design/typography'
import { PanResponder, StyleSheet, Animated, TextInput } from 'react-native';
import { setData } from './models/localStorge';
// import { fetchPost } from './fetchFunc';

interface DraggableElementProps {
  initialX: number;
  initialY: number;
  value: string;
  inputId: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ inputId, value, initialX, initialY }) => {
  const pan = useRef<any>(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const initialPosition = useRef({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(value);
  const [isDraging, setIsDraging] = useState(false);

  useEffect(() => {
    const s = {
      "value": editText, "x": pan.x._value, "y": pan.y._value
    }
    setData(inputId, JSON.stringify(s));
  }, [editText, pan.x._value, pan.y._value]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // 在拖曳開始時，記錄元素的初始位置
      initialPosition.current = { x: pan.x._value, y: pan.y._value };
    },
    onPanResponderMove: (event, gestureState) => {
      // 計算偏移，並將 pan.x 和 pan.y 設置為初始位置加上偏移
      if (!isDraging) setIsDraging(true);
      pan.setValue({
        x: initialPosition.current.x + gestureState.dx,
        y: initialPosition.current.y + gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      if (isDraging) {
        setIsDraging(false);
      }
      else {
        setIsEditing(true);
      }
    },
  });
  const handleInputChange = (newText: string) => {
    setEditText(newText);
  };

  return (
    <View>

      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          width: 100,
          height: 100,
          backgroundColor: 'gray',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...panResponder.panHandlers}
      >
        {isEditing ? (
          <TextInput
            value={editText}
            onChangeText={handleInputChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />

        ) : (
          <Text>{editText}</Text>
        )}
      </Animated.View>
    </View >
  );
};

export default DraggableElement;

