🎉 ScrollView vs FlatList

Use FlatList when:

Performance is critical: FlatList only renders items currently visible on screen, saving memory and improving performance.
Long lists of data: When rendering potentially large sets of data (feeds, search results, message lists).
Unknown content length: When you don't know in advance how many items you'll need to display.
Same kind of content: When displaying many items with the same structure.
Use ScrollView when:

All content fits in memory: When you're displaying a small, fixed amount of content that won't cause performance issues.
Static content: For screens with predetermined, limited content like forms, profile pages, or detail views.
Mixed content types: When you need to display different UI components in a specific layout that doesn't follow a list pattern.
Horizontal carousel-like elements: Small horizontal scrolling components like image carousels with limited items.

🚀 Pressable vs TouchableOpacity

Use Pressable when:

More customization is needed: Pressable offers more customization options for different states (pressed, hovered, focused).
Complex interaction states: When you need to handle multiple interaction states with fine-grained control.
Future-proofing: Pressable is newer and designed to eventually replace the Touchable components.
Platform-specific behavior: When you want to customize behavior across different platforms.
Nested press handlers: When you need to handle nested interactive elements.
Use TouchableOpacity when:

Simple fade effect: When you just need a simple opacity change on press.
Backwards compatibility: When working with older codebases that already use TouchableOpacity.
Simpler API: When you prefer a more straightforward API with fewer options to configure.
Specific opacity animations: When you need precise control over the opacity value on press.
Legacy support: For maintaining consistency with existing components.
👀 icon.png vs adaptive-icon.png

💥 icon.png

This is the standard app icon that appears on most devices. It's the primary icon for your app
Recommended img size: 1024x1024
💫 adaptive-icon.png

Introduced in Android 8.0 (Oreo), this is specific to Android devices.
Recommended img size: 1024x1024
If you don't provide these icons, your app will still work, but it will use Expo's default icons. For a professional app that you plan to publish to the App Store or Play Store, you should definitely include your own custom icons
🤌 React Native Gesture Handler

Gestures are a great way to provide an intuitive user experience in an app.
The React Native Gesture Handler library provides built-in native components that can handle gestures.
It recognizes pan, tap, rotation, and other gestures using the platform's native touch handling system
Learn more: https://docs.swmansion.com/react-native-gesture-handler/docs/
🐴 React Native Reanimated

Create smooth animations with an excellent developer experience.
Learn more: https://docs.swmansion.com/react-native-reanimated/