import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity,SafeAreaView,Modal,StatusBar, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
// import Slider from '../../components/Slider';
import Sliders from '../../components/Sliders';
import Slider from '@react-native-community/slider';

import JobMenu from '../../components/Job/JobMenu';
import JobHeader from '../../components/Job/JobHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Logo from '../../components/Auth/Logo';
import { AuthContext } from '../../context/context';
import { JobBox } from './JobPage';
import { useColorScheme } from 'react-native';
import TopHeaderJob from '../../components/TopHeaderJob';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';



const jobsData = [
  {
    id: '1',
    title: 'Junior Java Developer',
    company: 'Tata Consultancy Services (TCS)',
    location: 'Banglore, karnatka',
    salary: '₹40,000 - ₹50,000 per month',
    jobType: 'Full-Time',
    jobShift: 'Night shift',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Responsible for designing, developing, and maintaining Java-based applications. Collaborates with cross-functional teams to create efficient software solutions. Debugs and optimizes code to ensure smooth functionality.',
    requirements: [
      'Experience with Java programming language.',
      'Familiarity with REST APIs.',
      'Strong problem-solving skills.',
    ]
  },
  {
    id: '2',
    title: 'Data Analyst Trainee',
    company: 'Data Inc.',
    location: 'Bhopal, Madhya Pradesh',
    salary: '₹30,000 - ₹50,000 per month',
    jobType: 'Part-Time',
    jobShift: 'Day shift',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Assists in collecting, analyzing, and interpreting large datasets to provide actionable insights. Prepares reports and dashboards to support decision-making processes. Works with various data analysis tools and techniques to ensure accuracy.',
    requirements: [
      'Knowledge of Excel and data analysis tools.',
      'Ability to work with large data sets.',
      'Strong attention to detail.'
    ]
  },
  {
    id: '3',
    title: 'SQL Developer Apprentice',
    company: 'Zonopact India Pvt. Ltd.',
    location: 'Indore, Madhya Pradesh',
    salary: '₹1,500 an hour',
    jobType: 'Full-Time',
    jobShift: 'Day shift',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Develops and optimizes SQL queries to manage database operations effectively. Ensures data integrity and resolves database-related issues. Collaborates with teams to design efficient database schemas and solutions.',
    requirements: [
      'Familiarity with SQL databases.',
      'Good analytical and troubleshooting skills.',
      'Ability to work under pressure.'
    ]
  },
  {
    id: '4',
    title: 'Assistant Project Manager',
    company: 'Business Solutions',
    location: 'Pune, Maharashtra',
    salary: '₹2,200 an hour',
    jobShift: 'Night shift',
    jobType: 'Part-Time',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Supports project planning, coordination, and execution to meet deadlines and objectives. Communicates with teams to monitor progress and resolve issues. Manages documentation and reporting for seamless project delivery.',
    requirements: [
      'Experience in project management.',
      'Excellent communication skills.',
      'Ability to manage teams effectively.'
    ]
  },
  {
    id: '5',
    title: 'Front End Developer',
    company: 'Tech Corp',
    location: 'Remote',
    salary: '₹2,000 an hour',
    jobType: 'Full-Time',
    jobShift: 'Day shift',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Designs and implements user interfaces using modern frameworks like React.js or Angular. Ensures responsive, accessible, and visually appealing web applications. Collaborates with backend developers to integrate APIs and dynamic content.',
    requirements: [
      'Experience with React.js or Angular.',
      'Knowledge of HTML, CSS, and JavaScript.',
      'Ability to work with responsive designs.'
    ]
  },
  {
    id: '6',
    title: 'Software Developer',
    company: 'Data Inc.',
    location: 'Bhopal, Madhya Pradesh',
    salary: '₹1,800 an hour',
    jobType: 'Part-Time',
    jobShift: 'Night shift',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Builds, tests, and maintains software applications using programming languages like Python, Java, or C++. Participates in the entire software development lifecycle, from design to deployment. Improves application performance and resolves technical issues.',
    requirements: [
      'Strong knowledge of programming languages like Python, Java, or C++.',
      'Familiarity with database management systems.',
      'Experience with agile development methodologies.'
    ]
  },
  {
    id: '7',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'Indore, Madhya Pradesh',
    salary: '₹1,500 an hour',
    jobType: 'Full-Time',
    jobShift: 'Day shift',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    JobDescription: 'Creates intuitive and visually appealing designs using tools like Figma or Adobe XD. Conducts user research to enhance the user experience and usability. Collaborates with developers to implement design prototypes and interfaces.',
    requirements: [
      'Proficiency in design tools like Figma, Sketch, or Adobe XD.',
      'Experience in user-centered design processes.',
      'Knowledge of HTML, CSS, and JavaScript for design implementation.'
    ]
  },
  {
    id: '8',
    title: 'Project Manager',
    company: 'Business Solutions',
    location: 'Pune, Maharashtra',
    salary: '₹2,200 an hour',
    jobType: 'Part-Time',
    jobShift: 'Day shift',
    JobDescription: 'Oversees project execution, ensuring timely delivery and budget adherence. Coordinates with stakeholders and teams to align goals and resolve challenges. Implements effective strategies to streamline workflows and maximize efficiency.',
    saved: false,
    Benefits: [
      'Health insurance.',
      'Leave encashment',
      'Life insurance',
    ],
    requirements: [
      'Proven experience in project management.',
      'Strong leadership and communication skills.',
      'Ability to manage multiple tasks and deadlines.'
    ]
  },
];
 const JOB_POSTED_OPTIONS = [
    "All",
    "Last 03 Days",
    "Last 15 Days",
    "Last 24 Hours",
    "Last 07 Days",
    "Last 01 Month",
  ];
  const ORANGE = "#FF7A00";

