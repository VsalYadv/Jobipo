import React, { useCallback, useState } from 'react';
import { View, Text, Image,TouchableOpacity, FlatList,ActivityIndicator, StyleSheet, Alert, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobHeader from '../../components/Job/JobHeader';
import JobMenu from '../../components/Job/JobMenu';
import { useFocusEffect } from '@react-navigation/native';
import AppliedJobHeader from '../../components/AppliedJobHeader';
import { HeartFilledOrangeIcon,HeartIcon} from '../../screens/JobSvgIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppliedJob = ({ navigation }) => {
    const [appliedJobs, setAppliedJobs] = useState();
    const [isLoading, setisLoading] = useState(true);

 const [favoriteJobs, setFavoriteJobs] = useState([]);

  // Fetch Applied Jobs
  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        try {
          const response = await fetch('https://jobipo.com/api/Agent/myapplied', {
            method: 'GET',
          });

          const result = await response.json();
          console.log('API Response:', result);
            console.log('Favorite Jobs Response:', JSON.stringify(result, null, 2));

          if (result?.status === 1 && result?.msg) {
            const parsed = JSON.parse(result.msg);
                        console.log('Favparsednse:', JSON.stringify(parsed, null, 2));

            setAppliedJobs(parsed);
          } else {
            setAppliedJobs([]);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          Alert.alert('Connection Issue', 'Please check your internet connection.');
        } finally {
          setisLoading(false);
        }
      };

      GetDataFunc();
    }, [])
  );

  // Fetch Favorite Jobs
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('UserID');
          if (!storedUserId) return;

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
 console.log('favJobIdsfavJobIds',data)
          if (data.status === 1) {
            const parsedJobs = JSON.parse(data.jobs);
            const favJobIds = parsedJobs.map(job => job.jobId);
            setFavoriteJobs(favJobIds);
          } else {
            console.warn('Failed to fetch favorites', data.message || data);
          }
        } catch (err) {
          console.error('Error fetching favorite jobs:', err);
        }
      };

      fetchFavorites();
    }, [])
  );

  // Toggle Favorite Job
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

  const applicationStatus = [
    {
      title: "Applied",
      style: { backgroundColor: '#535353', color: '#fff' },
    },
    {
      title: "Shortlist",
      style: { backgroundColor: '#007BFF', color: '#fff' },
    },
    {
      title: "Interview Invite",
      style: { backgroundColor: '#FFA500', color: '#fff' },
    },
    {
      title: "Selected",
      style: { backgroundColor: '#28a745', color: '#fff' },
    },
    {
      title: "Rejected",
      style: { backgroundColor: '#dc3545', color: '#fff' },
    }
  ];

  const renderJobItem = ({ item }) => {
    const isFavorite = favoriteJobs.includes(item.jobId);

    return (
      <Pressable 
        style={styles.jobBox}
        onPress={() => navigation.navigate('JobDes', { job: item })}
      >
        <View style={styles.topLeftArrow}>
          <Image
            source={require('../../../assets/Image/icons/next.png')}
            style={styles.jobImg}
          />
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/rectangle.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/company.png')}
            style={styles.jobImg}
          />
          {/* <Text style={styles.jobCompany}>{item.companyName}</Text> */}
          <Text style={styles.jobCompany}>{item.businessName|| 'NA'}</Text>

        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/location.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobLocation}>
              {item.companyAddress || 'NA'}

            {/* {item.jobLocation || 'Location not updated'} */}
          </Text>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../../assets/Image/icons/salary.png')}
            style={styles.jobImg}
          />
          <Text style={styles.jobLocation}>
            ₹{item.salaryFrom} - ₹{item.salaryTo} per month
          </Text>
        </View>

        <View style={styles.salaryContainer}>
          <Text style={styles.salary}>{item.jobType}</Text>
          <Text style={styles.salary}>{item.genderPreferance}</Text>
          <Text style={styles.salary}>Exp. {item.experienceLevel}</Text>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              handleToggleFavorite(item.jobId);
            }}
          >
            {isFavorite ? <HeartFilledOrangeIcon /> : <HeartIcon />}
          </TouchableOpacity>
        </View>

                {/* <Text style={styles.salary}>applicationStatus. {item.applicationStatus}</Text> */}

        <View style={styles.statusContainer}>
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 10,
              flexDirection: 'row',
              width: 130,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: applicationStatus[Number(item.applicationStatus) - 1]?.style?.backgroundColor || '#ccc',
            }}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: applicationStatus[Number(item.applicationStatus) - 1]?.style?.color || '#000',
                },
              ]}
            >
              {applicationStatus[Number(item.applicationStatus) - 1]?.title || 'Unknown'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <AppliedJobHeader />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#535353" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={appliedJobs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderJobItem}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Icon name="work-off" size={50} color="#ccc" />
                <Text style={styles.noJobs}>You have not applied for any job yet.</Text>
              </View>
            }
          />
        )}
      </View>
      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  flatListContent: {
    paddingBottom: 100, // Add space for JobMenu
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  jobBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },
    jobImg: {
    width: 20,
    height: 14,
    resizeMode: 'contain',
    marginRight: 8,
  },
   row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 4,
  // marginBottom:20,
},
    sectionTitle: { fontWeight: '600', marginTop: 16, marginBottom: 8 },
 salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  salary: {
    fontSize: 12,
    color: '#333',
    backgroundColor: '#F5F4FD',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  jobType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#535353',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8D53',
  },
  jobCompany: {
    fontSize: 14,
    color: '#535353',
    fontWeight: '500',

  },
  topLeftArrow: {
  position: 'absolute',
  top: 20,
  right: 10,
  zIndex: 1,
},

  jobLocation: {
    fontSize: 12,
    color: '#535353',
     fontWeight: '400',

  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resumeStatus: {
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noJobs: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AppliedJob;
