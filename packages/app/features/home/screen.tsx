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
      <Row className='items-center'>
        <H1 selectable={false}>APP x Web</H1>
        <View className="w-[15px]" />
        <RenderHtml source={` <img src="https://static.vecteezy.com/system/resources/previews/009/391/790/non_2x/internet-wifi-icon-clipart-design-illustration-free-png.png" style="width:35px;height:25px"/>`} />
      </Row>
      <View className="h-[32px]" />
      <ProjectCol />
    </View >
  )
}


