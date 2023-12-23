import { A, H1, P, Text, TextInput, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { ProjectCol } from 'app/components/project';
import { RenderHtml } from 'app/components/rander-html';
// import RenderHtml from 'react-native-render-html';



export function HomeScreen() {
  const source = `
  <img src="https://png.pngtree.com/png-vector/20221222/ourmid/pngtree-super-cute-cartoon-vector-bear-png-image_6504049.png"/>
`
    ;

  return (
    <View className='border flex-1 p-6 bg-orange-100 dark:bg-slate-900 items-center justify-center'>
      <View className="h-[32px]" />
      <H1 selectable={false}>APP x Web</H1>
      {/* <RenderHtml source={source} /> */}
      <View className="h-[32px]" />
      <ProjectCol />
    </View >
  )
}


