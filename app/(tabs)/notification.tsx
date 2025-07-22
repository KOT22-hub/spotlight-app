import { Loader } from '@/components/Loader'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/notifications.styles'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

const Notification = () => {
  const notification = useQuery(api.notifications.getNotifications)

  if(notification===undefined) return <Loader/>
 //if(notification.length===0) return <NoNotificationFound/>
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications

        </Text>

      </View>
      <FlatList
  data={notification}
  renderItem={({ item }) => <NotificationItem notification={item} />}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.listContainer}
  keyExtractor={(item) => item._id}
/>

    </View>
  )
}


export default Notification

function NotificationItem({ notification }: any) {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
     
       <Link href={"/notification"} asChild>
       <TouchableOpacity>
        <Image source={notification.sender.image} style={styles.avatar} contentFit='cover' transition={200}/>
        <View style={styles.iconBadge}>
        {notification.type === "like" ? (
                <Ionicons name="heart" size={14} color={COLORS.primary} />
              ) : notification.type === "follow" ? (
                <Ionicons name="person-add" size={14} color="#8B5CF6" />
              ) : (
                <Ionicons name="chatbubble" size={14} color="#3B82F6" />
              )}

        </View>

       </TouchableOpacity>
       
       </Link>
       <View style={styles.notificationInfo}>
        <Link href={"/notification"} asChild>
        <TouchableOpacity>
          <Text style={styles.username}>
            {notification.sender.username}

          </Text>
        </TouchableOpacity>
        </Link>
        <Text style={styles.action}>
        {notification.type === "follow"
              ? "started following you"
              : notification.type === "like"
              ? "liked your post"
              : `commented: "${notification.comment}"`}

        </Text>
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(notification._creationTime,{addSuffix:true})}

        </Text>

       </View>
      </View>
      {
        notification.post&& (
          <Image source={notification.post.imageUrl} style={styles.postImage} contentFit='cover' transition={200}/>
        )
      }
    </View>
  )
}

function NoNotificationFound(){
  return (
    <View style={[styles.container,styles.centered]}>
      <Ionicons name="notifications-outline" size={48} color={COLORS.primary}/>
      <Text style={{fontSize:20,color:COLORS.white}}>
        No notifications yet
        

      </Text>
    </View>
  )

}