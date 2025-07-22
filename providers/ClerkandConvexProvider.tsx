import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from "react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!,{
    unsavedChangesWarning:false
})

const publishablekey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
export default function ClerkandConvexProvider({children}:{children:React.ReactNode}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishablekey}>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>

        </ConvexProviderWithClerk>

    </ClerkProvider>
   
  )
}