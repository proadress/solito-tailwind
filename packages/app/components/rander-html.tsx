// MyComponent.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWindowDimensions } from 'react-native';
import { View } from 'app/design/view';


const DynamicHTML = dynamic(() => import('react-native-render-html'), {
    ssr: false,
});

export const RenderHtml: React.FC<{ source: string }> = ({ source }) => {
    const [isModuleLoaded, setIsModuleLoaded] = useState(false);
    const { width } = useWindowDimensions();

    useEffect(() => {
        import('react-native-render-html').then(() => {
            // 當模塊被載入後，設置 isModuleLoaded 為 true
            setIsModuleLoaded(true);
        });
    }, []);


    return (
        <View>
            {isModuleLoaded && (
                <DynamicHTML
                    source={{ html: source }}
                    contentWidth={width}
                />
            )}
        </View>
    );
};
