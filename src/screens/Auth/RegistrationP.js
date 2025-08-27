import React, { useState, useEffect, useCallback } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, FlatList, Pressable, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GooglePlacesInput from '../../components/GooglePlacesInput';
import { useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { StepIndicator2 } from './StepIndicator';

const RegistrationP = ({ navigation, route }) => {
  // const jobSeekerData = route.params || {};
  const scrollViewRef = React.useRef(null);
  const jobTitleInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    userId: '',
    current_location:  '',
    cllat:  '',
    cllng: '',
    city: '',
    state: '',
    pincode: '',
    dob: '',
    gender:  '',
    education_level:  '',
    jobTitle:  '',
    preferred_job_industry:  '',
  });

  const isDarkMode = useColorScheme() === 'dark';

  
  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUserId = async () => {
  //       try {
  //         const storedUserId = await AsyncStorage.getItem('UserID');
  //         if (storedUserId) {
  //           console.log('Stored UserID:', storedUserId);
  //           setFormData((prevFormData) => ({
  //             ...prevFormData,
  //             userId: storedUserId,
  //           }));
  //         } else {
  //           console.log('UserID not found in storage.');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching UserID from AsyncStorage:', error);
  //       }
  //     };

  //     fetchUserId();
  //   }, [])
  // );

  useFocusEffect(
  useCallback(() => {
    setFormData({
      userId: '',
      current_location: '',
      cllat: '',
      cllng: '',
      city: '',
      state: '',
      pincode: '',
      dob: '',
      gender: '',
      education_level: '',
      jobTitle: '',
      preferred_job_industry: '',
    });

    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');
        if (storedUserId) {
          setFormData(prev => ({ ...prev, userId: storedUserId }));
        }
      } catch (error) {
        console.error('Error fetching UserID from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, [])
);


const [jobSuggestions, setJobSuggestions] = useState([]);
const [jobTitles, setJobTitles] = useState([]);
const [filteredJobTitles, setFilteredJobTitles] = useState([]);

useFocusEffect(
    useCallback(() => {
      const fetchJobTitles = async () => {
        try {
          const response = await fetch('https://jobipo.com/api/v3/fetch-job-titles', {
            method: 'GET',
            headers: {
              Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            },
          });

          const result = await response.json();
          console.log('job result', result);

                     if (result?.status === 1 && result?.msg) {
             try {
               const parsed = JSON.parse(result.msg);
               console.log('Parsed jobTitles:', parsed);

               if (Array.isArray(parsed)) {
                 setJobTitles(parsed);
               } else {
                 console.warn('Parsed jobTitles is not an array, setting empty array');
                 setJobTitles([]);
               }
             } catch (parseError) {
               console.error('Error parsing jobTitles:', parseError);
               setJobTitles([]);
             }
           } else {
             console.warn('Invalid API response, setting empty jobTitles array');
             setJobTitles([]);
           }
        } catch (error) {
          console.error('Error fetching job titles:', error);
        }
      };

      fetchJobTitles();
    }, [])
  );

  const handleJobTitleChange = (text) => {
  console.log('Typed text:', text);
  console.log('Current jobTitles:', jobTitles); // 🔍 Check array content
  setFormData({ ...formData, jobTitle: text });

  if (text.length >= 1 && Array.isArray(jobTitles)) {
    const filtered = jobTitles.filter((item) => {
      console.log('Item:', item); // 🧪 check each object
      if (!item || !item.jobTitle) {
        console.warn('No jobTitle field in:', item);
        return false;
      }

      return item.jobTitle.toLowerCase().includes(text.toLowerCase());
    });

    console.log('Filtered:', filtered);
    setFilteredJobTitles(filtered);
  } else {
    setFilteredJobTitles([]);
  }
};


  const handleSuggestionPress = (selectedTitle) => {
    if (selectedTitle) {
      setFormData({ ...formData, jobTitle: selectedTitle });
      setFilteredJobTitles([]);
    }
  };



  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.current_location || !formData.city || !formData.state) {
      Alert.alert('Error', 'Please select a valid location.');
      return;
    }

    try {
      const storedUserId = await AsyncStorage.getItem('UserID');
      const form = new FormData();
      form.append('userId', formData.userId || storedUserId);
      form.append('current_location', formData.current_location);
      form.append('lat', formData.cllat);
      form.append('lng', formData.cllng);
      form.append('city', formData.city);
      form.append('state', formData.state);
      form.append('pincode', formData.pincode);
      form.append('dob', formData.dob);
      form.append('gender', formData.gender);
      form.append('education_level', formData.education_level);
      form.append('jobTitle', formData.jobTitle);
      form.append('preferred_job_industry', formData.preferred_job_industry);

      console.log('FormData payload:', form);

      const response = await fetch('https://jobipo.com/api/v2/update-step-two', {
        method: 'POST',
        body: form,
      });

      const rawText = await response.text();
      console.log('Raw API response:', rawText);

      let res;
      try {
        const jsonStart = rawText.indexOf('{');
        const jsonEnd = rawText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
          res = JSON.parse(jsonString);
        } else {
          throw new Error('No valid JSON found');
        }
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        Alert.alert('Error', 'Invalid server response. Please contact support.');
        return;
      }

      console.log('API response:', res);

      if (res && res.type === 'success') {
        // Alert.alert('Success', 'Details saved successfully');
        const storedUserId = await AsyncStorage.getItem('UserID');
        console.log("Navigating to RegistrationS with userId:", storedUserId);
        navigation.navigate('RegistrationS', { userId: storedUserId });
      } else {
        const message = typeof res.message === 'string' ? res.message : 'Something went wrong';
        Alert.alert('Error', message);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      Alert.alert('Error', 'Failed to update details. Check your internet connection.');
    }
  };

  // console.log('formData:', formData);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F5F4FD' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <StepIndicator2/>
        
        {/* Scrollable Form Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <View style={[styles.card, { zIndex: 1000 }]}>
            <View style={[styles.ContainerDetails, { zIndex: 1000 }]} >
              <Text style={styles.label}>Current Location</Text>
              <View style={styles.locationContainer}>
                <GooglePlacesInput
                  setValue={(val) => {
                   console.log("Selected place value:", val)
                    setFormData({
                  ...formData,
                  current_location: val.Locality,
                  cllat: val.lat,
                  cllng: val.lng,
                  city: val.city,
                  state: val.state,
                  pincode: val.pincode,
        });
      }}
    />
                </View>

              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderGroup}>
                {[
                  { label: 'Male', value: '1' },
                  { label: 'Female', value: '2' },
                  { label: 'Other', value: '3' },
                ].map((option) => {
                  const isActive = formData.gender === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={styles.genderOption}
                      onPress={() => setFormData({ ...formData, gender: option.value })}
                    >
                      <View style={[styles.outerCircle, isActive && styles.outerCircleActive]}>
                        {isActive && <View style={styles.innerDot} />}
                      </View>
                      <Text style={[styles.genderLabel, isActive && styles.genderLabelActive]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View>
                <Text style={styles.label}>Date Of Birth</Text>
                <TextInput
                  placeholder="dd/mm/yyyy"
                  value={formData.dob}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^\d]/g, '');
                    let formatted = '';
                    if (cleaned.length <= 2) {
                      formatted = cleaned;
                    } else if (cleaned.length <= 4) {
                      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                    } else {
                      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                    }
                    setFormData({ ...formData, dob: formatted });
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>Education Level</Text>
              <View style={styles.radioGroup}>
                {['10th_below', '10th', '12th', 'graduate', 'postgraduate', 'iti', 'diploma'].map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.radioBtn,
                      formData.education_level === option && styles.radioBtnActive,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, education_level: option })
                    }
                  >
                    <Text
                      style={[
                        styles.radioBtnText,
                        formData.education_level === option && styles.radioBtnTextActive,
                      ]}
                    >
                      {option === '10th_below'
                        ? '10th Below'
                        : option === '10th'
                        ? '10th'
                        : option === '12th'
                        ? '12th'
                        : option === 'graduate'
                        ? 'Graduate'
                        : option === 'postgraduate'
                        ? 'Post Graduate'
                        : option === 'iti'
                        ? 'ITI'
                        : 'Diploma'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Job Title</Text>
              <View style={styles.jobTitleContainer}>
                <TextInput
                  ref={jobTitleInputRef}
                  style={styles.input}
                  placeholder="Enter Job Title"
                  value={formData.jobTitle}
                  onChangeText={handleJobTitleChange}
                  placeholderTextColor="#555"
                  onFocus={() => {
                    setTimeout(() => {
                      if (scrollViewRef.current && jobTitleInputRef.current) {
                        jobTitleInputRef.current.measureLayout(
                          scrollViewRef.current,
                          (x, y) => {
                            scrollViewRef.current.scrollTo({
                              y: y - 100,
                              animated: true,
                            });
                          },
                          () => {}
                        );
                      }
                    }, 100);
                  }}
                />

                {Array.isArray(filteredJobTitles) && filteredJobTitles.length > 0 && (
                  <View style={styles.suggestionBox}>
                    <FlatList
                      data={filteredJobTitles}
                      keyExtractor={(item) => item?.jobTitleId || item?.jobTitle || Math.random().toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.suggestionItem}
                          onPress={() => handleSuggestionPress(item?.jobTitle || '')}
                        >
                          <Text style={styles.suggestionText}>{item?.jobTitle || ''}</Text>
                        </TouchableOpacity>
                      )}
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                )}
              </View>

              <View>
                <Text style={styles.label}>Preferred Job Industry</Text>
                <View style={styles.dropdownBox}>
                  <Picker
                    selectedValue={formData.preferred_job_industry}
                    onValueChange={(itemValue) =>
                      setFormData({ ...formData, preferred_job_industry: itemValue })
                    }
                  >
                       <Picker.Item label="--Select Preferred Job Industry--" value="" />
                          <Picker.Item label="IT & Software" value="IT & Software" />
                          <Picker.Item label="Education & Training" value="Education & Training" />
                          <Picker.Item label="Transportation" value="Transportation" />
                          <Picker.Item label="Facility Management" value="Facility Management" />
                          <Picker.Item label="Real Estate & Property" value="Real Estate & Property" />
                          <Picker.Item label="Insurance & Stock Market" value="Insurance & Stock Market" />
                          <Picker.Item label="E-Commerce Management" value="E-Commerce Management" />
                          <Picker.Item label="Hospitality & Tourism" value="Hospitality & Tourism" />
                          <Picker.Item label="Healthcare & Support" value="Healthcare & Support" />
                          <Picker.Item label="BPO & KPO" value="BPO & KPO" />
                          <Picker.Item label="Banking, Financial Services & Insurance" value="Banking, Financial Services & Insurance" />
                          <Picker.Item label="E-commerce & Retail" value="E-commerce & Retail" />
                          <Picker.Item label="Healthcare & Pharmaceuticals" value="Healthcare & Pharmaceuticals" />
                          <Picker.Item label="Engineering & Manufacturing" value="Engineering & Manufacturing" />
                          <Picker.Item label="Sales & Marketing" value="Sales & Marketing" />
                          <Picker.Item label="Telecom" value="Telecom" />
                          <Picker.Item label="Automobile" value="Automobile" />
                          <Picker.Item label="Hospitality & Travel" value="Hospitality & Travel" />
                          <Picker.Item label="Logistics & Supply Chain" value="Logistics & Supply Chain" />
                          <Picker.Item label="Construction & Real Estate" value="Construction & Real Estate" />
                          <Picker.Item label="Legal & Compliance" value="Legal & Compliance" />
                          <Picker.Item label="Media, Advertising & Entertainment" value="Media, Advertising & Entertainment" />
                          <Picker.Item label="Agriculture & Rural Development" value="Agriculture & Rural Development" />
                          <Picker.Item label="Human Resources & Recruitment" value="Human Resources & Recruitment" />
                          <Picker.Item label="Design & Creative" value="Design & Creative" />
                          <Picker.Item label="Others" value="Others" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
            <View style={styles.continueContent}>
              <Text style={styles.continueText}>Next</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.lastInfo}>
            <Text style={styles.lastInfoText}>You have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.lastInfoText, { marginLeft: 10, fontWeight: 'bold' ,backgroundColor:'#ffffff',paddingHorizontal:8,borderRadius:10,}]}>Log In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FD',
    paddingTop: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSection: {
    backgroundColor: '#F5F4FD',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  head: {
    fontSize: 15,
    marginBottom: 2,
    color: '#000',
  },
  subhead: {
    fontSize: 13,
    marginBottom: 5,
  },
  input: {
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#333',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 14,
  },
  preferredLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  preferredInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  preferredAddButton: {
    backgroundColor: '#00802b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8D53',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    marginRight: 5,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#00802b',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  ContainerDetails: {
    borderRadius: 10,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  headcontainer: {
    marginVertical:30,
  },
  heading: {
    fontSize:22,
    fontWeight:'900',
    color: '#FF8D53',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF8D53',
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#0071a9',
  },
  tabLeft: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
  },
  lastInfo: {
    flexDirection: 'row',
    marginTop: 15,
    alignSelf:'center',
    alignItems: 'center',
  },
  lastInfoText: {
    fontSize: 15,
    color: '#666',
  },
  tabRightActive: {
    flex: 1,
    backgroundColor: '#004e92',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    color: '#004e92',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#cceeff',
    backgroundColor: '#e6f7ff',
    marginBottom: 8,
    height: 50, 
    marginTop:8,
  },
  dropdownBox: {
    marginTop: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF8D53',
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom:20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: '#FF8D53',
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
    color: '#0d4574',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueBtn: {
    backgroundColor: '#FF8D53',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    width: '70%',
    shadowColor: '#FF8D53',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  iconStyle: {
    marginLeft: 8,
    marginTop: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 6,
    marginTop: 8,
  },
  radioBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  radioBtnActive: {
    backgroundColor: '#FF8D53',
    borderColor: '#FF8D53',
    shadowColor: '#FF8D53',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  radioBtnText: {
    color: '#333',
    fontWeight: '500',
    textTransform: 'capitalize',
    fontSize: 13,
  },
  radioBtnTextActive: {
    color: '#fff',
  },
  genderGroup: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 15,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#585858',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  outerCircleActive: {
    borderColor: '#FF8D53',
    backgroundColor: '#FF8D53',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  genderLabel: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  genderLabelActive: {
    color: '#FF8D53',
    fontWeight: '500',
  },
  suggestionBox: {
    backgroundColor: '#ffffff',
    marginTop: 6,
    borderColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  jobTitleContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  locationContainer: {
    zIndex: 1000,
    position: 'relative',
    marginBottom: 5,
  },
});

export default RegistrationP;
