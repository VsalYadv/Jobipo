import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Pressable,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsIcon, CircleBorderIcon, FavIcon } from './SVGIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const TopHeaderJob = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState([]);
  const [jobseekers, setJobseekers] = useState([]);
  const [savedProfileImage, setSavedProfileImage] = useState(null);

  // Load saved profile image from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadSavedProfileImage = async () => {
        try {
          const savedImage = await AsyncStorage.getItem('userProfileImage');
          if (savedImage) {
            const imageData = JSON.parse(savedImage);
            setSavedProfileImage(imageData);
            console.log('Profile image loaded in TopHeaderJob from AsyncStorage');
          }
        } catch (error) {
          console.log('Error loading profile image in TopHeaderJob:', error);
        }
      };

      loadSavedProfileImage();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/index');
          const sliderDataApi = await res.json();
          console.log("sliderDataApi",sliderDataApi)
          if (sliderDataApi?.logout !== 1) {
            const parsedMsg = JSON.parse(sliderDataApi?.msg);
            setUsers(parsedMsg?.users);
            if (parsedMsg?.jobseeker) setJobseekers(parsedMsg.jobseeker);
          }
        } catch (err) {
          console.log('❌ Fetch Error:', err);
          Alert.alert('Connection Issue', 'Please check your internet connection.');
        }
      };
      GetDataFunc();
    }, [])
  );

  const menuList = [
    { title: 'Job Home', link: 'JobHome', subLink: ['JobPage'] },
    { title: 'Affiliate', link: 'Home', subLink: ['ID', 'Visiting'] },
  ];

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8D53" />

      {/* Tab Menu */}
      <View style={styles.container}>
        {menuList.map((item, i) => {
          const isActive =
            item.subLink.includes(route.name) || route.name === item.link;

          const dynamicStyle = [
            styles.menu,
            isActive && styles.activeTab,
            item.link === 'JobHome' && isActive && { borderTopRightRadius: 20 },
            item.link === 'Home' && isActive && { borderTopLeftRadius: 20 },
          ];

          return (
            <Pressable
              key={i}
              style={dynamicStyle}
              onPress={() => navigation.navigate(item.link)}
            >
              <Text
                style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}
              >
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={{ marginVertical: 6,
}}>
          {savedProfileImage ? (
            <Image source={{ uri: savedProfileImage.uri }} style={styles.profileImage} />
          ) : users?.photo ? (
            <Image source={{ uri: users.photo }} style={styles.profileImage} />
          ) : (
            <CircleBorderIcon />
          )}
        </View>

        <View style={styles.profileText}>
          <Text style={styles.profileName}>{users['fullName']}</Text>
          <Text style={styles.profilePosition}>
            {jobseekers['preferred_job_Title']}
          </Text>
        </View>

       <View style={styles.iconWrapper}>
          <Pressable onPress={() => navigation.navigate('JobipoSupport')}>
             <SettingsIcon />
          </Pressable>
          < Pressable style ={{marginTop:7}} onPress={() => navigation.navigate('JobNotification')}>
            <FavIcon />
           </Pressable>
  </View>


      </View>
    </View>
  );
};

export default TopHeaderJob;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFA556',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    backgroundColor: '#FFA556',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  activeText: {
    color: '#000000',
  },
  inactiveText: {
    color: '#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  profileText: {
    flex: 1,
    marginLeft: 8,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  profilePosition: {
    fontSize: 10,
    color: '#000000',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 28, // space between icons
},
  notGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
});
