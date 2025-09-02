/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  Share,
  Linking,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
//import React from 'react';
import Header from '../components/Header';
import ImageSlider from 'react-native-image-slider';
  
import Menu from '../components/Menu';
import Logo from '../components/Auth/Logo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
 
import { withOrientation } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SliderBox } from "react-native-image-slider-box";
import { AuthContext } from '../context/context';
import { useColorScheme } from 'react-native';
import TopHeaderAffiliate from '../components/TopHeaderAffiliate';



let userToken;
userToken = null;
const Home = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const [NewProduct, setNewProduct] = useState([]);
  const [eComProduct,seteComProduct] = useState([]);
  const [TopProductData, setTopProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [leader, setLeader] = useState([]);
  const [slider, setSlider] = useState(["https://jobipo.com/uploads/users/JobipoImage.png"]);
  const [isLoading, setisLoading] = useState(true);
  const [earning, setEarning] = useState([]);
  const [totalEarning, setTotalEarning] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [paidEarning, setpaidEarning] = useState([]);
  const [LeadStatus, setLeadStatus] = useState('');
  const [ProductName, setProductName] = useState('');

    const colorScheme = useColorScheme();
    const statusBarColor = colorScheme === 'dark' ? '#FF8D53' : '#FF8D53';

  
  // useEffect(() => {
  //   setTimeout(async () => {
  //     try {
  //       userToken = await AsyncStorage.getItem('userToken');
  //     } catch (e) {
  //       console.log(e);
  //     }
  //     console.log(userToken);
  //     if (userToken == null) {
  //       navigation.navigate('Login');
  //     }
  //     //dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
  //   }, 1);
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {

        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/index',
          { 
            method: 'GET',
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        console.log('sliderDataApi', JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg));

        if (sliderDataApi) {
          if (sliderDataApi.logout !== 1) {
            setisLoading(false);

            setNewProduct(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).NewProduct,
            );

            seteComProduct(JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).eComProduct,);
            
            setTopProductData(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).TopProduct,
            );

            setCategoryData(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).category,
            );

            setUData(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).UData,
            );
 
            setUsers(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
            );

            setLeader(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leader,
            ); 

            setSlider(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).slider,
            );
            console.log('Title Data',   JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).slider);
          } else {
            signOut();
          }
        } else {
          Alert.alert('Connection Issue', 'Please check your internet connection.');
        }
      };

      let mount = true;
      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const GetDataFuncc = async () => {
        const formdata = { ProductName, LeadStatus };
        console.log(ProductName, LeadStatus);
        setisLoading(true);
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/myearning',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata),
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        setisLoading(false);
        if (sliderDataApi && sliderDataApi.logout !== 1) {
          setEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).earning,
          );
          setBonus(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).bonus,
          );

          setTotalEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).totalEarning,
          );

          setpaidEarning(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).paidEarning,
          );
          console.log('sliderDataApi  dd');
          console.log(JSON.parse(JSON.stringify(sliderDataApi)).msg);
        } else {
          // navigation.navigate('Login');
        }
      }; 

      GetDataFuncc();
    }, [ProductName, LeadStatus])
  );


  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Join Jobipo Now.Click On Link.  Refer Code: ' + users['uniqueCode'] + ' https://www.jobipo.in/ ',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <>
          <StatusBar backgroundColor={statusBarColor}  barStyle="light-content" />
      <View style={[
        (isLoading) ? {
          flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 99999, height: '100%', backgroundColor: '#ffffff', width: '100%',
        } : {
          display: 'none',
        }
      ]}>
        <Logo />
        <ActivityIndicator size="large" />
      </View>

