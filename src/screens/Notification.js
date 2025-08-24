/* eslint-disable prettier/prettier */
import {
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    Pressable,
  } from 'react-native';
  import React from 'react';
  import Menu from '../components/Menu';
  import { Header2 as Header } from '../components/Header';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';

  const Notification = ({ navigation,route }) => {
    const { params } = route;   
    console.log(params.image); 
    const products = [
      { 
        id: 0,
        title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
        content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
      },
      { 
        id: 1,
        title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
        content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
      },
      { 
        id: 2,
        title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
        content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
      },
      { 
        id: 3,
        title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
        content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
      },
      { 
        id: 4,
        title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
        content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
      },
      { 
        id: 5,
        title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
        content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
      },

    ];
    return (
      <>
        <Header title= 'Notifications' />
        <View style={styles.container}>
              <Pressable
                onPress={() => {
                  //angelonebaner
                }} 
                style={[styles.product]}>
                <View style={styles.productDescBox}>
                    <Image
                        source={{uri: params.image}}
                        resizeMode="contain"
                        style={[styles.image]}
                    />                    
                    <Text style={styles.title}>{params.title}</Text>
                    <Text style={styles.content}>{params.contents}</Text>
                </View>              
              </Pressable>
        </View>
        <Menu />
      </>
    );
  };
  
  export default Notification;
  
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 14,
      paddingHorizontal: 10,
      backgroundColor: '#f8f8f8',
      flex: 1,
      marginBottom: 50,
    },
    product: {
      width: '95%',
      margin: 0,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: 0,
      paddingBottom: 5,
      paddingHorizontal: 4,
      borderRadius: 5,
      flexDirection: 'row',
      flexWrap: 'wrap',  
    },
    image: {
      width: '100%',
      height: 150,
      backgroundColor: '#edfaff',
      alignItems: 'center',
    }, 
    title: {
      color: '#595959',
      paddingTop: 0,
      fontSize: 17,
    },
    productNo: {
      color: '#595959',
      marginVertical: 10,
      fontSize: 12,
    },
    productDescBox: {
      width: '80%',
      paddingVertical: 0,
      borderRadius: 0,
      flex: 5,
      paddingLeft: 5,
      paddingBottom: 5,
    },
    productDesc: {
      textAlign: 'center',
      color: '#595959',
      fontSize: 12,
    },
    cardIcon:{
      fontSize: 15,
    },
    cardText:{
      fontSize: 15,
      color: '#0d4574',
    },
    card:{
      marginTop:15,
    },
  });
  