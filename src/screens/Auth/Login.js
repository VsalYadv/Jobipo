import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback,ActivityIndicator, StatusBar
} from 'react-native';
import Logo from '../../components/Auth/Logo'; 

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (username !== '') {
      setLoading(true); 
      const formdata = { username };

      try {
        const res = await fetch('https://jobipo.com/api/v2/send-login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formdata),
        });
        const resData = await res.json();
        console.log('hhhhh',resData)
        if (resData.status === 1) {
          navigation.navigate('OtpScreen', { username });
        } else {
          Alert.alert(resData.message);
        }
      } catch (err) {
        Alert.alert('Error', 'Network error');
      } finally {
        setLoading(false); 
      }
    } else {
      Alert.alert('Please enter mobile number');
    }
  };


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0d4574" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#F5F4FD" 
        translucent={false}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ backgroundColor: '#F5F4FD' }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 36,
          }}
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Logo />
            </View>

            <View style={styles.heading}>
              <Text style={styles.h1}>Let’s get started</Text>
              <Text style={styles.h2}>Welcome Back!</Text>
              <Text style={styles.h2}>You’ve been missed</Text>
            </View>

            <View style={styles.credContainer}>
              <TextInput
                value={username}
                style={styles.textInput}
                placeholder="Mobile Number"
                placeholderTextColor="#D0D0D0" 
                keyboardType="numeric"
                maxLength={10}
                onChangeText={text => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  setUsername(cleaned);
                }}
              />

             {/* <View style={styles.button}>
                {loading ? (
                  <ActivityIndicator size="large" color="#0d4574" />
                ) : (
                  <TouchableOpacity style={styles.cbutton} onPress={sendOtp}>
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                )}
              </View> */}
               <View style={styles.button}>
                <TouchableOpacity style={styles.cbutton} onPress={sendOtp}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.lastInfo}>
              <Text style={styles.lastInfoText}>Don’t have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.lastInfoText, { marginLeft: 10, fontWeight: 'bold' }]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F5F4FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginTop: 20,
  },
  heading: {
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    fontSize: 35,
    fontWeight: 'bold',
    lineHeight: 56,
    color: '#000000',
  },
  h2: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
    color: '#585858',
  },
  credContainer: {
    marginTop: 40,
    width: '100%',
  },
  textInput: {
    marginVertical: 7.5,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    color: '#333',
    // borderRadius: 10,
    // borderColor: '#ccc',
    // borderWidth: 0.7,
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
  },
  cbutton: {
    backgroundColor: '#FF8D53',
    paddingVertical: 10,
    // paddingHorizontal: 10,
    borderRadius: 25,
    width: '70%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  lastInfo: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 26,
  },
  lastInfoText: {
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
