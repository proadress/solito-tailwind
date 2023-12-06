import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'
import { MotiLink } from 'solito/moti'

export function HomeScreen() {


  return (
    <View className='border flex-1 p-6 dark:bg-slate-900 items-center justify-center '>

      {/* <View className="h-[32px]" /> */}
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
