/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Alert,
  StatusBar
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  DrawerActions,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {CircleBorderIcon, SettingsIconB, NotificationIconB } from './SVGIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TopHeaderAffiliateNew = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [jobseekers, setJobseekers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/index');
          const data = await res.json();
          if (data?.logout !== 1) {
            setisLoading(false);
            const parsedMsg = JSON.parse(data?.msg);
            setUsers(parsedMsg?.users);
            if (parsedMsg?.jobseeker) setJobseekers(parsedMsg.jobseeker);
          }
        } catch (err) {
          console.log('❌ Fetch Error:', err);
          Alert.alert('Connection Issue', 'Please check your internet connection.');
        }
      };
      let mount = true;
      if (mount) GetDataFunc();
      return () => { mount = false };
    }, [])
  );

  const menuList = [
    {
      title: 'Job Home',
      link: 'JobHome',
      subLink: ['JobPage'],
    },
    {
      title: 'Affiliate',
      link: 'Home',
      subLink: ['ID', 'Visiting'],
    },
  ];

  const isAffiliateScreen = route.name === 'Home' || menuList[1].subLink.includes(route.name);

  return (
    <>
                {/* <StatusBar barStyle="light-content" backgroundColor="#57ed47ff" /> */}

    <View style={[styles.wrapper, { paddingTop: insets.top }]}>

      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        {menuList.map((item, i) => {
          const isActive = item.link === route.name || item.subLink.includes(route.name);

          return (
            <View key={i} style={styles.tabWrapper}>
              <Pressable
                style={[
                  styles.menu,
                  isActive && styles.activeTab,
                  item.link === 'JobHome' && isActive && { borderTopRightRadius: 20 },
                  item.link === 'Home' && isActive && { borderTopLeftRadius: 20 },
                ]}
                onPress={() => navigation.navigate(item.link)}
              >
                <Text
                  style={[
                    styles.text,
                    isActive ? styles.activeText : styles.inactiveText,
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>

              {/* Show 3-dot icon only in Affiliate tab */}
              {item.link === 'Home' && isActive && (
                <Pressable
                  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                  style={styles.dotIcon}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={{ margin: 10 }}>
          <CircleBorderIcon />
        </View>

        <View style={styles.profileText}>
          <Text style={styles.profileName}>{users?.fullName || 'User'}</Text>
          <Text style={styles.profilePosition}>{jobseekers['preferred_job_Title']}</Text>
        </View>

        <View style={styles.iconGroup}>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <SettingsIconB />
          </Pressable>
          <Pressable style ={{ marginTop:2.5}}  onPress={() => navigation.navigate('Notifications')}>
            <NotificationIconB />
          </Pressable>
        </View>
      </View>
    </View>
    </>
  );
};

export default TopHeaderAffiliateNew;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#4EAED8',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#4EAED8',
  },
  tabWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  menu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  text: {
    fontSize: 20,
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
  dotIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  profileText: {
    flex: 1,
    marginLeft: 2,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  profilePosition: {
    fontSize: 10,
    color: '#777',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 20,
  },
});
