import { A, H1, P, Text, TextInput, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'
import { MotiLink } from 'solito/moti'
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useButton } from 'app/components/models/Button';

export interface User {
  _id: string;
  name: string;
  password: string;
}

export function HomeScreen() {
  const [email, setEmail] = useState('a@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [user, setUser] = useState<User>({ _id: '', name: 'noname', password: '' });

  const { signinButton } = useButton();


  const handleLogin = () => {
    // Add your login logic here, for example, making an API request to authenticate the user.
    console.log('Email:', email);
    console.log('Password:', password);
    // You can use the email and password values for authentication.
  };
  return (
    <View className='border flex-1 p-6 bg-orange-100 dark:bg-slate-900 items-center justify-center '>
      <View className="h-[32px]" />
      <H1 selectable={false} className='dark:text-white'>{user.name}</H1>

      <Row>
        <View>
          <Text selectable={false} className='dark:text-white'>email</Text>
          <Text selectable={false} className='dark:text-white'>Password</Text>
        </View>
        <View>
          <TextInput
            value={email}
            clearButtonMode='while-editing'
            onChangeText={(e) => setEmail(e)}
            className='dark:text-white border dark:border-white w-40'
          />
          <TextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            className='dark:text-white border dark:border-white w-40'
          />
        </View>
      </Row>
      <Pressable onPress={async () => { setUser(await signinButton(email, password)) }}>
        <Text selectable={false} className='bg-fuchsia-300'>submit</Text>
      </Pressable>
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
    </View >
  )
}
