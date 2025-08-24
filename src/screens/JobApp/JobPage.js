import React, { useState,useRef , useEffect, useCallback, StatusBar,useContext } from 'react';
import { View, Text, TextInput,ScrollView, FlatList, StyleSheet, TouchableOpacity,Pressable, Alert,Image, Modal, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobHeader from '../../components/Job/JobHeader';
import JobMenu from '../../components/Job/JobMenu';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/context';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import TopHeaderJob from '../../components/TopHeaderJob';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { HeartIcon,HeartFilledOrangeIcon } from '../JobSvgIcons';
import { TouchableWithoutFeedback, Keyboard } from 'react-native'; 


export const JobBox = ({ item,jobId, title, company, location, Benefits, jobShift, jobType, JobDescription, saved, onToggleSave, requirements, isActive, onPress }) => {
const [userId, setUserId] = useState(null);
const [favoriteJobs, setFavoriteJobs] = useState([]); 
const token = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; 
//console.log('itemjobpage',item)


// useFocusEffect(
//   useCallback(() => {
//     const fetchFavorites = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem('UserID');
//         if (!storedUserId) return;

//         setUserId(storedUserId);

//         const response = await fetch(
//           `https://jobipo.com/api/v3/fetch-favorite?userID=${storedUserId}`,
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
//             },
//           }
//         );

//         const data = await response.json();
//         // console.log('fav data', data);

//         if ( data.status === 1 ) {
//             const parsedJobs = JSON.parse(data.jobs); 
//             const favJobIds = parsedJobs.map(job => job.jobId);
//           setFavoriteJobs(favJobIds);
//         } else {
//           console.warn('Failed to fetch favorites', data.message || data);
//         }
//       } catch (err) {
//         console.error('Error fetching favorite jobs:', err);
//       }
//     };

//     fetchFavorites();
//   }, [])
// );



useFocusEffect(
  useCallback(() => {
    const fetchFavorites = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserID');
        if (!storedUserId) return;

        setUserId(storedUserId);

        const response = await fetch(
          `https://jobipo.com/api/v3/fetch-favorite?userID=${storedUserId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
            },
          }
        );

        const data = await response.json();
        //console.log('Favorite jobs response:', data);

        if (data.status === 1) {
          let parsedJobs;

          if (typeof data.jobs === 'string') {
            try {
              parsedJobs = JSON.parse(data.jobs);
            } catch (parseError) {
              console.error('JSON parsing failed:', parseError, 'Raw jobs:', data.jobs);
                    setFavoriteJobs([]);
              return;
            }
          } else if (Array.isArray(data.jobs)) {
            parsedJobs = data.jobs;
          } else {
                setFavoriteJobs([]); 

            // console.warn('Unexpected jobs format:', data.jobs);
            return;
          }

          const favJobIds = parsedJobs.map(job => job.jobId);
          setFavoriteJobs(favJobIds);
        } else {
          console.warn('Failed to fetch favorites:', data.message || data);
           setFavoriteJobs([]);
        }
      } catch (err) {
        console.error('Error fetching favorite jobs:', err);
      }
    };

    fetchFavorites();
  }, [])
);


const isFavorite = favoriteJobs.includes(item.jobId);

const handleToggleFavorite = async (jobId) => {
  try {
    const storedUserId = await AsyncStorage.getItem('UserID');
    if (!storedUserId) {
      console.warn('User ID not found in AsyncStorage');
      return;
    }

    const isJobFavorite = favoriteJobs.includes(jobId);
    const endpoint = isJobFavorite
      ? 'https://jobipo.com/api/v3/remove-favorite'
      : 'https://jobipo.com/api/v3/add-favorite';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      },
      body: JSON.stringify({
        user_id: storedUserId,
        job_id: jobId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`Favorite ${isJobFavorite ? 'removed' : 'added'}:`, data);

      // Update local state
      setFavoriteJobs(prev =>
        isJobFavorite ? prev.filter(id => id !== jobId) : [...prev, jobId]
      );
    } else {
      console.warn('Action failed:', data.message || data);
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
  }
};


// const handleToggleFavorite = async (jobId) => {
//   try {
//     const storedUserId = await AsyncStorage.getItem('UserID');
//     if (!storedUserId) {
//       console.warn('User ID not found in AsyncStorage');
//       return;
//     }
//           console.log("storedUserId", storedUserId);
//           console.log("jobId", jobId);
//  const formData = new FormData();
//     formData.append('user_id', storedUserId);
//     formData.append('job_id', jobId);

//     const response = await fetch('https://jobipo.com/api/v3/add-favorite', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
//       },
//          body: JSON.stringify({
//         user_id: storedUserId,
//         job_id: jobId,
//       }), 
//     });

//     const data = await response.json();

//     if (response.ok) {
//       console.log('Favorite added successfully:', data);
//     } else {
//       console.warn(' Failed to add favorite:', data.message || data);
//     }
//   } catch (error) {
//     console.error('Error adding to favorite:', error);
//   }
// };

  const salary = item.salaryType == 'Incentive-Based' ? item.AdditionalPayout :  `₹${item.salaryFrom} - ₹${item.salaryTo} per month`;

  return (
    <>
    <>
  <View style={[styles.jobBox, isActive && styles.activeJobBox]}>
    {/* Whole card clickable except heart */}
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View>
        <View style={styles.topLeftArrow}>
          <Image
            source={require('../../../assets/Image/icons/next.png')}
            style={styles.jobImg}
          />
        </View>

        <View style={styles.row}>
         <Image
  source={
    item.logo
      ? { uri: `https://jobipo.com/uploads/${item.logo}` } // ✅ when logo exists, load from URL
      : require('../../../assets/Image/icons/rectangle.png') // ✅ fallback image
  }
  style={styles.jobImg}
/>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/company.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobCompany}>{item.businessName || 'NA'}</Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/location.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobLocation}>
            {item.companyAddress ? item.companyAddress : 'Location not updated'}
          </Text>
        </View>

        <View style={styles.rowS}>
          <Image
            source={require('../../../assets/Image/icons/salary.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobLocation}>{salary}</Text>
        </View>
      </View>
    </TouchableOpacity>

    {/* Heart icon outside main touchable area */}
    <View style={styles.salaryContainer}>
      <View style={styles.salaryDetails}>
        <Text style={styles.salary}>{item.jobType}</Text>
        <Text style={styles.salary}>{item.genderPreferance}</Text>
        <Text style={styles.salary}>Exp. {item.experienceLevel}</Text>
      </View>

      <TouchableOpacity onPress={() => handleToggleFavorite(item.jobId)}>
        {isFavorite ? <HeartFilledOrangeIcon /> : <HeartIcon />}
      </TouchableOpacity>
    </View>
  </View>
</>

    </>
  )
};

const JobPage = ({ navigation, route }) => {
  const { signOut } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');
  // const [jobs, setJobs] = useState();
const [jobs, setJobs] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [isLoading, setisLoading] = useState(false);  
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);

const isFirstLoad = useRef(true);
console.log("jobbb",jobs )

// useFocusEffect(
//   useCallback(() => {
//     if (route.params?.filteredJobs && route.params.filteredJobs.length > 0) {
//       console.log('Filtered jobs received:', route.params.filteredJobs);
//       setJobs(route.params.filteredJobs);
//     } else if (isFirstLoad.current) {
//       isFirstLoad.current = false;
//       GetDataFunc(true); 
//     }
//   }, [route.params])
// );

// useFocusEffect(
//   useCallback(() => {
//     return () => {
//       setShowSuggestion(false);
//       setSearchQuery('');  
//     };
//   }, [])
// );

useEffect(() => {
  if (searchQuery.trim() === '') {
    setShowSuggestion(false);
    setSuggestion([]);
  }
}, [searchQuery]);

const [page, setPage] = useState(1);

const GetDataFunc = async (reset = false) => {
  if (isFetchingMore) return;

  setIsFetchingMore(true);

  try {
    const storedUserId = await AsyncStorage.getItem('UserID');
    if (!storedUserId) {
      console.warn(' No UserID found in AsyncStorage');
    }

    console.log(' Fetching jobs for:', searchQuery, 'UserID:', storedUserId);

    const res = await fetch('https://jobipo.com/api/v3/view-job-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          page: 3, // You can change the page dynamically
        }),
      }).then(res => res.json());

    console.log(' Raw job response:', res);

    if (res?.status === 1) {
      const newJobs = JSON.parse(res.msg);
      console.log(' New Jobs:', newJobs.length);

      setJobs(prev => reset ? newJobs : [...prev, ...newJobs]);
      setPage(prev => reset ? 2 : prev + 1);
      setHasMoreJobs(newJobs.length === 5);
    } else {
      console.warn(' No jobs found for:', searchQuery);
      if (reset) setJobs([]);
      setHasMoreJobs(false);
    }
  } catch (err) {
    console.log(' Error fetching jobs:', err);
  } finally {
    setIsFetchingMore(false);
    setisLoading(false);
  }
};



