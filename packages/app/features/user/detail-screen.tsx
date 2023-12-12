import { useEffect, useState } from 'react';
import { createParam } from 'solito';
import { Text, TextLink } from 'app/design/typography';
import { View } from 'app/design/view';
import { Pressable } from 'react-native';
import { Row } from 'app/design/layout';
import { DraggableElement, TextElement } from 'app/components/drag';
import { clear, getAllData, saveData, ElementData } from 'app/components/models/localStorge';
import { v4 } from 'uuid';
import { useButton } from 'app/components/models/Button';

const { useParam } = createParam<{ id: string }>();

export function UserDetailScreen() {
  const [id] = useParam('id');
  const [items, setItems] = useState<ElementData[]>([]);
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
    const obj: ElementData = {
      id: v4(),
      value: "123",
      color: "",
      fontsize: 15,
      x: 0,
      y: 0,
    }
    setItems(prevItems => prevItems.concat(obj));
    await saveData(obj);
  }

  const createElement = (editMode: boolean) => {
    return (
      items.map((item, index) => (
        editMode ? <DraggableElement key={index} data={item} />
          : <TextElement key={index} data={item} />
      )));
  };

  const createButton = () => {
    return (
      <Row className="space-x-3 justify-end">
        <Pressable onPress={addNewItem}>
          <Text className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Add
          </Text>
        </Pressable>

        <Pressable onPress={async () => { await clear(); await reBuild(); }}>
          <Text className='bg-blue-500 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-700 hover:to-green-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Clear
          </Text>
        </Pressable>

        <Pressable onPress={async () => await updateButton(editText)}>
          <Text className='bg-red-500 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-700 hover:to-orange-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Save
          </Text>
        </Pressable>

        <Pressable onPress={async () => { await clear(); await reBuild(); await getButton(editText); await reBuild(); }}>
          <Text className=' bg-yellow-500 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-700 hover:to-orange-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            Restore
          </Text>
        </Pressable>

        <Pressable onPress={async () => { reBuild(); }}>
          <Text className=' bg-purple-500 bg-gradient-to-r from-red-500 to-gray-500 hover:from-yellow-700 hover:to-orange-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            ReBuild
          </Text>
        </Pressable>

      </Row>
    );
  };

  return (
    <View className='border flex-1 bg-orange-100 dark:bg-slate-800'>
      <Row>
        <TextLink href="/" className=' bg-purple-500 bg-gradient-to-r from-yellow-500 to-gray-500 hover:from-yellow-700 hover:to-orange-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
          <Text >
            Back ID: {id}</Text>
        </TextLink>
        {id === "edit" ? (createButton()) : null}
      </Row>
      <View className="flex-1 border border-green-400 border-dashed items-center justify-center p-3">
        <Row className="justify-end">
          {id === "edit" ?
            <View className='h-[550px] w-[350px] border border-red-400 border-dashed'>
              {createElement(false)}
            </View>
            : null}
          <View className='h-[550px] w-[350px] border border-red-400 border-dashed'>
            {(createElement(id === "edit"))}
          </View>
        </Row>
      </View>
    </View>

  );
}
