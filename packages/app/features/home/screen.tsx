import { A, H1, P, Text, TextInput, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { ProjectCol } from 'app/components/project';
import { RenderHtml } from 'app/components/rander-html';
import { Row } from 'app/design/layout';
// import RenderHtml from 'react-native-render-html';



export function HomeScreen() {
  return (
    <View className='border flex-1 p-6 bg-orange-100 dark:bg-neutral-900 items-center justify-center'>
      <View className="h-[32px]" />
      <Row className='items-center space-x-4'>
        <A href='https://docs.google.com/presentation/d/1oZ34AhTVTVkCjgeY7MXJEkfkVE8B33aS/edit?usp=sharing&ouid=113100135902625881557&rtpof=true&sd=true' selectable={false} className='text-3xl font-extrabold my-4 dark:text-white transition-transform transform hover:scale-110'>APP x Web</A>
        <RenderHtml source={` <img src="https://static.vecteezy.com/system/resources/previews/009/391/790/non_2x/internet-wifi-icon-clipart-design-illustration-free-png.png" style="width:35px;height:25px"/>`} />
      </Row>
      <View className="h-[32px]" />
      <ProjectCol />
    </View >
  )
}


