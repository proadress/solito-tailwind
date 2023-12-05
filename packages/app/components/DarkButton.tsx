import { Appearance, Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
export default () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    return (
        <Pressable onPress={toggleColorScheme}>
            <Text>touch</Text>
        </Pressable>
    );
};
