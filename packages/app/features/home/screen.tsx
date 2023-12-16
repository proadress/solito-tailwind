import { A, H1, P, Text, TextInput, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'
import { useState } from 'react';
import { Pressable } from 'react-native';
import { baseurl } from 'app/components/fetchFunc';
import { clear, getUser, saveUser } from 'app/components/localStorge';
import { ProjectCol } from 'app/components/project';


export function HomeScreen() {

  const [signin, setSignin] = useState(false);

  const Singin: React.FC = () => {
    const [email, setEmail] = useState("a@gmail.com");
    const [password, setPassword] = useState("12345678");

    const signinButton = async (email: string, password: string) => {
      try {
        const data = { email: email, password: password };
        const response = await fetch(`${baseurl}${'/auth/signin'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          console.error('Error:', response.status, response.statusText);
        } else {
          const result = await response.json(); // Assuming the response contains JSON data
          console.log(result);
          setSignin(true);
          saveUser(result.user);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    return <>
      <Row>
        <View>
          <Text selectable={false} >email</Text>
          <Text selectable={false} >Password</Text>
        </View>
        <View>
          <TextInput
            value={email}
            clearButtonMode='while-editing'
            onChangeText={(e) => setEmail(e)}
            className=' border dark:border-white w-40'
          />
          <TextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            className='border dark:border-white w-40'
          />
        </View>
      </Row>
      <Pressable onPress={async () => { await signinButton(email, password) }}>
        <Text selectable={false} className='bg-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-700 hover:to-purple-700 text-white font-handwritten py-2 px-2 rounded-full shadow-md transition-transform transform hover:scale-105'>
          submit
        </Text>
      </Pressable>
    </>
  }
  return (
    <View className='border flex-1 p-6 bg-orange-100 dark:bg-slate-900 items-center justify-center'>
      <View className="h-[32px]" />
      <H1 selectable={false}>123</H1>
      <View className="h-[32px]" />
      {signin ? <ProjectCol /> : <Singin />}
    </View >
  )
}
function fetchPost(arg0: string, postData: { id: string; password: string; }) {
  throw new Error('Function not implemented.');
}

