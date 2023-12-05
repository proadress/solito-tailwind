import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'
import { MotiLink } from 'solito/moti'
import { useEffect, useState } from 'react';
import { clear, getAllData, setData } from 'app/components/models/localStorge';
import { v4 as uuidv4 } from 'uuid';
import { Pressable } from 'react-native';
import DraggableElement from 'app/components/drag';

export function HomeScreen() {
  const [items, setItems] = useState<object>({});
  const [isclear, setclear] = useState(false);


  useEffect(() => {
    const get = async () => {
      const newData = await getAllData();
      setItems(newData);
    };
    get();
  }, [isclear]);

  const addNewItem = async () => {
    setclear(false);
    const obj = {
      "id": uuidv4(),
      "value": "123",
      "x": 0,
      "y": 0,
    }
    const jsonobj = JSON.stringify(obj);
    await setData(obj.id, jsonobj);
    setItems(prevItems => ({
      ...prevItems,
      [obj.id]: jsonobj,
    }));
  }


  const createElement = () => {
    if (!isclear) {
      const components = Object.keys(items)
        .filter((key) => typeof key === 'string' && key.length === 36)
        .map((key, index) => {
          const itemString = items[key as keyof typeof items];
          if (typeof itemString === 'string') {
            const item = JSON.parse(itemString);
            return (
              <DraggableElement key={index} inputId={key} value={item['value']} initialX={item['x']} initialY={item['y']} ></DraggableElement>
            );
          }
          return null;
        });
      return components;
    }
  };

  return (
    <View className='flex-1'>
      <View >
        <Row>
          <Pressable onPress={addNewItem}>
            <Text >add</Text>
          </Pressable>
          <View />
          <Pressable onPress={() => {
            clear();
            setclear(true);
          }}>
            <Text >clean</Text>
          </Pressable>
        </Row>
      </View>

      <View className="flex-1 items-center justify-center p-3 dark:bg-slate-800">
        {createElement()}
        <View className="h-[32px]" />
        <Row className="space-x-8">
          <TextLink href="/user/fernando">Regular Link</TextLink>
          <MotiLink
            href="/user/fernando"
            animate={({ hovered, pressed }) => {
              'worklet'

              return {
                scale: pressed ? 0.95 : hovered ? 1.1 : 1,
                rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
              }
            }}
            transition={{
              type: 'timing',
              duration: 150,
            }}
          >
            <Text selectable={false} className="text-base font-bold">
              Moti Link
            </Text>
          </MotiLink>
        </Row>
      </View>
    </View>
  )
}