// useEffect(() => {
//   console.log("isFetchingMore:", isFetchingMore);
// }, [isFetchingMore]);


useFocusEffect(
  useCallback(() => {
    if (route.params?.filteredJobs && route.params.filteredJobs.length > 0) {
      console.log('Filtered jobs received:', route.params.filteredJobs);
      setJobs(route.params.filteredJobs);
    } else {
      GetDataFunc(true);
    }
  }, [route.params, searchQuery])
);

useEffect(() => {
  console.log("FlatList data:", jobs.length, jobs[0]);
}, [jobs]);


// useFocusEffect(
//   useCallback(() => {
//     GetDataFunc(true);
//   }, [searchQuery])
// );

  const handleSearch = (text) => {
    setSearchQuery(text);

    // const filtered = jobs.filter((job) =>
    //   job.jobTitle.toLowerCase().includes(text.toLowerCase()) ||
    //   job.companyName.toLowerCase().includes(text.toLowerCase()) ||
    //   job.city.toLowerCase().includes(text.toLowerCase()) ||
    //   job.state.toLowerCase().includes(text.toLowerCase())
    // );
    // setJobs(filtered);
  };

  // const toggleSave = (id) => {
  //   const updatedJobs = jobs.map((job) => {
  //     if (job.id === id) {
  //       const newSavedState = !job.saved;
  //       if (newSavedState) {
  //         Alert.alert("Job Saved", `${job.title} has been saved.`);
  //       }
  //       return { ...job, saved: newSavedState };
  //     }
  //     return job;
  //   });
  //   setJobs(updatedJobs);
  // };

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const savedJobs = await AsyncStorage.getItem('savedJobs');
        if (savedJobs) {
          const parsedJobs = JSON.parse(savedJobs);
          // Merge saved state into jobsData
          const updatedJobs = jobsData.map(job => {
            const savedJob = parsedJobs.find(saved => saved.id === job.id);
            return savedJob ? { ...job, saved: savedJob.saved } : job;
          });
          setJobs(updatedJobs);
        }
      } catch (error) {
        console.error('Failed to load saved jobs', error);
      }
    };
    fetchSavedJobs();
  }, []);

  const storeSavedJobs = async (updatedJobs) => {
    try {
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    } catch (error) {
      console.error('Failed to save jobs to AsyncStorage', error);
    }
  };

  const toggleSave = (id) => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === id) {
        const newSavedState = !job.saved;
        if (newSavedState) {
          Alert.alert("Job Saved", `${job.title} has been saved.`);
        } else {
          Alert.alert("Job Removed", `${job.title} has been removed from favorites.`);
        }
        return { ...job, saved: newSavedState };
      }
      return job;
    });
    setJobs(updatedJobs);
    storeSavedJobs(updatedJobs);
  };


  const navigateToDescription = (job) => {
    navigation.navigate('JobDes', { job });
  };

  
    const [showFilter, setShowFilter] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [experienceOpen, setExperienceOpen] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  
    const [formData, setFormData] = useState({
    location: null,
    title: null,
    experience: null,
    age: [18, 52],
    salary: [0, 50000],
    gender: 'Male',
    jobPosted: 'All',
  });

  
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
  
   useFocusEffect(
      useCallback(() => {
        const fetchStates = async () => {
          // setLoadingStates(true);
          try {
            const res = await fetch('https://jobipo.com/api/v3/fetch-states', {
              headers: {
                Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
              },
            });
            const data = await res.json();
            const parsedStates = JSON.parse(data.msg); 
            // console.log('state parsedStates',parsedStates)
             setStates(parsedStates);
            } catch (error) {
            console.error('Failed to fetch states', error);
          } finally {
            // setLoadingStates(false);
          }
        };
  
        fetchStates();
      }, [])
    );
  
    // Fetch cities when selectedState changes
    useFocusEffect(
      useCallback(() => {
        const fetchCities = async () => {
          if (!selectedState) {
            setCities([]);
            setSelectedCity('');
            return;
          }
  
          // setLoadingCities(true);
          try {
            const res = await fetch(`https://jobipo.com/api/v3/fetch-cities?stateId=${selectedState}`, {
              headers: {
                Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
              },
            });
            const data = await res.json();
            // console.log('ciity data',data)
            const parsedCities = JSON.parse(data.msg); 
            console.log('state parsedStates',parsedCities)
            setCities(parsedCities);
          } catch (error) {
            console.error('Failed to fetch cities', error);
          } finally {
            // setLoadingCities(false);
          }
        };
  
        fetchCities();
      }, [selectedState])
    );
  
  
  const [jobTitles, setJobTitles] = useState([]);
  
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
          // console.log('result',result)
          if (result?.status === 1 && result?.msg) {
            const parsed = JSON.parse(result.msg);
            setJobTitles(parsed);
          }
        } catch (error) {
          console.error('Error fetching job titles:', error);
        }
      };
  
      fetchJobTitles();
    }, [])
  );
  
  const handleFilter = async () => {
      // setIsLoading(true);
    const payload = {
      location: formData.location,
      jobPosted: formData.jobPosted,
      title: formData.title,
      state: formData.state,
      city: formData.city,
      ageMin: formData.age[0],
      ageMax: formData.age[1],
      salaryMin: formData.salary[0],
      salaryMax: formData.salary[1],
      gender: formData.gender,
      experience: formData.experience,
    };
      console.log('payload Jobs:', payload);
  
      try {
      // const token = await AsyncStorage.getItem('Token');
      // console.log('token :', token);
     
      const res = await fetch('https://jobipo.com/api/v3/view-job-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const result = await res.json();
      console.log('Filtered Jobs:', result);
  
     if (result.status == 1) {
    const jobs = JSON.parse(result.msg); 
    setJobs(jobs);
  
    navigation.navigate('JobPage', {
      filteredJobs: jobs
    });
  } else {
    setJobs([]);
  
    navigation.navigate('JobPage', {
      filteredJobs: []
    });
  }
    } catch (error) {
      console.error('Filter API error:', error);
      setJobs([]);
    } finally {
      // setIsLoading(false);
    }
  };
  const HEADER_HEIGHT = 120;

  const fetchJobTitleSuggestions = async (text) => {
  if (text.trim() === '') return [];

  try {
    const res = await fetch('https://jobipo.com/api/Agent/jobtitlelist', {
      method: 'POST',
    });
    const json = await res.json();
    const jobTitleList = JSON.parse(json.msg || '[]');

    return jobTitleList.filter((item) =>
      item.jobTitle?.toLowerCase().includes(text.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

  return (
    <>
      <TouchableWithoutFeedback
    onPress={() => {
      Keyboard.dismiss();
      setShowSuggestion(false);
    }}
  >

        <View style={{ flex: 1 }}>       
      <TopHeaderJob/>    
      <View style={styles.container}>
        <View style={[styles.row, { marginTop: 4 }]}>
          <View style={styles.inputWithIcon}>
                        <TextInput
                       style={styles.input}
                       placeholder="Job Title, Keywords"
                       placeholderTextColor="#D0D0D0"
                       value={searchQuery}
                       onChangeText={async (text) => {
                         setSearchQuery(text);
                     
                         if (text.trim() === '') {
                           setShowSuggestion(false);
                           setSuggestion([]);
                           return;
                         }
                     
                         const filteredSuggestions = await fetchJobTitleSuggestions(text);
                     
                         if (text.trim() === '') return;
                     
                         setSuggestion(filteredSuggestions);
                         setShowSuggestion(filteredSuggestions.length > 0);
                       }}
                     />

<Image
  source={require('../../../assets/Image/icons/search.png')} 
  style={styles.jobImg1}
/>

{showSuggestion && (
  <FlatList
    style={{
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      maxHeight: 300,
      zIndex: 1,
    }}
    ItemSeparatorComponent={() => (
      <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }} />
    )}
    data={suggestion}
    renderItem={({ item }) => (
      <Pressable
        style={{ padding: 10, zIndex: 10 }}
        onPress={async () => {
          setSearchQuery(item?.jobTitle);
          setShowSuggestion(false);
          await GetDataFunc(true); // ✅ Ensures new search executes
        }}
      >
        <Text>{item?.jobTitle}</Text>
      </Pressable>
    )}
    keyExtractor={(item, index) => index.toString()}
/>
)}

                   </View>


          <TouchableOpacity style={styles.searchButton} onPress={() => setShowFilter(!showFilter)}>
          {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}> */}
            {/* <Text style={styles.buttonText}>Search</Text> */}
              <Image
                source={require('../../../assets/Image/icons/filter.png')} 
                style={styles.jobImg1}
              />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity> */}
        </View>        

        <Modal visible={isLoading} transparent={true} animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
            <ActivityIndicator size="large" color="#34348fff" />
          </View>
        </Modal>


  {showFilter && (
          <View style={[styles.filterContainerFull, { height: screenHeight - 260 }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 ,}} showsVerticalScrollIndicator={false} >
                <Text style={styles.sectionTitleJob}>Job Posted</Text>
                <View style={styles.rowWrap}>
                {[
                  'All',
                  'Last 24 Hours',
                  'Last 03 Days',
                  'Last 07 Days',
                  'Last 15 Days',
                  'Last 01 Month',
                ].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setFormData(prev => ({ ...prev, jobPosted: option }))}
                  >
                    <View style={[styles.radioCircle, formData.jobPosted === option && styles.radioSelected]}>
                      {formData.jobPosted === option && <View style={styles.innerDot} />}
                    </View>
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
                </View>
              {/* <Text style={styles.sectionTitle}>Location</Text>
             <View style={styles.pickerWrapper}>
  <Picker
    selectedValue={formData.location}
    onValueChange={(itemValue) => setFormData(prev => ({ ...prev, location: itemValue }))}
    style={styles.picker}
    dropdownIconColor="#000"
  >
    <Picker.Item label="Select Location" value="" />
    <Picker.Item label="Indore" value="indore" />
    <Picker.Item label="Bhopal" value="bhopal" />
    <Picker.Item label="Mumbai" value="mumbai" />
  </Picker>
</View> */}

<View>
     <Text style={styles.sectionTitle}>Select State</Text>
              {loadingStates ? (
              <ActivityIndicator />
              ) : (
            <View style={styles.pickerWrapper}>
              <Picker
              selectedValue={selectedState}
              onValueChange={(value) => setSelectedState(value)}
              style={styles.picker}
>
              <Picker.Item label="Choose a State" value="" />
              {states.map((state) => (
              <Picker.Item
              key={state.stateId}
              label={state.state}
              value={state.stateId}
              />
              ))}
              </Picker>
              </View>
              )}
              {selectedState !== '' && (
              <>
              <Text style={styles.sectionTitle}>Select City</Text>
              {loadingCities ? (
              <ActivityIndicator />
              ) : (
              <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(value) => setSelectedCity(value)}
                style={styles.picker}
              >
                <Picker.Item label="Choose a City" value="" />
                {cities.map((city) => (
                  <Picker.Item
                    key={city.cityId}
                    label={city.city}
                    value={city.cityId}
                  />
                ))}
              </Picker>
              </View>
              )}
              </>
              )}
</View>



          <Text style={styles.sectionTitle}>Job Category</Text>
<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={formData.title}
    onValueChange={(itemValue) =>
      setFormData(prev => ({ ...prev, title: itemValue }))
    }
    style={styles.picker}
  >
    <Picker.Item label="Select Category" value="" />
    {jobTitles.map((item) => (
      <Picker.Item key={item.jobTitleId} label={item.jobTitle} value={item.jobTitleId} />
    ))}
  </Picker>
</View>


<View style={{ width: '100%', }}>
<View style={{   marginLeft:26,
 }}>  
<Text style={styles.sectionTitle}>Age </Text>
<Text style={styles.sliderLabel}>
  {formData.age[0]} years - {formData.age[1]} years
</Text>
</View>

<View style={{ width: '100%', alignItems: 'center', }}>
<MultiSlider
values={[formData.age[0], formData.age[1]]}
  onValuesChange={(values) => setFormData(prev => ({ ...prev, age: values }))}
  min={18}
  max={60}
  step={1}
  selectedStyle={{ backgroundColor: '#FF8D53' }}
  markerStyle={{
    backgroundColor: '#FF8D53',
    height: 14,
    width: 14,
  }}
 
/>
</View>
</View>

<View style={{ width: '100%',}}>
  <View style={{   marginLeft:26,
 }}>  
<Text style={styles.sectionTitle}>Salary (₹)</Text>
<Text style={styles.sliderLabel}>
  ₹{formData.salary[0]} - ₹{formData.salary[1]}
</Text>
</View>
<View style={{ width: '100%', alignItems: 'center'}}>
<MultiSlider
  values={[formData.salary[0],formData.salary[1]]}
  onValuesChange={(values) => setFormData(prev => ({ ...prev, salary: values }))}
  min={0}
  max={50000}
  step={500}
  selectedStyle={{ backgroundColor: '#FF8D53' }}
  markerStyle={{
    backgroundColor: '#FF8D53',
    height: 14,
    width: 14,
  }}
  // containerStyle={{ marginTop: 8,width: '100%'}}
  
/>
</View>
</View>

            <Text style={styles.sectionTitle}>Gender</Text>
              <View style={styles.rowWrapp}>
                {['Male', 'Female', 'Both'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOptionG}
                    onPress={() => setFormData(prev => ({ ...prev, gender: option }))}               >
                    <View style={[styles.radioCircle, formData.gender === option && styles.radioSelected]}>
        {formData.gender === option && <View style={styles.innerDot} />}
      </View>
      <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

<Text style={styles.sectionTitle}>Experience</Text>
<View style={styles.pickerWrapper}>
  <Picker
    selectedValue={formData.experience}
   onValueChange={(itemValue) => setFormData(prev => ({ ...prev, experience: itemValue }))}
    style={styles.picker}
  >
    <Picker.Item label="Select Experience" value="" />
    <Picker.Item label="Fresher" value="fresher" />
    <Picker.Item label="1-3 Years" value="1-3" />
    <Picker.Item label="3+ Years" value="3plus" />
  </Picker>
</View>
      <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.clearBtn} 
                onPress={() => {
                setFormData(prev => ({
                ...prev,
                location: null,
                title: null,
                experience: null,
                salary: [0, 50000],
                age: [18, 52],
                gender: 'Male',
                jobPosted: 'All',               
                }));
                setSelectedState(null); 
                setSelectedCity(null);
                }}>
                  <Text style={styles.clearBtnText}>Clear Filter</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyBtn} onPress={() => {
                  setShowFilter(false);
                  handleFilter();
                }}>
                  <Text style={{ color: '#fff',alignSelf:'center', }}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

       <FlatList
  data={jobs}
  keyExtractor={(item) => item.jobId} 
  contentContainerStyle={{
    paddingBottom: 60,
  }}
   keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
  renderItem={({ item }) => (
    <JobBox
      item={item}
      requirements={item.requirements}
      saved={item.saved}
      onToggleSave={() => toggleSave(item.jobId)} 
      onPress={() => navigateToDescription(item)}
    />
  )}
  ListEmptyComponent={
    <Text style={styles.noResults}>No jobs found.</Text>
  }
  onEndReachedThreshold={0.5}
  onEndReached={() => {
    if (hasMoreJobs && !isFetchingMore) {
      GetDataFunc(false);
    }
  }}
  refreshing={isLoading}
  onRefresh={() => {
    setPage(1);
    setisLoading(true);
    GetDataFunc(true); 
  }}
  ListFooterComponent={() =>
    isFetchingMore ? (
      <ActivityIndicator
        size="small"
        color="#000"
        style={{ marginVertical: 10 }}
      />
    ) : null
  }
/>
      
      </View>
      <JobMenu />
      </View>  
        </TouchableWithoutFeedback>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FD',
    padding: 16,
  },
  // searchBarContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 16,
  //   backgroundColor: '#ffffff',
  //   borderRadius: 8,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   paddingHorizontal: 10,
  //   paddingVertical: 8,
  // },
  
   inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
     borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 8,
  // marginBottom:20,
},
topLeftArrow: {
  position: 'absolute',
  top: 10,
  right: -5,
  zIndex: 1,
},

