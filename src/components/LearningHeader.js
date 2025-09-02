/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, Pressable, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SettingsIcon, NotificationIcon, CircleBorderIcon } from './SVGIcon';
import { HeartFilledWhiteIcon, HeartFilledOrangeIcon, HeartFilledOrangeIconNew } from '../screens/JobSvgIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const LearningHeader = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [jobseekers, setJobseekers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const res = await fetch('https://jobipo.com/api/Agent/index');
          const sliderDataApi = await res.json();

          if (sliderDataApi?.logout !== 1) {
            setisLoading(false);
            const parsedMsg = JSON.parse(sliderDataApi?.msg);
            setUsers(parsedMsg?.users);
            if (parsedMsg?.jobseeker) {
              setJobseekers(parsedMsg.jobseeker);
            }
          } else {
            signOut();
          }
        } catch (err) {
          console.log('❌ Fetch or Parse Error:', err);
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
      title: 'Videos',
      icon_active: null,
      icon_inactive: null,
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'Learning',
      subLink: [''],
    },
    {
      title: 'PDF & Other',
      // icon_active: <HeartFilledOrangeIconNew />,
      // icon_inactive: <HeartFilledWhiteIcon />,
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'PdfComponent',
      subLink: [''],
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF8D53" />
      <View style={[styles.whiteWrapper, { paddingTop: insets.top }]}>
              <View style={styles.whiteWrapperNew}>

        <View style={styles.container}>
          {menuList.map((item, i) => {
            const isActive = item.subLink.includes(router.name) || router.name === item.link;
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
                <View style={styles.iconWithText}>
                  <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>
                    {item.title}
                  </Text>
                  <View style={{ marginLeft: 6 }}>
                    {isActive ? item.icon_active : item.icon_inactive}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
        </View>
      </View>
    </>
  );
};

export default LearningHeader;

const styles = StyleSheet.create({
  whiteWrapper: {
    backgroundColor: '#FFA556',
    overflow: 'hidden',
  },
  whiteWrapperNew: {
    backgroundColor: '#ffffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    backgroundColor: '#ffffffff',
    marginTop:8,
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: '#FFA556',
  },
  activeText: {
    color: '#ffffff',
  },
  inactiveText: {
    color: '#000000',
  },
  iconWithText: {
        

    flexDirection: 'row',
    alignItems: 'center',
  },
});