<TopHeaderAffiliate/>
      {/* <Header /> */}
      <ScrollView style={styles.container}
        contentContainerStyle={{
          paddingBottom: 80
        }}
      >
        <View style={styles.profile}>
          <View style={styles.profContainer}>
            <Image
              source={{ uri: 'data:image/png;base64,' + users['Pic'] }}
              style={styles.profimage}
              resizeMode="contain" />
          </View>
          <View>
            <Text style={styles.h1}>Hi {users['fullName']}</Text>
            <Text style={styles.h2}>Your Refer Code: {users['uniqueCode']}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>

          <Pressable
            onPress={() => navigation.navigate('Contactus')}
            style={styles.card}>
            <View style={styles.cardIcon}>
              <Image source={require('../../assets/B&RIcons/help&support.png')} style={styles.imagecard} />
            </View>
            <Text style={styles.cardText}>Help and Supports</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Wallet')}
            style={styles.card}>
            <View style={styles.cardIcon}>
              <Image source={require('../../assets/B&RIcons/wallet.png')} style={styles.imagecard} />
            </View>
            <Text style={styles.cardTextt}>₹ {totalEarning ? totalEarning : 0}</Text>
            <Text style={styles.cardTextsmall}>Total Earning</Text>
          </Pressable>

          <Pressable
            onPress={() => onShare()}
            style={styles.card}>
            <View style={styles.cardIcon}>
              <Image source={require('../../assets/B&RIcons/Refer&earn.png')} style={styles.imagecard} />
            </View>
            <Text style={styles.cardText}>Refer and Earn </Text>
          </Pressable>
        </View>

 
        {/* <View style={styles.annContainer}>
          <View style={styles.annSlider}>
            <ImageSlider images={slider}
            style = {{width: '100%', height:100}}
          /> 
          </View> 
        </View>  */}
        
<View style={styles.annContainer}>
  <View style={styles.annSlider}>
    <Image
      source={{ uri: 'https://jobipo.com/uploads/users/JobipoImage.png' }}
      style={{ width: '100%', height: 150, resizeMode: 'cover', borderRadius: 10 }}
    />
  </View>