iconn: {
  marginRight: 8,
},
  input: {
    flex: 1,
    paddingHorizontal: 8,
    color: '#000',
     backgroundColor: '#ffffff',

  },
  inputIcon: {
    marginRight: 8,
  },
  icon: {
    padding: 8,
  },
  jobImg: {
    width: 20,
    height: 14,
    resizeMode: 'contain',
    marginRight: 8,
  },
 jobImg1: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  searchButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  borderWidth: 0.5,
    borderColor: '#D0D0D0',
  //  alignSelf:'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },   
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  jobBox: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    // borderWidth: 1,
  // borderWidth: 0.5,
  //   borderColor: '#D0D0D0',
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 1,
    position: 'relative',
  },
  activeJobBox: {
    borderColor: '#007BFF',
    shadowColor: '#007BFF',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    // elevation: 5,
  },
  saveIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8D53',
    // marginBottom: 4,
    flexShrink: 1,      
  flexGrow: 1,         
  flexWrap: 'nowrap', 
  },
  jobCompany: {
    fontSize: 13,
    fontWeight: '500',
    color: '#535353',
      flexShrink: 1,      
  flexGrow: 1,         
  flexWrap: 'nowrap', 
    
  },
  jobLocation: {
    fontSize: 11,
    color: '#535353',
    fontWeight: '400',
    flexShrink: 1,
    // marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowS: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  jobType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d4574',
  },
  requirementsContainer: {
    marginTop: 12,
  },
  requirementText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
   filterContainerFull: {
    width: '100%',
    // height: screenHeight  - 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 6,
    // elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
    sectionTitle: { fontWeight: '600', marginTop: 16, marginBottom: 8 },
    sectionTitleJob: { fontWeight: '600', marginTop: 6, marginBottom: 8 },
   rowWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent:'space-evenly'},
   rowWrapp: { flexDirection: 'row', flexWrap: 'wrap', },
  radioOption: { flexDirection: 'row', alignItems: 'center',  marginVertical: 6 ,width: '48%',},
  radioOptionG: { flexDirection: 'row', alignItems: 'center',  marginVertical: 6 , margin:6},
 radioCircle: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#999',
  marginRight: 8,
  justifyContent: 'center',
  alignItems: 'center',
},

