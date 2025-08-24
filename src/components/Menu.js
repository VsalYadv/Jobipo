/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View, Image, Pressable,Dimensions, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SvgIcons from './SVGIcon';

const { width } = Dimensions.get('window');

const Menu = () => {
  const navigation = useNavigation();
  const router = useRoute();

  const menuList = [
    {
      title: 'Home',
      img: require('../../assets/icons/menu/home.png'),
      img_active: require('../../assets/icons/menu/home_active.png'),
      link: 'Home',
      subLink: ['ID', 'Visiting'],
    },
    {
      title: 'Products',
      img: require('../../assets/icons/menu/prod.png'),
      img_active: require('../../assets/icons/menu/prod_active.png'),
      link: 'Products',
      subLink: [''],
    },
    {
      title: 'Lead',
      img: require('../../assets/icons/menu/leads.png'),
      img_active: require('../../assets/icons/menu/leads_active.png'),
      link: 'Leads',
      subLink: ['LeadOnline'], 
    },
    { 
      title: 'Team',
      img: require('../../assets/icons/menu/team.png'),
      img_active: require('../../assets/icons/menu/team_active.png'),
      link: 'Myteam',
      subLink: [''],
    },
    // {
    //   title: 'Job Home',
    //   img: require('../../assets/icons/menu/home.png'),
    //   img_active: require('../../assets/icons/menu/home_active.png'),
    //   link: 'JobHome',
    //   subLink: [''],
    // },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <View style={styles.container}>
      {menuList.map((item, i) => {
        return (
          <Pressable
            style={styles.menu}
            key={i}
            onPress={() => navigation.navigate(item.link)}>
            <Image
              source={
                item.subLink.includes(router.name) || router.name === item.link
                  ? item.img_active
                  : item.img
              }
            />
            <Text style={styles.text}>{item.title}</Text>
          </Pressable>
        );
      })}
    </View>
     </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  // container: {
  //   position: 'absolute',
  //   bottom: 0,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   alignItems: 'center',
  //   height: 120,
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 30,
  //   paddingBottom:30,
  // },
  safeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width,
    height: 70,
    backgroundColor: '#fff',
    
  },
  text: {
    fontSize: 12,
    color: '#636363',
    textAlign: 'center',
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