</View>


        <Text style={styles.annText}>Sales and Earn</Text>
        <FlatList
          data={categoryData}
          style={[styles.productContainer]}
          keyExtractor={item => item.categoryID}
          renderItem={({ item }) => {
            return (
              <>
                {
                  item.title != '' ? (

                    <Pressable
                      onPress={() => {
                        navigation.navigate('Accounts', {
                          title: item.title,
                          categoryID: item.categoryID,
                        });
                      }}
                      style={[styles.product]}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.productNo}>Product: {item.ProductCount}</Text>
                      <View style={styles.productDescBox}>
                        <Text style={styles.productDesc}>{item.description}</Text>
                      </View>
                    </Pressable>

                  ) : (

                    <Pressable
                      onPress={() => {
                        navigation.navigate('Products');
                      }}
                      style={[styles.product, styles.SeeMore]}>
                      <Text style={[styles.title, styles.seeMoreTitle]}>See</Text>
                      <Text style={[styles.title, styles.seeMoreTitle]}>More</Text>
                    </Pressable>

                  )}
              </>
            );
          }}
          horizontal={false}
          numColumns={3}
        />

        <Text style={styles.annText}>Recharge and Pay Bills</Text>
        <Pressable style={{
          backgroundColor: '#fff',
          padding: 15,
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          marginTop: 10,
          justifyContent: 'space-between',
        }} onPress={() => navigation.navigate('RechargeNo')}>
          <View style={{
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
          }}>
            <View style={styles.cardIconM}>
              <Image source={require('../../assets/B&RIcons/Mobile.png')} style={styles.imagecard} />
            </View>

            <Text style={{
              fontSize: 15,
              color: '#333',
            }}>
              Recharge your mobile now
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#0d4574" />
        </Pressable>


        <View style={[styles.cardContainer1, {
          display: "none"
        }]}>

          <Pressable
            onPress={() => navigation.navigate('RechargeNo')}
            style={styles.card1}>
            <View style={styles.cardIconM}>
              <Image source={require('../../assets/B&RIcons/Mobile.png')} style={styles.imagecard} />
            </View>
            <Text style={styles.cardTextt1}>Mobile</Text>
            <Text style={styles.cardTextsmall1}>Recharge</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('DTHBillerList')}
            style={styles.card1}>
            <View style={styles.cardIcon1}>
              <Image source={require('../../assets/B&RIcons/DTH.png')} style={styles.imagecard} />
            </View>
            <Text style={styles.cardTextt1}>DTH</Text>
            <Text style={styles.cardTextsmall1}>Recharge </Text>

          </Pressable>

          <Pressable
            // onPress={() => navigation.navigate('ElectricityBillerList')}
            style={styles.card1}>
            <View style={styles.cardIcon1}>
              <Image source={require('../../assets/B&RIcons/LOAN-REPAYMENT.png')} style={styles.imagecard} />
            </View>
            <Text style={styles.cardTextt1}>Loan</Text>
            <Text style={styles.cardTextsmall1}>Repayment</Text>
          </Pressable>
          {/* <Pressable
            onPress={() => navigation.navigate('MoreRecharge')}
            style={styles.cardMore}>
            <Text style={styles.cardTextMore}>More</Text>
          </Pressable> */}
        </View>



        <Text style={styles.annText}>New Products</Text>
        <FlatList
          data={NewProduct}
          style={[styles.pproductContainer]}
          keyExtractor={item => item.productId}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Product', {
                    title: item.title,
                    productId: item.productId,
                  });
                }}
                style={[styles.pproduct]}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pimage}
                  resizeMode="contain"
                />
              </Pressable>
            );
          }}
          horizontal={true}
        // numColumns={3}
        />
         <Text style={styles.annText}>Online shopping</Text>
        <FlatList
          data={eComProduct}
          style={[styles.pproductContainer]}
          keyExtractor={item => item.productId}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Product', {
                    title: item.title, 
                    productId: item.productId,
                  });
                }}
                style={[styles.ecomproduct]}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.pimage}
                  resizeMode="contain"
                />
              </Pressable>
            );
          }}
          horizontal={true}
        // numColumns={3}
        />
 

        {/* <Text style={styles.annText}>Online shopping</Text>

        <View style={styles.cardContainer1}>

          <Pressable
             onPress={() => navigation.navigate('Wallet')}
            style={styles.cardConImage}>
            <View style={styles.cardIcon1}>
              <Image
                source={{ uri: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png' }}
                style={styles.cardImage1} />
            </View>

          </Pressable>
          <Pressable
              onPress={() => navigation.navigate('Contactus')}
            style={styles.cardConImage}>
            <View style={styles.cardIcon1}>
              <Image
                source={{ uri: 'https://m.media-amazon.com/images/G/31/gc/designs/livepreview/a_for_amazon_default_child_noto_email_in-main._CB485944111_.png' }}
                style={styles.cardImage1} />
            </View>

          </Pressable>


          <Pressable
             onPress={() => navigation.navigate('Myearning')}
            style={styles.cardConImage}>
            <View style={styles.cardIcon1}>
              <Image
                source={{ uri: 'https://brandlogos.net/wp-content/uploads/2022/03/myntra-logo-brandlogos.net_.png' }}
                style={styles.cardImage1} />
            </View>

          </Pressable>
          <Pressable
             onPress={() => navigation.navigate('Myearning')}
            style={styles.cardMore2}>
            { <View style={styles.cardIcon1}>
             <FontAwesome name="users" size={25} color="#fff" />
             </View> }
            <Text style={styles.cardTextMore}>More</Text>
            {<Text style={styles.cardTextsmall1}>Total </Text> }
          </Pressable>
        </View> */}
        {
            (leader.length > 0) ? 
            <>
              <Text style={styles.annText}>Success Story</Text>
        <FlatList
          data={leader}
          style={[styles.leadercontainer]}
          keyExtractor={item => item.leaderId}
          renderItem={({ item }) => {
            return (
              <View
                style={[styles.leaderdetails]}>
                {item.image !== '' ? (
                  <View style={[styles.leaderimageCon]}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.leaderimage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={{
                    marginHorizontal: 20,
                    marginRight: 5,
                  }}>
                    <FontAwesome name="user" size={60} color="#0d4574" />
                  </View>
                )}
                 {/* <Image
        source={require('../../assets/Image/image2.png')} 
        style={styles.leaderimage}
        resizeMode="contain"
      /> */}
                <View style={{ flex: 5, textAlign: 'center', alignContent: 'center', marginLeft: 26, color: '#333', }}>
                  <Text style={{ fontSize: 17, marginBottom: 5, color: '#333', }}>{item.name}</Text>
                  <Text style={{ fontSize: 12 }}>{item.message}</Text>
                </View>
              </View>
            );
          }}
          horizontal={true}
        // numColumns={3}
        />
            </> : 
            <>
            </>
        }
      

        <View style={styles.FooterContent}>
          <Text style={{
            fontSize: 14, textAlign: 'center', color: '#333',
          }}>Follow us on social media plateforms.</Text>
          <View style={styles.SocialList}>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.facebook.com/share/198hRxVnFA/?mibextid=wwXIfr`)
              }}
              style={styles.SocialImage}
            >
              <FontAwesome name="facebook-f" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.instagram.com/jobipo_official?igsh=b2JscG00Y3kweGYw&utm_source=qr`)
              }}
              style={styles.SocialImage}
            >
              <FontAwesome name="instagram" size={15} color="#fff" />
            </Pressable>
            {/* <Pressable
              onPress={() => {
                Linking.openURL(`https://www.jobipo.com/`)
              }}
              style={styles.SocialImage}
            >
              <FontAwesome name="twitter" size={15} color="#fff" />
            </Pressable> */}
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.youtube.com/@Jobipo`)
              }}
              style={styles.SocialImage}
            >
              <FontAwesome name="youtube-play" size={15} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                Linking.openURL(`https://www.linkedin.com/company/jobipo/`)
              }}
              style={styles.SocialImage}
            >
              <FontAwesome name="linkedin" size={15} color="#fff" />
            </Pressable>
          </View>
          {/* <Pressable
            onPress={() => {
              Linking.openURL(`https://www.jobipo.com/`)
            }}
            style={styles.TeligramLink}
          >
            <FontAwesome name="telegram" size={20} color="#fff" style={{ marginHorizontal: 10, }} />
            <Text style={{ color: '#fff', textAlign: 'center', }}> Live update on Telegram</Text>
          </Pressable> */}
        </View>

        { /*  <View style={styles.annContainer}>
          <Text style={styles.annText}>Trainings</Text>
          <View style={styles.trainingSlider}>
            <View style={styles.trainingImage}>
              <Image source={require('../../assets/Image/training1.png')} />
            </View>
            <View style={styles.trainingBox}>
              <Text style={styles.trainingText}>
                Jobipo Introduction
              </Text>
              <View style={styles.trainingDateContainer}>
                <Text style={styles.trainingDate}>June 05, 2022</Text>
                <View style={styles.trainingDateLine}></View>
                <Text style={styles.trainingDate}>11:30AM- 12:30PM</Text>
              </View>
              <View style={styles.join}>
                <Text style={styles.joinText}>Join Now</Text>
              </View>
            </View>
          </View>
        </View> */ }


      </ScrollView>
      <Menu />
    </>
  );
};