const JobHome = ({ navigation,route }) => {
  const [sliderWidth, setSliderWidth] = React.useState(
  Math.max(240, Dimensions.get('window').width - 60));
  const [jobPosted, setJobPosted] = useState("all");
  const [gender, setGender] = useState("male");
  const jobSeekerData = route.params;
  const { signOut } = useContext(AuthContext)
  const [slider, setSlider] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  // const [jobs, setJobs] = useState();
  const [jobs, setJobs] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const colorScheme = useColorScheme();
  const statusBarColor = colorScheme === 'dark' ? '#783b1cff' : '#945b3eff';
  const token = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; 
  

  const [showFilter, setShowFilter] = useState(false);
const [locationOpen, setLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
  location: null,
  title: null,
  experience: null,
  age: [18, 52],
  salary: [0, 50000],
  gender: 'Male',
  jobPosted: 'All',
});


  const jobPostedOptions = ['All', 'Last 24 Hours', 'Last 03 Days', 'Last 07 Days', 'Last 15 Days', 'Last 01 Month'];
  const genderOptions = ['Male', 'Female', 'Both'];
const screenHeight = Dimensions.get('window').height;




// useEffect(() => {
//   if (searchQuery.trim() === '') {
//     setShowSuggestion(false);
//     setSuggestion([]);
//   }
// }, [searchQuery]);
useEffect(() => {
  GetDataFunc(1);
  
  
}, []);



const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false); 



