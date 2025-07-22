import { COLORS } from '@/constants/theme'
import { style } from '@/styles/auth.styles'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Login() {
    const {startSSOFlow} = useSSO();
    const router = useRouter();
    const handleGoogleSignIn =async()=>{
        try {
            const {createdSessionId,setActive}=await startSSOFlow({strategy:"oauth_google"})
            if(setActive && createdSessionId){
                setActive({session:createdSessionId})

                router.replace('/(tabs)')
            }

        } catch (error) {
            console.log("auth error",error)
            
        }

    }
  return (
    <View style={style.container}>
      {/* BRAND SECTION */}
      <View style={style.brandSection}>
        <View style={style.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={style.appName}>spotlight</Text>
        <Text style={style.tagline}>don't miss anything!</Text>
      </View>

      {/* ILLUSTRATION */}
      <View style={style.illustrationContainer}>
        <Image
          source={require('@/assets/images/Social share-bro.png')}
          style={style.illustration}
          resizeMode="cover"
        />
      </View>

      {/* LOGIN SECTION */}
      <View style={style.loginSection}>
      <TouchableOpacity
          style={style.googleButton}
    onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={style.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={style.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={style.termsText}>
          By continuing, you agree to our terms and conditions
        </Text>
      </View>
    </View>
  )
}
