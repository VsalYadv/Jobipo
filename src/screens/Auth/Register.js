import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity // For the custom Button component
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// If you are using react-native-vector-icons for the checkbox checkmark
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or any other icon set you prefer
import StepIndicator, { StepIndicator1, StepIndicator2, StepIndicator3 } from './StepIndicator';
import LogoS from '../../components/Auth/LogoS';

// Dummy Button Component (Replace with your actual Button component if you have one)
const token = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
let notificationConsent = 1
let useridUnique = ''
let details = {}
const Button = ({ onPress, text, style }) => (
  <TouchableOpacity style={[styles.buttonBase, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);


const Register = ({ navigation }) => {
  
  const [fullName, setfullName] = useState('');
  const [emailID, setemailID] = useState('');
  const [contactNumber, setcontactNumber] = useState('');
  const [uniqueCode, setuniqueCode] = useState('');
  const [terms, setterms] = useState(0);
  const [otp, setotp] = useState(['', '', '', '']);
  const [Rotp, setRotp] = useState('');
  const [FilterDisplay, setFilterDisplay] = useState(1); 
  const [ShowSubmit, setShowSubmit] = useState(1); 
  const [timer, setTimer] = useState(30);
  const [isOtpSent, setIsOtpSent] = useState(false); 

  const otpRefs = useRef([]); 

  useFocusEffect(
    useCallback(() => {
      setIsOtpSent(false);
      setotp(['', '', '', '']);
      setRotp(''); 
      setTimer(30); 
      setFilterDisplay(1);
      setShowSubmit(1); 
      setfullName('');
      setemailID('');
      setcontactNumber('');
      setuniqueCode('');
      setterms(0);

      return () => {
        // Cleanup logic if needed
      };
    }, [])
  );

  const FinalSubmit = async () => {
    if (fullName !== '' && emailID !== '' && contactNumber !== '') {
      // Before sending OTP, check if terms are accepted
     

      var formdata = {
        fullName: fullName,
        email: emailID,
        mobile: contactNumber,
        referCode: uniqueCode,
        notificationConsent : 1,
      };

      try {
        // This is the initial signup call that should trigger OTP sending
        const ResData = await fetch('https://jobipo.com/api/v3/sign-up-process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formdata),
        }).then(res => res.json());

        // just add this to tesyt i will remove this later keep in mind also add ResData && ResData.status === 1 in below if condition
        

        console.log('FinalSubmit (Initial Signup) response:', ResData);
        details = ResData

        if ( ResData && ResData.success ) {
          // Don't navigate here - wait for OTP verification
          setIsOtpSent(true); 
          setRotp(ResData.otp || '');
          setTimer(30); 

          await AsyncStorage.setItem('UserID', String(ResData.UserID));
          await AsyncStorage.setItem('Token', String(ResData.token));
          await AsyncStorage.setItem('ContactNumber', String(contactNumber));

          const storedUserId = await AsyncStorage.getItem('UserID');
          const storedToken = await AsyncStorage.getItem('Token');
          const storedContactNumber = await AsyncStorage.getItem('ContactNumber');
          console.log('Saved userId in AsyncStorage:', storedUserId);
          console.log('Saved storedToken in AsyncStorage:', storedToken);
          console.log('Saved contactNumber in AsyncStorage:', storedContactNumber);

          // Alert.alert(String(ResData.msg)); 
        } else {
          Alert.alert(String(ResData.message || 'An error occurred during signup.'));
        }
      } catch (err) {
        console.log('FinalSubmit (Initial Signup) error:', err);
        Alert.alert('An error occurred during signup.');
      }
    } else {
      Alert.alert('Please Fill All Required Data (Full Name, Email, Mobile Number)');
    }
  };

 const checkOtp = async () => {
  const enteredOtp = otp.join('').trim();

  if (enteredOtp.length !== 4 || otp.includes('')) {
    Alert.alert('Please enter all 4 digits of OTP.');
    return false;
  }

  const formdata = {
    mobile: contactNumber,
    otp: enteredOtp,
    userData : details.userData  // i have change this 
  };

  console.log('FormData being sent to verify-otp API:', formdata);

  try {
    const ResData = await fetch('https://jobipo.com/api/v3/verify-sign-up-process-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formdata),
    }).then(res => res.json());

    console.log('checkOtp response:', ResData);
    // i am changing this for testing i will remove it later 
    
    
//
    if (ResData.success) {
      // Alert.alert('OTP Verified Successfully');
      await AsyncStorage.setItem('UserID', String(ResData.userId));
      navigation.navigate('RegistrationP');
      return true;
    } else {
      Alert.alert(String(ResData.msg || 'Invalid OTP.'));
      return false;
    }
  } catch (err) {
    console.log('checkOtp error:', err);
    Alert.alert('An error occurred while verifying OTP.');
    return false;
  }
};


  // const handleOTPChange = (text, index) => {
  //   const digit = text.replace(/[^0-9]/g, '').trim(); 
  //   const newOtp = [...otp];
  //   newOtp[index] = digit;
  //   setotp(newOtp);

  //   if (digit && index < otp.length - 1) {
  //     otpRefs.current[index + 1]?.focus();
  //   }
  //   if (!digit && text === '' && index > 0) {
  //     otpRefs.current[index - 1]?.focus();
  //   }

  // };

  const handleOTPChange = (text, index) => {
  const digit = text.replace(/[^0-9]/g, '').trim();
  const newOtp = [...otp];
  newOtp[index] = digit;
  setotp(newOtp);

  if (digit && index < otp.length - 1) {
    otpRefs.current[index + 1]?.focus();
  }
  if (!digit && text === '' && index > 0) {
    otpRefs.current[index - 1]?.focus();
  }
};

useEffect(() => {
  const enteredOtp = otp.join('').trim();
  if (otp.every(d => d !== '') && enteredOtp.length === 4) {
    checkOtp(); 
  }
}, [otp]);


  /*
  const varifyOtp = async () => {
    const enteredenteredOtp = otp.join('');
    if (enteredenteredOtp !== '') {
      if (enteredenteredOtp === Rotp) { // This comparison should ideally be done on the server
        setShowSubmit(0);
        setFilterDisplay(1);
        Alert.alert('OTP Matched.');
      } else {
        Alert.alert('OTP Not Match.');
      }
    } else {
      Alert.alert('Please Enter OTP.');
    }
  };
  */

  // This `Submit` function seems to be an alternative way to send OTP.
  // I'm assuming `FinalSubmit` is your primary signup/send OTP method.
  // If `Submit` is intended for resending OTP, it should use the `sendOtp` logic.
  /*
  const Submit = async () => {
    if (fullName !== '' && emailID !== '' && contactNumber !== '') {
      var formdata = { contactNumber: contactNumber, fullName: fullName };

      try {
        const ResData = await fetch('https://jobipo.com/api/Signup/sendOtp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdata),
        }).then(res => res.json());

        console.log('Submit sendOtp response:', ResData);
        if (ResData && ResData.status === 1) {
          setRotp(ResData.msg);
          setFilterDisplay(0); // This might mean showing OTP input
        } else {
          Alert.alert(String(ResData.msg || 'Failed to send OTP.'));
        }
      } catch (err) {
        console.log('Submit sendOtp error:', err);
        Alert.alert('An error occurred while sending OTP.');
      }
    } else {
      Alert.alert('Please Fill All Data');
    }
  };
  */

  const sendOtp = async () => {
    console.log('Resend OTP called');
   if (fullName !== '' && emailID !== '' && contactNumber !== '') {
      // Before sending OTP, check if terms are accepted
     

      var formdata = {
        fullName: fullName,
        email: emailID,
        mobile: contactNumber,
        referCode: uniqueCode,
        notificationConsent : notificationConsent + 1,
      };

      try {
        // This is the initial signup call that should trigger OTP sending
        const ResData = await fetch('https://jobipo.com/api/v3/sign-up-process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(formdata),
        }).then(res => res.json());

        // just add this to tesyt i will remove this later keep in mind also add ResData && ResData.status === 1 in below if condition
        

        console.log('FinalSubmit (Initial Signup) response:', ResData);
        


        if ( ResData && ResData.success ) {
          // Don't navigate here - wait for OTP verification
          setIsOtpSent(true); 
          setRotp(ResData.otp || '');
          setTimer(30); 

          //await AsyncStorage.setItem('UserID', String(ResData.UserID));
          await AsyncStorage.setItem('Token', String(ResData.token));
          await AsyncStorage.setItem('ContactNumber', String(contactNumber));

          const storedUserId = await AsyncStorage.getItem('UserID');
          const storedToken = await AsyncStorage.getItem('Token');
          const storedContactNumber = await AsyncStorage.getItem('ContactNumber');
          console.log('Saved userId in AsyncStorage:', storedUserId);
          console.log('Saved storedToken in AsyncStorage:', storedToken);
          console.log('Saved contactNumber in AsyncStorage:', storedContactNumber);

          // Alert.alert(String(ResData.msg)); 
        } else {
          Alert.alert(String(ResData.message || 'An error occurred during signup.'));
        }
      } catch (err) {
        console.log('FinalSubmit (Initial Signup) error:', err);
        Alert.alert('An error occurred during signup.');
      }
    } else {
      Alert.alert('Please Fill All Required Data (Full Name, Email, Mobile Number)');
    }
  };

  // Timer useEffect
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  console.log('isOtpSent:', isOtpSent);

  return (
    <View style={styles.Viewcontainer}>
      <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>

          {!isOtpSent && ( // Show the registration form if OTP is not yet sent
            <>
           <StepIndicator1/>

           <LogoS/>
              <View style={styles.card}>
                <View style={styles.headcontainer}>
                <Text style={styles.heading}>Get Your </Text>
                <Text style={styles.heading}>
                <Text style={styles.orangeText}>Dream Job</Text>
                <Text style={styles.normalText}> Today</Text>
                </Text>    
                <Text style={styles.subheading}>Connect talent with opportunity</Text>
                </View>

             

                <View style={styles.credContainer}>
                  <View style={styles.fieldContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={text => setfullName(text)}
                      placeholder=" Your Name"
                      placeholderTextColor="#D0D0D0"
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <TextInput
                      value={emailID}
                      onChangeText={text => setemailID(text)}
                      placeholder=" Email"
                      style={styles.textInput}
                      placeholderTextColor="#D0D0D0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[ShowSubmit === 0 ? { display: 'none' } : { display: 'flex' }]}>
                    <View style={styles.fieldContainer}>
                      <TextInput
                        value={contactNumber}
                        onChangeText={text => {
                          const cleanedText = text.replace(/[^0-9]/g, '');
                          if (cleanedText.length <= 10) {
                            setcontactNumber(cleanedText);
                          }
                        }}
                        placeholder="Mobile Number"
                        placeholderTextColor="#D0D0D0"
                        style={[styles.textInput]}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldContainer}>
                    <TextInput
                      value={uniqueCode}
                      onChangeText={text => setuniqueCode(text)}
                      placeholder=" Refer Code (Optional)"
                      placeholderTextColor="#D0D0D0"
                      style={styles.textInput}
                    />
                  </View>
                </View>

                <View style={styles.extraInfo}>
                  <Text style={styles.extraTextt}>
                    By Continuing, you agree to our{' '}
                    <Text
                      style={styles.Textblue}
                      onPress={() => Linking.openURL('https://jobipo.com/Account/privacy-policy.html')}
                    >
                      Privacy Policy
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={styles.Textblue}
                      onPress={() => Linking.openURL('https://jobipo.com/terms-services')}
                    >
                      Terms & Conditions
                    </Text>.
                  </Text>
                </View>

                <View style={styles.extraInfo}>
                  <Pressable
                    onPress={() => setterms(terms === 0 ? 1 : 0)}
                    style={[
                      styles.checkbox,
                      { backgroundColor: terms === 1 ? '#FF8D53' : '#fff' },
                    ]}
                  >
                    {terms === 1 && <Icon name="check" size={16} color="#fff" />}
                  </Pressable>
                  <Text style={styles.extraText}>
                    I hereby authorize to send notification on SMS/Messages/Promotional/Informational messages
                  </Text>
                </View>

                <View style={styles.continuebtn}>
                  <Button style={styles.continuesavebtn} onPress={FinalSubmit} text="Continue" />
                </View>
{/* <Pressable
  style={styles.continuebtn}
  onPress={() => {
    setIsOtpSent(true); 
  }}
>
  <Text style={styles.continuesavebtn}>Send OTP</Text>
</Pressable> */}

                <View style={styles.lastInfo}>
                  <Text style={styles.lastInfoText}>You have an account?</Text>
                  <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.lastInfoText, { marginLeft: 10, fontWeight: 'bold' ,backgroundColor:'#ffffff',paddingHorizontal:8,borderRadius:10,}]}>Log In</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {isOtpSent && ( 
            <View style={styles.fcontainer}>
              {/* <Text style={styles.ffiltertext}>Enter 4-Digit OTP </Text> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
            <Text style={styles.ffiltertext}>Enter OTP sent to <Text style={{ color: '#585858', fontWeight: '700' }}>{contactNumber}</Text></Text>
            <Pressable
            onPress={() => {
            setIsOtpSent(false);
            setotp(['', '', '', '']);
            setTimer(30);
            }}
            >
            <Text style={{ color: '#FF8D53', fontWeight: 'bold' ,    marginBottom: 20,marginLeft:2}}> edit</Text>
            </Pressable>
            </View>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    value={digit}
                    onChangeText={text => handleOTPChange(text, index)}
                    maxLength={1}
                    keyboardType="numeric"
                    style={styles.otpBox}
                    ref={ref => (otpRefs.current[index] = ref)}
                    onKeyPress={({ nativeEvent }) => {
                      // Handle backspace to move focus
                      if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                        otpRefs.current[index - 1]?.focus();
                      }
                    }}
                  />
                ))}
              </View>

              {/* <Pressable onPress={checkOtp} style={styles.applybtn}>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 15 }}>Verify OTP</Text>
              </Pressable> */}

              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                  </Text>
                ) : (
                  <Pressable
                    style={styles.resendBtn}
                    onPress={sendOtp}
                  >
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </Pressable>
                )}
              </View>
              {/* <View style={styles.resendContainer}>
              
                  <Pressable
                    style={styles.resendBtn}
                    onPress={sendOtp}
                  >
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </Pressable>
               
              </View> */}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Viewcontainer: {
    flex: 1,
    backgroundColor: '#F5F4FD',
     alignItems: 'center',       
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    padding: 36,
    alignItems: 'center',       
    justifyContent: 'center',

  },
  // card: {
  //   width: '90%',
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   padding: 20,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  headcontainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#center',
    textAlign: 'center',
    marginTop: 5,
    fontWeight:'400',
  },
  orangeText: {
  color: '#FF8D53',
},

