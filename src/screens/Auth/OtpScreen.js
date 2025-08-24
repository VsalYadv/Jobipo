import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Keyboard
} from 'react-native';
import { AuthContext } from '../../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';

const OtpScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const { signIn } = useContext(AuthContext);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const otpInputs = useRef([]);

  /** -------------------- OTP Service Functions -------------------- **/
  
  const startOtpListener = (callback) => {
    RNOtpVerify.getOtp()
      .then(() => {
        RNOtpVerify.addListener((message) => {
          const otpMatch = message.match(/(\d{4})/); // extract 4-digit OTP
          if (otpMatch) callback(otpMatch[0]);
        });
      })
      .catch(err => console.log("OTP listener error:", err));
  };

  const removeOtpListener = () => {
    RNOtpVerify.removeListener();
  };

  const getAppHash = () => {
    RNOtpVerify.getHash()
      .then(hash => console.log("App hash:", hash))
      .catch(err => console.log("Hash error:", err));
  };

  /** -------------------- OTP Input Handling -------------------- **/
  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) otpInputs.current[index - 1]?.focus();
      return;
    }
    if (!/^\d$/.test(text)) return;

    newOtp[index] = text;
    setOtp(newOtp);
    if (index < 3) otpInputs.current[index + 1]?.focus();

    if (index === 3) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 4) Submit(fullOtp);
    }
  };

  /** -------------------- Submit OTP -------------------- **/
  const Submit = async (autoOtp = null) => {
    const currentOtp = autoOtp || otp.join('');
    const formdata = { username, otp: currentOtp };

    try {
      const response = await fetch('https://jobipo.com/api/v2/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      });

      const ResData = await response.json();
      console.log("ResData", ResData);

      if (ResData.status == 1) {
        await AsyncStorage.setItem('UserID', String(ResData.user_id));
        
        await signIn(String(ResData.token), username);
        //Alert.alert('Login Successful');
      } else {
        Alert.alert(ResData.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Login failed');
    }
  };

  /** -------------------- Resend OTP -------------------- **/
  const resendOtp = async () => {
    const res = await fetch('https://jobipo.com/api/v2/send-login-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (data.status === 1) setTimer(30);
    else Alert.alert(data.message);
  };

  /** -------------------- Timer -------------------- **/
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  /** -------------------- Auto OTP Listener -------------------- **/
  useEffect(() => {
    getAppHash();

    startOtpListener((code) => {
      const codeArray = code.split('');
      setOtp(codeArray);

      codeArray.forEach((digit, idx) => {
        otpInputs.current[idx]?.setNativeProps({ text: digit });
      });

      Keyboard.dismiss();
      Submit(code);
    });

    return () => removeOtpListener();
  }, []);

  /** -------------------- Edit Number -------------------- **/
  const handleEdit = () => {
    setOtp(['', '', '', '']); 
    navigation.navigate('Login'); 
  };

  /** -------------------- UI -------------------- **/
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>
          Enter OTP sent to <Text style={styles.usertitle}>{username}</Text>
        </Text>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={styles.editButton}>edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otpBox}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => otpInputs.current[index] = ref}
            value={digit}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={text => handleOTPChange(text, index)}
          />
        ))}
      </View>

      <Text style={styles.timerText}>
        {timer > 0 ? `Resend OTP in 00:${String(timer).padStart(2, '0')}` : ''}
      </Text>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={resendOtp}
        disabled={timer > 0}
      >
        <Text style={{ color: '#FF8D53' }}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F5F4FD' },
  usertitle: { color: '#000000', fontSize: 16, textAlign: 'center' },
  otpBox: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  otpInput: {
    width: 54, height: 54, borderWidth: 1, borderColor: '#D0D0D0', textAlign: 'center',
    fontSize: 18, borderRadius: 4, backgroundColor: '#ffffff'
  },
  timerText: { marginTop: 20, textAlign: 'center', fontSize: 14 },
  resendButton: { alignSelf: 'center', marginTop: 10, padding: 10 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  titleText: { color: '#585858', fontSize: 16, textAlign: 'center', fontWeight: '700' },
  editButton: { color: '#FF8D53', fontSize: 16, marginLeft: 6 },
});
