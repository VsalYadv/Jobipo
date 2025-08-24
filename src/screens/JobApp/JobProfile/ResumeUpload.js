import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import Icon from 'react-native-vector-icons/Octicons';
import UploadIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PdfIcon from 'react-native-vector-icons/FontAwesome';

import JobHeader from '../../../components/Job/JobHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView,useSafeAreaInsets  } from 'react-native-safe-area-context';



const ResumeUpload = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const jobSeekerData = route.params;
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const handleSelectFile = async () => {
    try {
      const res = await pick({
        mode: 'open',
        type: [types.images, types.pdf],
      });
      console.log('Selected file:', res);
      setFileUri(res[0].uri);
      setFileName(res[0].name);
      setFileType(res[0].type);
    } catch (err) {
      Alert.alert('Error selecting file', err.message);
    }
  };

  const uploadImageOnServer = async imageData => {
    console.log(imageData);
    
    console.log('uploading on server.....')
    try {
      let response = await fetch("https://jobipo.com/api/Agent/imageUpload", {
        method: "POST",
        body: imageData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(res => res.json());
      console.log("r", response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

//   const handleUpload = async () => {
//   try {
//     const userID = await AsyncStorage.getItem('UserID');

//     if (!userID) {
//       Alert.alert('Error', 'User ID not found. Please log in again.');
//       return;
//     }

//     if (fileUri) {
//       const formData = new FormData();
//       formData.append('image', {
//         uri: fileUri,
//         type: fileType,
//         name: fileName,
//       });

//       formData.append('userID', userID); 
// console.log(formData)
//       const fileRes = await uploadImageOnServer(formData);
//       console.log(fileRes);

//       await fetch(`https://jobipo.com/api/v2/resume-upload`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           ...jobSeekerData,
//           cv: fileRes.message,
//         }),
//       })
//       .then(res => res.json())
//       .then(async(res) => {
//         console.log('res', res);
//         if (res) {
//           await AsyncStorage.setItem('cv', fileName);
//           Alert.alert('Resume uploaded successfully!');
//           setFileUri(null);
//           setFileName('');
//           navigation.goBack();
//         }
//       })
//       .catch(err => {
//         console.log('update error', err);
//         Alert.alert('Error updating details');
//       });

//     } else {
//       Alert.alert('Please select a file to upload!');
//     }
//   } catch (error) {
//     console.log('handleUpload error:', error);
//     Alert.alert('Something went wrong!');
//   }
// };




const handleUpload = async () => {
  try {
    const userID = await AsyncStorage.getItem('UserID');
    console.log("uiuiui",userID)

    if (!userID) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    if (!fileUri) {
      Alert.alert('Please select a file to upload!');
      return;
    }

    // Step 1: Create FormData for imageUpload
    const imageFormData = new FormData();
    console.log('immgedatawer', imageFormData)

    imageFormData.append('image', {
      uri: fileUri,
      type: fileType,
      name: fileName,
    });

    console.log('imm', imageFormData)

    // Step 2: Upload image
    const uploadResponse = await fetch("https://jobipo.com/api/Agent/imageUpload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: imageFormData,
    });
    // console.log('uploadResponse',uploadResponse)
    const fileRes = await uploadResponse.json();
    console.log("Upload response:", fileRes);

    if (!fileRes || !fileRes.message) {
      Alert.alert('Upload failed.');
      return;
    }

    // Step 3: Prepare form data for resume-upload
    const resumeFormData = new FormData();
    console.log('resumeFormData',resumeFormData)

    // Append each field from jobSeekerData
    // Object.entries(jobSeekerData).forEach(([key, value]) => {
    //   if (value !== null && value !== undefined) {
    //     resumeFormData.append(key, value);
    //   }
    // });

    // Append uploaded file name/path
    // resumeFormData.append('image', fileRes.message);
    //   resumeFormData.append('userID', userID);


    //resumeFormData.append('userID', userID);
    resumeFormData.append('image', {
  uri: fileUri,
  type: fileType,
  name: fileName,});
resumeFormData.append('userID', userID);


console.log('resumeFormDataafterappend',resumeFormData)
//console.log(`CHECKKK' , );

// for (let pair of resumeFormData._parts) {
//   console.log(`${pair[0]}: ${pair[1]}`);
// }

    // Step 4: Send resume update with form-data
    const updateRess = await fetch(`https://jobipo.com/api/v2/resume-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    // body: JSON.stringify(resumeFormData) 
    body: resumeFormData,
    });

    const updateJson = await updateRess.json();
    console.log('Resume update response:', updateJson);

    if (updateJson && updateJson.status === 1) {
  await AsyncStorage.setItem('cv', fileName);
  Alert.alert('Resume uploaded successfully!');
  setFileUri(null);
  setFileName('');
  navigation.goBack();
} else {
  console.log('Resume update error:', updateJson.message);
  Alert.alert('Upload failed(In KB)', updateJson.message || 'Something went wrong!');
}

  } catch (err) {
    console.log('handleUpload error:', err);
    Alert.alert('Something went wrong!');
  }
};


  const handleCancel = () => {
    setFileUri(null);
    setFileName('');
  };

  return (
    <>


    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <JobHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Upload Resume</Text>

        <TouchableOpacity style={styles.selectButtonpdf} onPress={handleSelectFile}>
          <PdfIcon name="file-pdf-o" size={50} color="#0d4574" />
          <Text style={styles.selectText}>Select Resume (PDF)</Text>
        </TouchableOpacity>

        {fileUri && (
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>File: {fileName}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.removeContainer}>
        <TouchableOpacity style={styles.removeButton} onPress={handleCancel}>
          <Icon name="trash" size={22} color="#2d8659" style={styles.icon} />
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.SaveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpload}>
          <UploadIcon name="upload" size={27} color="#fff" style={styles.icon} />
          <Text style={styles.saveButtonText}>Upload Resume</Text>
        </TouchableOpacity>
      </View>

      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectButton: {
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  selectButtonpdf: {
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  selectText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0c6951',
  },
  fileDetails: {
    marginVertical: 15,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d8659',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  SaveContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingBottom: 15,
     
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2d8659',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#2d8659',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  removeContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  icon: {
    marginRight: 10,
  },
});

export default ResumeUpload;
