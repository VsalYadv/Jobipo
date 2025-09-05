import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native';
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
  const [fileSize, setFileSize] = useState(0); // Added fileSize state
  const [isUploading, setIsUploading] = useState(false); // Added isUploading state

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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
      setFileSize(res[0].size); // Set file size
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

  const handleUpload = async () => {
    console.log('=== HANDLE UPLOAD START ===');
    try {
      const userID = await AsyncStorage.getItem('UserID');
      console.log("1. User ID retrieved:", userID);

      if (!userID) {
        console.log('2. ERROR: No User ID found');
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      if (!fileUri) {
        console.log('3. ERROR: No file URI');
        Alert.alert('Please select a file to upload!');
        return;
      }

      console.log('4. File details before upload:');
      console.log('   - File URI:', fileUri);
      console.log('   - File Name:', fileName);
      console.log('   - File Type:', fileType);
      console.log('   - File Size:', fileSize);

      // Check file size again before upload (only if we have a valid size)
      if (fileSize > 0 && fileSize > MAX_FILE_SIZE) {
        console.log('5. ERROR: File too large');
        Alert.alert('File Too Large', `File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size of 5MB.`);
        return;
      }

      setIsUploading(true);
      console.log('6. Starting upload process...');

      // Create FormData for resume upload
      const formData = new FormData();
      console.log('7. FormData created');
      
      // Create the file object with proper structure
      const fileObject = {
        uri: fileUri,
        type: fileType || 'application/pdf',
        name: fileName,
      };
      
      console.log('8. File object created:', fileObject);
      console.log('9. File object validation:');
      console.log('   - URI exists:', !!fileObject.uri);
      console.log('   - Type exists:', !!fileObject.type);
      console.log('   - Name exists:', !!fileObject.name);
      
      // Append the file
      formData.append('image', fileObject);
      console.log('10. File appended to FormData with key "image"');
      
      // Append user ID
      formData.append('userID', userID);
      console.log('11. UserID appended to FormData');

      // Append other job seeker data as form fields
      if (jobSeekerData) {
        Object.keys(jobSeekerData).forEach(key => {
          if (jobSeekerData[key] !== null && jobSeekerData[key] !== undefined) {
            formData.append(key, jobSeekerData[key]);
          }
        });
        console.log('12. Job seeker data appended to FormData');
      }

      // Log FormData contents for debugging
      console.log('13. Final FormData contents:');
      console.log('   - File URI:', fileUri);
      console.log('   - File Type:', fileType);
      console.log('   - File Name:', fileName);
      console.log('   - File Size:', fileSize, 'bytes');
      console.log('   - User ID:', userID);
      console.log("sending",formData);

      // Upload directly to resume-upload endpoint
      console.log('14. Uploading file directly to resume-upload endpoint...');
      const response = await fetch('https://jobipo.com/api/v2/resume-upload', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type header - let FormData set it automatically
        },
        body: formData,
      });

      console.log('15. Response received');
      console.log('16. Response status:', response.status);
      console.log('17. Response status text:', response.statusText);
      
      const responseText = await response.text();
      console.log('18. Raw response text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('19. Parsed response:', responseData);
      } catch (error) {
        console.log('19. ERROR parsing JSON response:', error);
        Alert.alert('Error', 'Invalid server response');
        return;
      }

      if (responseData && responseData.status === 1) {
        console.log('20. SUCCESS: Resume uploaded successfully');
        console.log('21. Full response data:', responseData);
        await AsyncStorage.setItem('cv', fileName);
        
        // Check if server returns a URL to the uploaded file
        const serverFileUrl = responseData.fileUrl || responseData.url || responseData.data?.url;
        if (serverFileUrl) {
          console.log('22. Server file URL found:', serverFileUrl);
          await AsyncStorage.setItem('cvUri', serverFileUrl);
        } else {
          console.log('22. No server URL found, storing local URI');
          await AsyncStorage.setItem('cvUri', fileUri);
        }
        
        Alert.alert('Success', 'Resume uploaded successfully!');
        setFileUri(null);
        setFileName('');
        setFileType('');
        setFileSize(0);
        navigation.goBack();
      } else {
        console.log('20. ERROR: Resume upload failed');
        const errorMessage = responseData?.message || 'Upload failed';
        console.log('   - Error message:', errorMessage);
        
        // Check if the error is about file size
        if (errorMessage.toLowerCase().includes('size') || errorMessage.toLowerCase().includes('kb') || errorMessage.toLowerCase().includes('mb')) {
          Alert.alert('File Size Error', 'The file size exceeds the server limit. Please try a smaller file (under 5MB).');
        } else {
          Alert.alert('Upload Failed', errorMessage);
        }
      }

    } catch (error) {
      console.log('=== HANDLE UPLOAD ERROR ===');
      console.log('Error details:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      Alert.alert('Error', 'Something went wrong during upload. Please try again.');
    } finally {
      setIsUploading(false);
      console.log('=== HANDLE UPLOAD END ===');
    }
  };


  const handleCancel = () => {
    setFileUri(null);
    setFileName('');
    setFileType('');
    setFileSize(0);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
             <Text style={styles.fileSize}>Size: {fileSize} bytes</Text>
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
         <TouchableOpacity 
           style={[styles.saveButton, isUploading && styles.saveButtonDisabled]} 
           onPress={handleUpload}
           disabled={isUploading}
         >
           <UploadIcon name="upload" size={27} color="#fff" style={styles.icon} />
           <Text style={styles.saveButtonText}>
             {isUploading ? 'Uploading...' : 'Upload Resume'}
           </Text>
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
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
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
  saveButtonDisabled: {
    backgroundColor: '#ccc',
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
