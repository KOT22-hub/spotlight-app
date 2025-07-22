import InitialLayout from '@/components/initialLayout';
import ClerkandConvexProvider from '@/providers/ClerkandConvexProvider';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

import { useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const publishablekey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const [fontsLoaded]=useFonts({
    "JetBrainsMono-Medium":require("../assets/fonts/JetBrainsMono-Medium.ttf")
  })

  const onLayoutRootView = useCallback(async()=>{
    if(fontsLoaded) SplashScreen.hideAsync()

  },[fontsLoaded])
 
  
  return (

    <ClerkandConvexProvider>
        <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} onLayout={onLayoutRootView}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>


    </ClerkandConvexProvider>

    
  );
}
