import { createParam } from 'solito'
import { Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { useEffect, useState } from 'react'
import { clear, getAllData, setData } from 'app/components/models/localStorge'
import { v4 } from 'uuid';
import { Pressable } from 'react-native'
import { Row } from 'app/design/layout'
import { DraggableElement } from 'app/components/drag'
import { TextElement } from 'app/components/item'

const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')
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
      "id": v4(),
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


  const createDragElement = () => {
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
  const createElement = () => {
    const components = Object.keys(items)
      .filter((key) => typeof key === 'string' && key.length === 36)
      .map((key, index) => {
        const itemString = items[key as keyof typeof items];
        if (typeof itemString === 'string') {
          const item = JSON.parse(itemString);
          const s = `w-[100px] h-[100px] absolute left-[50px] top-[50px] bg-red-500`.toString();
          console.log(s);
          return (
            // <Text  key={index} inputId={key} value={item['value']} initialX={item['x']} initialY={item['y']} ></TextElement>
            <>
              <View key={index} className={s}>
                <Text className={`absolute  dark:text-gray-50`}>
                  {item['value']}
                </Text>
              </View>
            </>
          );
        }
        return null;
      });
    return components;
  };

  const createModel = () => {
    return (
      <>
        <Row>
          <Pressable onPress={addNewItem}>
            <View className="w-[50px] h-[20px] bg-red-500 items-center justify-center">
              <Text >add</Text>
            </View>
          </Pressable>
          <View />
          <Pressable onPress={() => {
            clear();
            setclear(true);
          }}><View className='w-[50px] h-[20px] bg-lime-500 items-center justify-center'>
              <Text>clean</Text>
            </View>
          </Pressable>
        </Row>

        <View className="flex-1 border border-green-400 items-center justify-center p-3">
          <View className='h-[450px] w-[350px] border border-red-400'>
            {createDragElement()}
          </View>
        </View>
      </>)
  }
  const useModel = () => {
    return (
      <View className="flex-1 border border-green-400 items-center justify-center p-3">
        <View className='h-[450px] w-[350px] border border-red-400'>
          {createElement()}
        </View>
      </View>
    )
  }

  return (
    <View className='border flex-1 p-6 dark:bg-slate-800'>
      <View className="items-center justify-center">
        <Text className="mb-4 text-center font-bold dark:text-gray-50">{`User ID: ${id}`}</Text>
        <TextLink href="/" className='dark:text-gray-50'>👈 Go Home</TextLink>
      </View>
      {id === "edit" ? (createModel()) : id === "use" ? (useModel()) : <></>}
    </View >
  )
}
