import React, { useRef, useState, useEffect } from 'react';
import { View } from 'app/design/view';
import { Text, TextInput } from 'app/design/typography'
import { PanResponder, Animated } from 'react-native';
import { ElementData } from './localStorge';
import { Row } from 'app/design/layout';
import { Pressable } from 'react-native';
import { fetchGet, fetchPost } from './fetchFunc';

export const DraggableElement: React.FC<{ data: ElementData, saveElement: (obj: ElementData) => Promise<void> }> = ({ data, saveElement }) => {
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
    saveElement({ ...edit, x: pan.x._value, y: pan.y._value });
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

  const DragTextElement =
    < View className='border h-10 w-40 border-gray-500' >
      <Row>
        <Pressable onPress={handleToggle}>
          <View className=' bg-white'>
            <Text selectable={false}> = </Text>
          </View>
        </Pressable>
        <TextInput
          value={edit.value}
          style={{ color: data.color, fontSize: data.fontsize }}
          onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
        />
      </Row>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <Row>
          <Text selectable={false} className='font-bold'>color:</Text>
          <TextInput
            value={edit.color}
            onChangeText={(newText) => { setEdit({ ...edit, color: newText }); }}
          />
        </Row>
        <Row>
          <Text selectable={false} className='font-bold'>size:</Text>
          <TextInput
            value={edit.fontsize.toString()}
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
    </View >
  const DragGetElement =
    < View className='border h-10 w-40 border-gray-500' >
      <Row>
        <Text selectable={false}>get:</Text>
        <TextInput
          value={edit.value}
          onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
        />
      </Row>
    </View >

  const DragPostElement =
    < View className='border h-10 w-40 border-gray-500' >
      <Row>
        <Pressable onPress={handleToggle}>
          <View className=' bg-white'>
            <Text selectable={false}> = </Text>
          </View>
        </Pressable>
        <Text selectable={false} >post:</Text>
        <TextInput
          value={edit.value}
          onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
        />
      </Row>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <Row>
          <Text selectable={false} className='font-bold'>id:</Text>
          <TextInput
            value={edit.post}
            onChangeText={(newText) => { setEdit({ ...edit, post: newText }); }}
          />
        </Row>
      </Animated.View>
    </View >
  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        height: 0,
      }}
      {...panResponder.panHandlers}>
      {data.type === "text" ? DragTextElement :
        data.type === "get" ? DragGetElement :
          data.type === "post" ? DragPostElement : null}

    </Animated.View >
  );
};


export const UseElement: React.FC<{ data: ElementData }> = ({ data }) => {
  return (
    <View className='w-[200px] absolute' style={{ transform: [{ translateX: data.x + 15 }, { translateY: data.y }] }}>
      {data.type == "text" ? <TextElement data={data} /> :
        data.type == "get" ? <GetElement data={data} /> :
          data.type == "post" ? <PostElement data={data} /> : null}
    </View>
  );
};

const TextElement: React.FC<{ data: ElementData }> = ({ data }) => {
  return (<>
    {data.color == "" ?
      <Text style={{ fontSize: data.fontsize }}>
        {data.value}
      </Text> :
      <Text style={{ fontSize: data.fontsize, color: data.color }}>
        {data.value}
      </Text>
    }
  </>
  )
}
const GetElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const { getdata, getloading, startGet } = fetchGet(data.value);
  return (
    <>
      <Pressable onPress={startGet}>
        <Text selectable={false} className='w-20 h-5 bg-slate-500'>
          press me
        </Text>
      </Pressable>
      <Text>
        {getloading ? "loading" : getdata.toString()}
      </Text>
    </>
  )
}
const PostElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const { postdata, loading, startPost } = fetchPost(data.value);
  const [post, setPost] = useState(JSON.parse(data.post))

  const handleInputChange = (key: string, text: string) => {
    setPost((prevValues: any) => ({
      ...prevValues,
      [key]: text,
    }));
  };

  const renderTextInputs = () => {
    return Object.keys(post).map((key) => (
      <Row>
        <Text selectable={false} >{key}:</Text>
        <TextInput
          key={key}
          value={post[key]}
          className='border dark:border-white'
          onChangeText={(text) => handleInputChange(key, text)}
        />
      </Row>
    ));
  };

  return (
    <>
      {renderTextInputs()}
      <Pressable onPress={() => { startPost(JSON.stringify(post)) }}>
        <Text selectable={false} className='w-20 h-5 bg-slate-500'>
          press me
        </Text>
      </Pressable>
      <Text>
        {loading ? "loading" : postdata.toString()}
      </Text>
    </>
  )
}

