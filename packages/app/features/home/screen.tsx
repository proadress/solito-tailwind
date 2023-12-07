import { A, H1, P, Text, TextInput, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'
import { MotiLink } from 'solito/moti'
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useFetchPost } from 'app/components/models/fetchFunc';
import { getAllData, setData } from 'app/components/models/localStorge';



export function HomeScreen() {
  const [editText, setEditText] = useState("123");
  const { fetchPost, loading, error } = useFetchPost();

  const handleInputChange = (newText: string) => {
    setEditText(newText);
  };

  const updateButton = async () => {
    const newData = await getAllData();
    try {
      // 假設這是你的 API 資料
      const postData = { id: editText, value: JSON.stringify(newData) };
      // 呼叫 fetchPost 函式
      const result = await fetchPost('/api/update', postData);

      // 處理成功的結果
      console.log('Data fetched successfully:', result);
    } catch (error) {
      // 處理錯誤
      console.error('Error fetching data:', error);
    }
  }

  const getButton = async () => {
    try {
      // 假設這是你的 API 資料
      const postData = { id: editText };
      // 呼叫 fetchPost 函式
      const result = await fetchPost('/api/get', postData);

      // 處理成功的結果
      console.log('Data fetched successfully:', result);
      const dataObject: Record<string, string> = JSON.parse(result.value);
      console.log(dataObject);
      const dataArray = Object.entries(dataObject);
      dataArray.map(([uuid, jsonString]) => {
        setData(uuid, jsonString);
        return null; // 這裡 return null 是因為 map 需要有 return
      });
    } catch (error) {
      // 處理錯誤
      console.error('Error fetching data:', error);
    }
  }


  return (
    <View className='border flex-1 p-6 dark:bg-slate-900 items-center justify-center '>

      {/* <Row className="space-x-2">
        <TextInput
          className="border dark:border-gray-50 dark:text-gray-50 text-center"
          value={editText}
          onChangeText={handleInputChange}
        ></TextInput>
        <Pressable onPress={updateButton}>
          <Text className=' dark:bg-green-700 dark:text-gray-50'>update</Text>
        </Pressable>
        <Pressable onPress={getButton}>
          <Text className=' dark:bg-orange-700 dark:text-gray-50'>get</Text>
        </Pressable>
      </Row> */}
      <View className="h-[32px]" />
      <Row className="space-x-8">
        <TextLink href="/user/use" className="dark:text-gray-50">use</TextLink>
        <MotiLink
          href="/user/edit"
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
          <Text selectable={false} className="text-base font-bold dark:text-yellow-500">
            edit
          </Text>
        </MotiLink>
      </Row>
    </View>
  )
}
