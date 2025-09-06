import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Linking } from 'react-native';
import { PDFIconRed,DownloadIcon } from '../JobSvgIcons';
import LearningHeader from '../../components/LearningHeader';
import { ScrollView } from 'react-native';
import JobMenu from '../../components/Job/JobMenu';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

const dummyData = [
  {
  title: '70-hour work week, does it make sense?',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
    filename: 'work-week-guide.pdf',
    backupUrls: [
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
    ]
  },
  {
    title: 'Productivity Tips for Remote Workers',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    filename: 'productivity-tips.pdf',
    backupUrls: [
      'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf',
      'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
    ]
  }
];

const PdfCard = ({ title, url, filename, backupUrls = [] }) => {
  
  // Function to test if URL is accessible
  const testUrlAccessibility = async (testUrl) => {
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.log('URL test failed:', error);
      return false;
    }
  };

  const handleOpenPDF = async () => {
    try {
      // Check if URL is valid
      if (!url) {
        Alert.alert('Error', 'PDF URL not available');
        return;
      }

      // For web URLs, try multiple approaches
      if (url.startsWith('http')) {
        // Show loading message
        Alert.alert('Opening PDF', 'Please wait...');
        
        try {
          // First try: Direct opening without canOpenURL check
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          );
          
          await Promise.race([
            Linking.openURL(url),
            timeoutPromise
          ]);
          
          // If successful, dismiss the loading alert
          // Note: We can't dismiss the alert programmatically, but the user will see the PDF open
          
        } catch (directError) {
          console.log('Direct opening failed, trying alternative methods:', directError);
          
          try {
            // Second try: Check if URL can be opened first (with timeout)
            const canOpenPromise = new Promise((resolve, reject) => 
              setTimeout(() => reject(new Error('canOpenURL timeout')), 3000)
            );
            
            const supported = await Promise.race([
              Linking.canOpenURL(url),
              canOpenPromise
            ]);
            
            if (supported) {
              await Linking.openURL(url);
            } else {
              // Third try: Try opening with different URL format
              const modifiedUrl = url.replace('http://', 'https://');
              await Linking.openURL(modifiedUrl);
            }
          } catch (alternativeError) {
            console.log('Alternative methods failed:', alternativeError);
            
            // Final fallback: Show alert with manual instructions
            Alert.alert(
              'Open PDF',
              'Unable to open PDF automatically. You can copy the URL and open it manually in your browser.',
              [
                {
                  text: 'Copy URL',
                  onPress: () => {
                    Clipboard.setString(url);
                    Alert.alert('Success', 'URL copied to clipboard!');
                  }
                },
                { text: 'OK' }
              ]
            );
          }
        }
      } else {
        // For local files, use FileViewer
        await FileViewer.open(url);
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Failed to open PDF. Please try downloading it instead.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!url) {
        Alert.alert('Error', 'PDF URL not available');
        return;
      }

      // Validate URL format
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        Alert.alert('Error', 'Invalid PDF URL format');
        return;
      }

      // Test URL accessibility before downloading
      Alert.alert('Checking', 'Verifying PDF availability...');
      let workingUrl = url;
      let isUrlAccessible = await testUrlAccessibility(url);
      
      // If primary URL fails, try backup URLs
      if (!isUrlAccessible && backupUrls.length > 0) {
        Alert.alert('Trying Backup', 'Primary URL failed, trying backup URLs...');
        for (const backupUrl of backupUrls) {
          isUrlAccessible = await testUrlAccessibility(backupUrl);
          if (isUrlAccessible) {
            workingUrl = backupUrl;
            break;
          }
        }
      }
      
      if (!isUrlAccessible) {
        Alert.alert('Error', 'PDF file is not accessible. All URLs failed. Please try again later.');
        return;
      }

      // Show loading alert
      Alert.alert('Downloading', 'Please wait while the PDF is being downloaded...');

      // Get the appropriate download directory
      let downloadDir;
      try {
        // Try to get the Downloads directory first
        downloadDir = RNFS.DownloadDirectoryPath;
      } catch (error) {
        console.log('DownloadDirectoryPath not available, using DocumentDirectoryPath');
        // Fallback to Documents directory
        downloadDir = RNFS.DocumentDirectoryPath;
      }

      // Create a unique filename with timestamp to avoid conflicts
      const timestamp = new Date().getTime();
      const uniqueFilename = `${timestamp}_${filename}`;
      const downloadDest = `${downloadDir}/${uniqueFilename}`;

      console.log('Downloading from:', workingUrl);
      console.log('Downloading to:', downloadDest);

      // Download the file with progress tracking
      const downloadResult = await RNFS.downloadFile({
        fromUrl: workingUrl,
        toFile: downloadDest,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(2)}%`);
        },
        progressDivider: 1,
      }).promise;

      console.log('Download result:', downloadResult);

      if (downloadResult.statusCode === 200) {
        // Check if file actually exists
        const fileExists = await RNFS.exists(downloadDest);
        
        if (fileExists) {
          // Get file info
          const fileInfo = await RNFS.stat(downloadDest);
          console.log('File downloaded successfully:', fileInfo);

          // Share the downloaded file
          const shareOptions = {
            title: 'Share PDF',
            message: `Check out this PDF: ${title}`,
            url: `file://${downloadDest}`,
            type: 'application/pdf',
          };

          // Try to share the file, but don't fail if sharing doesn't work
          try {
            await Share.open(shareOptions);
            Alert.alert('Success', 'PDF downloaded and ready to share!');
          } catch (shareError) {
            console.log('Share failed, but file is downloaded:', shareError);
            
            // Show success message with options
            Alert.alert(
              'Download Complete', 
              `PDF downloaded successfully!\n\nFile saved as: ${uniqueFilename}`,
              [
                {
                  text: 'Copy Path',
                  onPress: () => {
                    Clipboard.setString(downloadDest);
                    Alert.alert('Success', 'File path copied to clipboard!');
                  }
                },
                {
                  text: 'Try Share Again',
                  onPress: async () => {
                    try {
                      await Share.open(shareOptions);
                    } catch (retryError) {
                      Alert.alert('Share Failed', 'You can find the file in your Downloads or Documents folder.');
                    }
                  }
                },
                { text: 'OK' }
              ]
            );
          }
        } else {
          Alert.alert('Error', 'File was not downloaded properly');
        }
      } else {
        // Handle different HTTP status codes
        let errorMessage = `Failed to download PDF. Status code: ${downloadResult.statusCode}`;
        
        switch (downloadResult.statusCode) {
          case 404:
            errorMessage = 'PDF file not found. The URL may be incorrect or the file has been moved.';
            break;
          case 403:
            errorMessage = 'Access denied. You may not have permission to download this PDF.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 0:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Download failed with status code: ${downloadResult.statusCode}`;
        }
        
        Alert.alert('Download Error', errorMessage);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to download PDF';
      
      if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('Permission')) {
        errorMessage = 'Permission denied. Please check app permissions.';
      } else if (error.message.includes('ENOENT')) {
        errorMessage = 'File system error. Please try again.';
      }
      
      Alert.alert('Download Error', errorMessage);
    }
  };

  return (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <PDFIconRed />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actionRow}>
          <TouchableOpacity style={styles.openBtn} onPress={handleOpenPDF}>
          <Text style={styles.openBtnText}>Open Now</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadPDF}>
          <DownloadIcon />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
};

const PdfComponent = () => {
  return (
    <>
  <ScrollView style={{ backgroundColor: '#F5F4FD',}}>
    
    <LearningHeader/>
    <View style={{ backgroundColor: '#F5F4FD', paddingBottom: 12 ,flex:1}}>

    <FlatList
      data={dummyData}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => <PdfCard title={item.title} url={item.url} filename={item.filename} backupUrls={item.backupUrls} />}
      contentContainerStyle={{ padding: 10 }}
    />
      </View>
  </ScrollView>
<JobMenu/>
    </>

  );
};

export default PdfComponent;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: '50%',
    // height: 50,
     borderWidth:0.5,
    borderColor:'#D0D0D0',
    backgroundColor: '#ECECF5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingVertical:30,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openBtn: {
    backgroundColor: '#3C3C3C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  openBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  downloadBtn: {
    backgroundColor: '#FF8D53',
    paddingHorizontal:18,
    paddingVertical:8,
    borderRadius: 20,
  },
});
