import React, { useRef, useState, useEffect } from 'react';
import { View } from 'app/design/view';
import { Text, TextInput } from 'app/design/typography'
import { PanResponder, Animated } from 'react-native';
import { ElementData } from './localStorge';
import { Row } from 'app/design/layout';
import { Pressable } from 'react-native';
import { fetchGet, fetchPost } from './fetchFunc';
import { RenderHtml } from './rander-html';

export const DraggableElement: React.FC<{ data: ElementData, saveElement: (obj: ElementData) => Promise<void> }> = ({ data, saveElement }) => {
  const pan = useRef<any>(new Animated.ValueXY({ x: data.x, y: data.y })).current;
  const initialPosition = useRef({ x: 0, y: 0 });
  const [edit, setEdit] = useState(data);
  const [Draging, setDraging] = useState(false);

  useEffect(() => {
    saveElement({ ...edit, x: parseInt(pan.x._value, 10), y: parseInt(pan.y._value, 10) });
  }, [Draging]);

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
        height: 45,
      }}
      {...panResponder.panHandlers}>
      < View className='' >
        <Row className="items-center">
          <Text className="w-12 font-mono font-bold" selectable={false}>{data.type}:</Text>
          <TextInput
            className="w-20 focus:w-60 border-b border-blue-700 focus:outline-none focus:border-blue-400 focus:border-b-2 dark:border-yellow-500 dark:focus:border-orange-600"
            value={edit.value}
            onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
            onBlur={() => { saveElement({ ...edit, x: pan.x._value, y: pan.y._value }) }}
          />

        </Row>
        {data.type === "post" ?
          <Row className="items-center">
            <Text className="w-12 font-mono font-bold" selectable={false}>id:</Text>
            <TextInput
              className="w-20 focus:w-60 border-b border-blue-700 focus:border-blue-400 focus:border-b-2 dark:border-yellow-500 dark:focus:border-orange-600"
              value={edit.post}
              onChangeText={(newText) => { setEdit({ ...edit, post: newText }); }}
              onBlur={() => saveElement({ ...edit, x: pan.x._value, y: pan.y._value })
              }
            />
          </Row> : null
        }
      </View >
    </Animated.View >
  );
};


export const UseElement: React.FC<{ data: ElementData }> = ({ data }) => {
  return (
    <View className='w-[200px] absolute' style={{ transform: [{ translateX: data.x + 45 }, { translateY: data.y }] }}>
      {data.type == "text" ? <TextElement data={data} /> :
        data.type == "get" ? <GetElement data={data} /> :
          data.type == "post" ? <PostElement data={data} /> : null}
    </View>
  );
};

const TextElement: React.FC<{ data: ElementData }> = ({ data }) => {
  return (
    data.value.includes('<') ? <RenderHtml source={data.value} /> : <Text>{data.value}</Text>
  )
}
const GetElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const { getdata, getloading, startGet } = fetchGet(data.value);
  return (
    <>
      <Pressable onPress={() => { startGet() }}>
        <Text selectable={false} className='py-1 w-16 bg-slate-500 text-white rounded-md text-center font-extrabold'>
          Press
        </Text>
      </Pressable>
      {getloading ?
        < Text > Loading</Text >
        :
        getdata.toString().includes('<') ? <RenderHtml source={getdata.toString()} /> : <Text>{getdata.toString()}</Text>
      }
    </>
  )
}
const PostElement: React.FC<{ data: ElementData }> = ({ data }) => {
  const { postdata, loading, startPost } = fetchPost(data.value);
  const [post, setPost] = useState<Record<string, string | number>>(JSON.parse(data.post));

  const RenderTextInputs: React.FC<{ postValue: string, postKey: string }> = ({ postValue, postKey }) => {
    const [value, setValue] = useState(postValue)
    return <Row className="items-center">
      <Text selectable={false} className='mr-2 font-mono font-bold'>{postKey}:</Text>
      <TextInput
        className="border-b border-blue-700 focus:outline-none focus:border-blue-400 focus:border-b-2 dark:border-yellow-500 dark:focus:border-orange-600"
        value={value}
        onChangeText={(text) => { setValue(text) }}
        onBlur={() => {
          setPost((prevValues) => ({
            ...prevValues,
            [postKey]: value,
          }));
        }}
      />
    </Row>
  };
  const RenderNumberInputs: React.FC<{ postNumber: number, postKey: string }> = ({ postNumber, postKey }) => {
    const [value, setValue] = useState(postNumber)
    return <Row className="items-center">
      <Text selectable={false} className='mr-2 font-mono font-bold'>{postKey}:</Text>
      <TextInput
        keyboardType='numeric'
        className="border-b border-blue-700 focus:outline-none focus:border-blue-400 focus:border-b-2 dark:border-yellow-500 dark:focus:border-orange-600"
        value={value ? value.toString() : ""}
        onChangeText={(text) => { setValue(parseInt(text)) }}
        onBlur={() =>
          setPost((prevValues) => ({
            ...prevValues,
            [postKey]: value,
          }))
        }
      />
    </Row>
  };

  const RanderTN: React.FC<{ value: string | number | undefined, postKey: string }> = ({ value, postKey }) => {
    if (typeof value === "number")
      return <RenderNumberInputs postNumber={value} postKey={postKey} />
    else if (typeof value === "string")
      return <RenderTextInputs postValue={value} postKey={postKey} />
    return null
  }

  return (
    <>
      <View className='space-y-2 border-2 border-dashed dark:border-white p-4'>
        {Object.keys(post).map((key) => (
          < RanderTN value={post[key]} key={key} postKey={key} />
        ))}
        <Pressable onPress={() => { startPost(JSON.stringify(post)) }} className='flex items-end justify-end'>
          <Text selectable={false} className='py-1 w-16 bg-slate-500 text-white rounded-md text-center font-extrabold'>
            Press
          </Text>
        </Pressable>
      </View>

      {loading ?
        <Text>Loading</Text>
        :
        postdata.toString().includes('<') ? <RenderHtml source={postdata.toString()} /> : <Text>{postdata.toString()}</Text>
      }
    </>
  );
};
