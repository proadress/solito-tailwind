import { useEffect, useState } from 'react';
import { createParam } from 'solito';
import { Text, TextLink } from 'app/design/typography';
import { View } from 'app/design/view';
import { Pressable } from 'react-native';
import { Row } from 'app/design/layout';
import { DraggableElement, TextElement } from 'app/components/drag';
import { clear, getAllData, setData } from 'app/components/models/localStorge';
import { v4 } from 'uuid';
import { useButton } from 'app/components/models/Button';

const { useParam } = createParam<{ id: string }>();

export function UserDetailScreen() {
  const [id] = useParam('id');
  const [items, setItems] = useState<object>({});
  const editText = "123";

  const { updateButton, getButton } = useButton();

  useEffect(() => {
    reBuild();
  }, []);

  const reBuild = async () => {
    const newData = await getAllData();
    setItems(newData);
    console.log("reBuilding");

  };

  const addNewItem = async () => {
    const obj = {
      "id": v4(),
      "value": "123",
      "x": 0,
      "y": 0,
    }
    const jsonobj = JSON.stringify(obj);
    await setData(obj.id, jsonobj);
    setItems(prevItems => ({ ...prevItems, [obj.id]: jsonobj }));
  }

  const createElement = (editMode: boolean) => {
    return Object.keys(items)
      .filter((key) => typeof key === 'string' && key.length === 36)
      .map((key, index) => {
        const itemString = items[key as keyof typeof items];
        if (typeof itemString === 'string') {
          const item = JSON.parse(itemString);
          return (
            editMode ? <DraggableElement key={index} inputId={key} value={item['value']} initialX={item['x']} initialY={item['y']} />
              : <TextElement key={index} value={item['value']} x={item['x']} y={item['y']} />
          );
        }
        return null;
      });
  };

  const createButton = () => {
    return (
      <Row className="space-x-3">
        <Pressable onPress={addNewItem}>
          <Text className='bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Add
          </Text>
        </Pressable>

        <Pressable onPress={async () => { await clear(); await reBuild(); }}>
          <Text className='bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-700 hover:to-green-700 text-white font-handwritten py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Clear
          </Text>
        </Pressable>

        <Pressable onPress={async () => await updateButton(editText)}>
          <Text className='bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-700 hover:to-orange-700 text-white font-handwritten py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Save
          </Text>
        </Pressable>

        <Pressable onPress={async () => { await clear(); await reBuild(); await getButton(editText); await reBuild(); }}>
          <Text className='bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-700 hover:to-orange-700 text-white font-handwritten py-2 px-4 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Restore
          </Text>
        </Pressable>

      </Row>
    );
  };

  return (
    <View className='border flex-1 dark:bg-gradient-to-b from-slate-800 to-orange-950 bg-orange-100'>
      <Row className="items-center justify-center">
        <TextLink href="/" className='dark:text-gray-50 hover:text-gray-300 transition duration-300'>
          <Text >Back ID: {id}</Text>
        </TextLink>

        <View className='w-[30px]'></View>
      </Row>
      {id === "edit" ? (createButton()) : ""}
      <View className="flex-1 border border-green-400 border-dashed items-center justify-center p-3">
        <View className='h-[550px] w-[350px] border border-red-400 border-dashed'>
          {(createElement(id === "edit"))}
        </View>
      </View>
    </View>

  );
}