const handleLoadMore = () => {
  if (!isFetchingMore && hasMoreJobs) {
    console.log("page", page);
    GetDataFunc(page); // always use the latest page state
  }
};

  const GetDataFunc = async (pageToFetch ) => {
  if (isFetchingMore) return; // prevent duplicate calls
  if (pageToFetch === 1 && jobs.length > 0) {
    console.log("⛔ Skipping duplicate page=1 call");
    return; // prevent loading page=1 again if already loaded
  }
  setIsFetchingMore(true);

  try {
    
    console.log("pageToFetch",pageToFetch)
    const res = await fetch(
      `https://jobipo.com/api/v3/view-job-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
           
         
        },
       body: JSON.stringify({
    page: pageToFetch, 
    limit:15,  // must be JSON string
  }),
       
      }
    );
    //debugger
     const data = await res.json();
    console.log('data',data.jobs)

    if (data.status === 1) {
      const newJobs = data.jobs;
      console.log('newJobs',newJobs)

      setJobs((prev) =>
        pageToFetch === 1 ? newJobs : [...prev, ...newJobs]
      );
      //console.log("justjobb", job)

      setPage(pageToFetch + 1);
      setHasMoreJobs(newJobs.length > 0);
    }
  } catch (error) {
    console.error("Error loading jobs:", error);
  } finally {
    setIsFetchingMore(false);
  }
};

// ✅ Load once when screen mounts


  const handleSearch = async () => {
    const text = searchQuery.trim();
    if (text === '') {
      setJobs(jobs);
      navigation.navigate('JobPage');
    } else {


      const filtered = jobs.filter((job) =>
        job.jobTitle?.toLowerCase().includes(text.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(text.toLowerCase()) ||
        job.city?.toLowerCase().includes(text.toLowerCase()) ||
        job.state?.toLowerCase().includes(text.toLowerCase())
      );
      navigation.navigate('JobPage', { filteredJobs: filtered, searchQuery: text });
       setJobs(filtered);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('JobProfile');
  };

  const navigateToLearning = () => {
    navigation.navigate('Learning');
  };

  const navigateToAppliedJobs = () => {
    navigation.navigate('AppliedJob');
  };

  const navigateToInterviewInvites = () => {
    navigation.navigate('InterviewInvite');
  };
 //SAVED JOBS 
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
          // console.log('state parsedStates',parsedCities)
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
    const tokenn = await AsyncStorage.getItem('Token');
    console.log('token :', tokenn);
  //const token = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; 

    const res = await fetch('https://jobipo.com/api/v3/view-job-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenn}`,
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
  <TouchableWithoutFeedback onPress={() => {
    Keyboard.dismiss();
    setShowSuggestion(false); // hide suggestion list on outside touch
  }}> 
    <View style={{ flex: 1 }}>
          {/* <StatusBar backgroundColor='#727070ff'  barStyle="light-content" /> */}
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
      <TopHeaderJob/>

    
      <View style={styles.container}>


        <View style={[styles.searchrow, { marginTop: 8 }]}>
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
                style={styles.jobImg}
              />
             {/* <Icon name="search-outline" size={20} color="#888" style={styles.inputIcon} /> */}

            {showSuggestion && <FlatList
              style={{
                position: 'absolute',
                top: 50,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                maxHeight: 300,
                zIndex: 1,
              }}
              ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }} />}
              data={suggestion}
              renderItem={({ item }) => {
                return (
                  <Pressable style={{
                    padding: 10,
                    zIndex: 10,
                 //   backgroundColor: '#000'
                  }}
                    onPress={() => {
                      console.log('item');
                      setSearchQuery(item?.jobTitle);
                      setShowSuggestion(false);
                       handleSearch();
                    }}
                  >
                    <Text>{item?.jobTitle}</Text>
                  </Pressable>
                )
              }}
            />}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={() => setShowFilter(!showFilter)}>
          {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}> */}
            {/* <Text style={styles.buttonText}>Search</Text> */}
              <Image
                source={require('../../../assets/Image/icons/filter.png')} 
                style={styles.jobImg}
              />
          </TouchableOpacity>
        </View>



    return (
  <View style={{ flex: 1 }}>
    {showFilter ? (
      // ---------- FILTER UI ----------
      <View style={[styles.filterContainerFull, { flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
           
        >
          {/* --- your filter content here --- */}


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
<View style={{  
 }}>  
<Text style={styles.sectionTitle}>Age </Text>
<Text style={styles.sliderLabel}>
  {formData.age[0]} years - {formData.age[1]} years
</Text>
</View>

<View style={{ width: '100%', alignItems: 'center'}}>
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
  <View style={{   
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



          {/* Footer buttons */}
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.clearBtn}
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
              }}
            >
              <Text style={styles.clearBtnText}>Clear Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                setShowFilter(false);
                handleFilter();
              }}
            >
              <Text style={{ color: "#fff", alignSelf: "center" }}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    ) : (
      // ---------- JOB LIST ----------
      <FlatList
  data={jobs}
  keyExtractor={(item) => item.jobId}   // ✅ use jobId, not id
  contentContainerStyle={{ paddingBottom: 60 }}
  renderItem={({ item }) => (
    <JobBox
      item={item}
      jobId={item.jobId}
      requirements={item.requirements}
      saved={item.saved}
      onToggleSave={() => toggleSave(item.jobId)}
      onPress={() => navigateToDescription(item)}
    />
  )}
  ListEmptyComponent={<Text style={styles.noResults}>No jobs found.</Text>}
  onEndReachedThreshold={0.5}
  onEndReached={handleLoadMore}
  ListFooterComponent={() =>
    isFetchingMore ? (
      <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} />
    ) : null
  }
/>

    )}
  </View>
);







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
    padding: 10,
    paddingHorizontal: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
   jobImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    // borderWidth: 0.5,
    // borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    color: '#000',
  },
  inputIcon: {
    marginRight: 8,
  },
  icon: {
    padding: 8,
  },
  searchButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  //  borderWidth: 0.5,
  //   borderColor: '#D0D0D0',
  //  alignSelf:'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileIcon: {
    marginRight: 8,
  },
  profileValue: {
    color: '#000',
  },
  profileshare: {
    marginTop: 7,
    color: '#2d8659',
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    flex: 1,
    padding: 10,
    paddingVertical: 20,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  boxText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  annContainer: {
    marginTop: 0,
  },
  annText: {
    fontSize: 20,
    color: '#595959',
    fontWeight: '500',
    marginTop: 10,
  },
  annSlider: {
    marginTop: 12,
  },
  modelContainer:{
padding: 20 
  },

  sliderLabel: {
  fontSize: 14,
  color: '#333',
  textAlign: 'start',
},

  filterContainerFull: {
    width: '100%',
    // height: screenHeight  - 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 6,
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
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
//   pickerWrapper: {
//   borderWidth: 1,
//   borderColor: '#ccc',
//   borderRadius: 8,
//   marginBottom: 8,
//   overflow: 'hidden',
  
// },

// picker: {
//   height: 50,
//   color: '#000',
// },
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
    // borderWidth:0.5,
    // borderColor:'#D0D0D0',
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
});


export default JobHome;
