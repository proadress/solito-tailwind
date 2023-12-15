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
          className='dark:text-white'
          onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
        />
      </Row>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <Row>
          <Text selectable={false} className='dark:text-white font-bold'>color:</Text>
          <TextInput
            value={edit.color}
            className='dark:text-white'
            onChangeText={(newText) => { setEdit({ ...edit, color: newText }); }}
          />
        </Row>
        <Row>
          <Text selectable={false} className='dark:text-white font-bold'>size:</Text>
          <TextInput
            value={edit.fontsize.toString()}
            className='dark:text-white'
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
        <Text selectable={false} className='dark:text-white'>get:</Text>
        <TextInput
          value={edit.value}
          style={{ color: data.color, fontSize: data.fontsize }}
          className='dark:text-white'
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
        <Text selectable={false} className='dark:text-white'>post:</Text>
        <TextInput
          value={edit.value}
          style={{ color: data.color, fontSize: data.fontsize }}
          className='dark:text-white'
          onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
        />
      </Row>
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <Row>
          <Text selectable={false} className='dark:text-white font-bold'>id:</Text>
          <TextInput
            value={edit.post}
            className='dark:text-white'
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
  return (
    <Text
      className="dark:text-gray-50"
      style={{ fontSize: data.fontsize, color: data.color }}
    >
      {data.value}
    </Text>
  )
}
const GetElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const [getdata, setGetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await fetch(data.value);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setGetData(result);
    } catch (error: any) {
      // Handle error
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Pressable onPress={fetchData}>
        <Text selectable={false} className='w-20 h-5 bg-slate-500'>
          press me
        </Text>
      </Pressable>
      <Text
        className="dark:text-gray-50"
        style={{ fontSize: data.fontsize, color: data.color }}
      >
        {loading ? "loading" : getdata.toString()}
      </Text>
    </>
  )
}
const PostElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const [postdata, setPostData] = useState("none")
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(JSON.parse(data.post))

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(data.value, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
        body: JSON.stringify(post),
      });
      const result = await response.json();
      console.log(result);

      setPostData(result)
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setPostData('error');
      throw error; // rethrow the error to let the caller handle it
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, text: string) => {
    setPost((prevValues: any) => ({
      ...prevValues,
      [key]: text,
    }));
  };

  const renderTextInputs = () => {
    return Object.keys(post).map((key) => (
      <Row>
        <Text selectable={false} className='dark:text-white'>{key}:</Text>
        <TextInput
          key={key}
          placeholder={key}
          value={post[key]}
          className='dark:text-white border dark:border-white'
          onChangeText={(text) => handleInputChange(key, text)}
        />
      </Row>
    ));
  };

  return (
    <>
      {renderTextInputs()}
      <Pressable onPress={fetchPost}>
        <Text selectable={false} className='w-20 h-5 bg-slate-500'>
          press me
        </Text>
      </Pressable>
      <Text
        className="dark:text-gray-50"
        style={{ fontSize: data.fontsize, color: data.color }}
      >
        {loading ? "loading" : postdata.toString()}
      </Text>
    </>
  )
}