export default Home;





const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profContainer: {
    width: 82,
    height: 82,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,

  },
  h1: {
    fontSize: 20,
    // color: '#595959',
    color: '#333',

  },
  h2: {
    fontSize: 12,
    color: '#595959',
  },
  annContainer: {
    marginTop: 15,

  },
  annText: {
    // backgroundColor:'#FFC895',
    fontSize: 20,
    color: '#333',
    // alignItems: 'center',
    // justifyContent: 'center',
    // textAlign:'center',
    fontWeight: '500',
    marginTop: 10,
    padding: 5,
  },
  annSlider: {
    marginTop: 12,
  },
  boxContainer: {
    marginTop: 3,
  },
  flexBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  box: {
    backgroundColor: '#0d4574',
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '48%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  currencyType: {
    fontSize: 12,
    lineHeight: 23,
    color: '#fff',

  },
  currencyAmount: {
    fontSize: 16,
    lineHeight: 30,
    color: '#fff',
  },
  textone: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 23,

  },
  infoIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  infoImage: {
    width: 13,
    height: 13,
  },
  cardContainer: {
    flexDirection: 'row',
    marginTop: 21,
    justifyContent: 'space-between',

  },
  card: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d4574',
    borderRadius: 6,
    height: 78,
    width: '32%',
    borderColor: '#0d4574',
    borderWidth: 1,
    padding: 10,
  },
  cardIcon: {
    marginTop: 10,
    // marginBottom:5,
  },
  cardText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardTextt: {
    color: '#fff',
    fontSize: 12,
  },
  cardTextsmall: {
    fontSize: 10,
    color: '#fff',

  },
  cardImage: {
    backgroundColor: '#D0BAEA',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'absolute',
    right: -15,
  },
  cardImage2: {
    backgroundColor: '#D0BAEA',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'absolute',
    left: -15,
  },
  trainingSlider: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  trainingImage: {
    backgroundColor: '#F8F3FD',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 9,
    marginRight: 20,
  },
  trainingBox: {
    borderLeftWidth: 1.5,
    borderColor: '#D0BAEA',
    height: 96,
    paddingLeft: 20,
    paddingTop: 10,
  },
  trainingText: {
    color: '#595959',
    fontSize: 15,
  },
  trainingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  trainingDate: {
    color: '#595959',
    fontSize: 12,
  },
  trainingDateLine: {
    height: '70%',
    width: 1,
    backgroundColor: '#595959',
    marginHorizontal: 5,
  },
  join: {
    backgroundColor: '#EF8C8C',
    borderRadius: 8.5,
    width: 69,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    marginTop: 13,
  },
  joinText: {
    fontSize: 12,
  },
  productContainer: {
    marginVertical: 10,
    marginBottom: 10,
    width: "100%",
    paddingRight: 0,
    marginLeft: 0,
  },
  pproductContainer: {
    marginVertical: 10,
    marginBottom: 5,
    width: "100%",
    paddingRight: 0,
    marginLeft: 0,
    backgroundColor: '#ffff',

  },
  leadercontainer: {
    marginVertical: 10,
    marginBottom: 15,
    width: "100%",
    paddingRight: 0,
    marginLeft: 0,
  },
  FooterContent: {
    marginTop: 40,
    marginBottom: 10,
  },
  SocialList: {
    flexDirection: 'row',
    width: '50%',
    marginLeft: '22.5%',
    marginVertical: 13,

  },
  SocialImage: {
    flex: 1, 
    backgroundColor: '#535353',
    marginLeft: 10,
    borderRadius: 20,
    padding: 8,
    textAlign: 'center',
    justifyContent: 'center',

  },
  TeligramLink: {
    flexDirection: 'row',
    backgroundColor: '#0d4574',
    marginTop: 5,
    width: '80%',
    marginLeft: '10%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  SeeMore: {
    borderRadius: 90,
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  product: {
    backgroundColor: '#fff',
    width: "31%",
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 1,
    borderRadius: 7,
  },
  pproduct: {
    backgroundColor: '#edfaff',
    width: 68,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 50,
  },
  leaderdetails: {
    backgroundColor: '#fff',
    width: 300,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
  },
  pimage: {
    width: 50,
    height: 50,
  },
  leaderimageCon: {
    width: 50,
    maxWidth: 50,
    height: 50,
    flex: 2,

  },
  leaderimage: {
    width: 50,
    maxWidth: 50,
    height: 50,
    flex: 2,
    borderRadius: 50,
    borderColor: '#0d4574',
    borderWidth: 1,
    marginLeft: 10,
  },
  profimage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: '#0d4574',
    borderWidth: 1,
  },
  title: {
    color: '#595959',
    paddingTop: 2,
    fontSize: 10,
  },
  seeMoreTitle: {
    fontSize: 17,
    paddingTop: 0,
  },
  productNo: {
    color: '#595959',
    marginVertical: 0,
    fontSize: 12,
  },
  productDescBox: {
    backgroundColor: '#F8F3FD',
    width: '100%',
    paddingVertical: 2,
    borderRadius: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    backgroundColor: '#F8F8F8',
    fontSize: 8,
  },
  content: {
    padding: 10,

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 5,
  },
  sectionContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
  },
  box1: {
    width: '20%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    padding: 20,
  },
  boxText: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },



  cardContainer1: {
    flexDirection: 'row',
    marginTop: 21,
    justifyContent: 'space-between',
    backgroundColor: '#ffff',
    padding: 20,
  },
  card1: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    height: 76,
    width: '24%',
    borderColor: '#ffff',
    // borderWidth:1, 
    // elevation: 3,
  },
  cardMore: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC895',
    borderRadius: 16,
    height: 76,
    width: '24%',
    borderColor: '#FFC895',
    borderWidth: 1,
    // elevation: 3,
  },
  cardIcon1: {
    marginTop: 10,
    marginBottom: 5,
  },
  imagecard: {
    width: 30,
    height: 30,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  cardIconM: {
    marginTop: 10,
    // marginBottom:5,
  },
  cardText1: {
    color: '#333',
    fontSize: 12,
    marginBottom: 10,
  },
  cardTextMore: {
    color: '#ffff',
    fontSize: 12,
    marginBottom: 10,
  },
  cardTextt1: {
    color: '#333',
    fontSize: 12,
  },
  cardTextsmall1: {
    fontSize: 10,
    color: '#333',

  },
  ecomproduct: {
    backgroundColor: '#edfaff',
    width: 68,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,   
    borderColor: '#0d4574',
    borderWidth: 1,      
  },
  cardConImage: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 60,
    width: '20%',
    borderColor: '#0d4574',
    borderWidth: 1,
    // elevation: 3,
  },
  cardMore2: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC895',
    borderRadius: 16,
    height: 60,
    width: '20%',
    borderColor: '#FFC895',
    borderWidth: 1,
  },
  cardImage1: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
});
