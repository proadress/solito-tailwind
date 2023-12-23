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
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = new Animated.Value(isExpanded ? 40 : 0);

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

  const DragPostElement =
    < View className='h-10' >
      <Row>
        <Text selectable={false} >post:</Text>
        <TextInput
          value={edit.value}
          onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
          onBlur={() => saveElement({ ...edit, x: pan.x._value, y: pan.y._value })}
        />
      </Row>
      <Row>
        <Text selectable={false} className='font-bold'>id:</Text>
        <TextInput
          value={edit.post}
          onChangeText={(newText) => { setEdit({ ...edit, post: newText }); }}
          onBlur={() => saveElement({ ...edit, x: pan.x._value, y: pan.y._value })
          }
        />
      </Row>
    </View >
  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        height: 0,
      }}
      {...panResponder.panHandlers}>
      {data.type === "post" ? DragPostElement :
        < View className='h-10' >
          <Row>
            <Text selectable={false}>{data.type}:</Text>
            <TextInput
              value={edit.value}
              onChangeText={(newText) => { setEdit({ ...edit, value: newText }); }}
              onBlur={() => saveElement({ ...edit, x: pan.x._value, y: pan.y._value })}
            />
          </Row>
        </View >}
    </Animated.View >
  );
};


export const UseElement: React.FC<{ data: ElementData }> = ({ data }) => {
  return (
    <View className='w-[200px] absolute' style={{ transform: [{ translateX: data.x + 30 }, { translateY: data.y }] }}>
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
      <Pressable onPress={startGet}>
        <Text selectable={false} className='w-20 h-5 dark:bg-slate-500'>
          press me
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
  const [post, setPost] = useState<object>(JSON.parse(data.post));

  const renderTextInputs = () => {
    return Object.keys(post).map((key) => (
      <Row key={key}> {/* 確保在 map 中的每個元素上都有一個唯一的 key */}
        <Text selectable={false}>{key}:</Text>
        {typeof post[key] === "number" ? (
          <TextInput
            keyboardType='numeric'
            value={post[key].toString()}
            className='border dark:border-white'
            onChangeText={(text) => {
              let ntext = parseInt(text, 10);
              if (!ntext) ntext = 1;
              console.log(ntext, typeof ntext);
              setPost((prevValues: any) => ({
                ...prevValues,
                [key]: ntext,
              }));
            }}
          />
        ) : (
          <TextInput
            value={post[key]}
            className='border dark:border-white'
            onChangeText={(text) => {
              setPost((prevValues: any) => ({
                ...prevValues,
                [key]: text,
              }));
            }}
          />
        )}
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
      {loading ?
        < Text > Loading</Text >
        :
        postdata.toString().includes('<') ? <RenderHtml source={postdata.toString()} /> : <Text>{postdata.toString()}</Text>
      }
    </>
  )
}

