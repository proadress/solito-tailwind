import { useEffect, useState } from 'react';
import { createParam } from 'solito';
import { Text, TextLink } from 'app/design/typography';
import { View } from 'app/design/view';
import { Pressable } from 'react-native';
import { Row } from 'app/design/layout';
import { DraggableElement, UseElement } from 'app/components/drag';
import { ElementData, projectManager } from 'app/components/localStorge';
import { v4 } from 'uuid';

const { useParam } = createParam<{ id: string }>();

export function UserDetailScreen() {
  const { items, startPage, setItems, saveElement, getAllUidData } = projectManager();

  const [pageId] = useParam('id');
  const [edit, setEdit] = useState(false); // 第一部分
  const [id, setId] = useState(""); // 第一部分

  useEffect(() => {
    const ss = async () => {
      await getAllUidData();
      setEdit(pageId !== undefined && pageId[0] === "e");
      setId(pageId !== undefined ? pageId.substring(1) : "");
    }
    ss();
  }, [pageId]);

  useEffect(() => {
    console.log(id);
    startPage(id);
  }, [id]);

  const addNewItem = (type: string) => {
    const obj: ElementData = {
      id: v4(),
      projectID: "project1",
      type: type,
      value: type === "text" ? "文字方塊" : type === "get" ? "https://nextjs-fastapi-starter-nine-xi.vercel.app/test/get" : type === "post" ? "https://nextjs-fastapi-starter-nine-xi.vercel.app/test/post" : "error",
      post: type === "post" ? JSON.stringify({ a: 3, b: 4, v: "是最後答案" }) : "",
      x: 0,
      y: 0,
    }
    setItems(prevItems => prevItems.concat(obj));
    saveElement(obj);
  }

  const CreateElement = (editMode: boolean) => {
    return (
      items.map((item, index) => (
        editMode ? <DraggableElement key={index} data={item} saveElement={saveElement} />
          : <UseElement key={index} data={item} />
      )));
  };

  const CreateButton: React.FC = () => {
    return (
      <Row className="space-x-3 justify-end">
        <Pressable onPress={() => addNewItem("text")}>
          <Text selectable={false} className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            AddText
          </Text>
        </Pressable>
        <Pressable onPress={() => addNewItem("get")}>
          <Text selectable={false} className='bg-blue-500 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-700 hover:to-green-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            AddGet
          </Text>
        </Pressable>
        <Pressable onPress={() => addNewItem("post")}>
          <Text selectable={false} className='bg-orange-500 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-700 hover:to-red-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
            AddPost
          </Text>
        </Pressable>
      </Row>
    );
  };

  return (
    <View className='border flex-1 bg-orange-100 dark:bg-neutral-800'>
      <Row>
        {edit ? <CreateButton /> : null}
      </Row>
      <View className="flex-1 items-center justify-center p-3">
        <Row className="justify-end">
          {edit ?
            <View className='h-[550px] w-[350px] border border-red-400 border-dashed'>
              {CreateElement(false)}
            </View>
            : null}
          {edit ?
            <View className='h-[550px] w-[350px] border border-red-400 border-dashed'>
              {CreateElement(true)}
            </View>
            : <View className='h-[550px] w-[350px]'>
              {CreateElement(false)}
            </View>}
        </Row>
      </View>
    </View>
  );
}