normalText: {
  color: '#000', 
},
  toggleContainer: {
  flexDirection: 'row',
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#FF8D53',
  marginTop: 16,
  width: '100%',
  alignSelf: 'center',
  overflow: 'hidden',
},
toggleBtn: {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'center',
},

 active: {
  backgroundColor: '#FF8D53',
  // borderRadius: 25,
},
  inactive: {
    backgroundColor: '#fff',
    
  },
 toggleTextActive: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

toggleTextInactive: {
  color: '#FF8D53',
  fontWeight: 'bold',
  fontSize: 16,
},

  credContainer: {
    // marginBottom: 10,
    marginTop:20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    paddingVertical:14,
    backgroundColor:'#ffffff',
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap', // Allow text to wrap
  },
  extraTextt: {
    fontSize: 13,
    color: '#585858',
    fontWeight:'400',
  },
  Textblue: {
    color: '#FF8D53',
    fontWeight: '400',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 0.6,
    borderColor: '#FF8D53',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraText: {
    flex: 1,
    fontSize: 10,
    color: '#555',
  },
  continuebtn: {
    marginTop: 20,
  },
  continuesavebtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '70%',
    alignSelf:'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  lastInfoText: {
    fontSize: 14,
    color: '#555',
  },

  // OTP specific styles
  fcontainer: {
    width: '100%',
    backgroundColor: '#F5F4FD',
    borderRadius: 10,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  ffiltertext: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 20,
    color: '#333',
  },
  otpContainer: {
  flexDirection: 'row',
  justifyContent: 'center', 
  marginTop: 10,
  marginBottom: 10
  },
  otpBox: {
   width: 50,
  height: 50,
  borderWidth: 0.75,
  borderRadius: 10,
  borderColor: '#D0D0D0',
  textAlign: 'center',
  fontSize: 18,
  color: '#000',
  backgroundColor: '#ffffff',
  marginHorizontal: 4,
  },
  applybtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#585858',
    marginBottom: 10,
    fontWeight:'400',
  },
  resendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    // No background for resend, just text
  },
  resendText: {
    color: '#FF8D53',
    fontWeight: '500',
    fontSize: 15,
  },
  buttonBase: { // Base style for the custom Button component
    // Defined in continuesavebtn and applybtn
  }
});

// thos to test git

export default Register;