radioSelected: {
  borderColor: '#FF8D53',
  backgroundColor: '#FF8D53',
},
innerDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'white',
},
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
    height: 45,
  },
  pickerWrapper: {
  backgroundColor: '#F5F4FD',
  borderRadius: 8,
  height: 45, 
    width: '95%',
  overflow: 'hidden', 
  justifyContent: 'center',
  marginLeft:6,
},

picker: {
  color: '#585858',        
  width: '100%',
  marginTop: -4,         
  paddingHorizontal: 10,  
},

  sliderContainer: {
    marginVertical: 10,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
        // marginBottom:100,

  },
  clearBtn: {
    padding: 12,
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    width:'47%',
    borderWidth:0.5,
    borderColor:'#D0D0D0',
  },

  clearBtnText: {
    color:'#D0D0D0',
    alignSelf:'center',
  },

  applyBtn: {
    padding: 12,
    backgroundColor: '#FF8D53',
    borderRadius: 8,
        width:'47%',

  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  // salaryContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  // salary: {
  //   fontSize: 12,
  //   color: '#333',
  //   backgroundColor: '#F5F4FD',
  //   paddingVertical: 4,
  //   paddingHorizontal: 14,
  //   borderRadius: 20,
  //   marginRight: 10,
  // },
  salaryContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', 
  // marginTop: 4,
},

salaryDetails: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap', 
},

salary: {
  fontSize: 11,
  color: '#535353',
  backgroundColor: '#F5F4FD',
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 20,
  marginRight: 4,
},

});

export default JobPage;
