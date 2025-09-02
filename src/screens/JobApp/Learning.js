import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobMenu from '../../components/Job/JobMenu';
import { useFocusEffect } from '@react-navigation/native';
import LearningHeader from '../../components/LearningHeader';
import { VideoPlaySvgWhite } from '../JobSvgIcons';
const Learning = () => {
  const videos = [
    { id: '3hH8kTHFw2A', title: 'Mastering Data Structures and Algorithms' },
    { id: 'rfscVS0vtbw', title: 'Python Full Course for Beginners' },
    { id: 'Z1Yd7upQsXY', title: 'SQL Interview Preparation - Top Questions' },
    { id: 'Ukg_U3CnJWI', title: 'Top 10 React Interview Questions' },
  ];

  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {

        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/learning',
          {
            method: 'GET',
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));


        if (sliderDataApi?.status === 1) {
          setData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)?.training,
          )

          setisLoading(false);
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

  const openYouTubeVideo = (videoId) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(videoUrl);
  };
  
  console.log('data', data);


  return (
    <>
    <LearningHeader/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* <Text style={styles.heading}>YouTube Videos</Text> */}


          {data?.map((video, index) => (
                    <View style={styles.maincontainer}>

            <View key={index} style={styles.container}>
              <TouchableOpacity style={styles.videoContainer} onPress={() => openYouTubeVideo(video.trainingID)}>
                <Image
                  source={{ uri: video?.image }}
                  style={styles.thumbnail}
                />
                <Icon name="play-circle-fill" size={50} color="#FF8D53" style={styles.playIcon} />
              </TouchableOpacity>

              <View style={styles.content}>
                <Text style={styles.title}>{video?.title}</Text>
                <TouchableOpacity style={styles.watchNowContainer} onPress={() => openYouTubeVideo(video.trainingID)}>
              <VideoPlaySvgWhite/>
                  <Text style={styles.watchNowText}>Watch Now</Text>
                </TouchableOpacity>
              </View>
            </View>
           </View>

          ))}
      </ScrollView>
      <JobMenu />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
  flexDirection: 'row',
  backgroundColor: '#f8f9fa',
  borderRadius: 10,
  // elevation: 3,
  marginHorizontal: 10,
  marginBottom: 15,
  overflow: 'hidden',
  height: 120, 
  marginTop:10,
},

videoContainer: {
  width: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  backgroundColor: '#ffffff',
  padding:10,
  
},
thumbnail: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
  borderWidth:0.5,
    borderColor:'#D0D0D0',
},
playIcon: {
  position: 'absolute',
  zIndex: 1,
},
content: {
  width: '50%',
  padding: 10,
  justifyContent: 'space-between',
},
title: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
watchNowContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FF8D53',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  alignSelf: 'flex-start',
},
watchNowText: {
  fontSize: 14,
  color: '#fff',
  marginLeft: 5,
},

});

export default Learning;
