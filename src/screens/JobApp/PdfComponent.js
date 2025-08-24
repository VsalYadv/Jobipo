import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { PDFIconRed,DownloadIcon } from '../JobSvgIcons';
import LearningHeader from '../../components/LearningHeader';
import { ScrollView } from 'react-native';
import JobMenu from '../../components/Job/JobMenu';

const dummyData = Array(2).fill({
  title: '70-hour work week, does it make sense?',
});

const PdfCard = ({ title }) => (

  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <PDFIconRed />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.openBtn}>
          <Text style={styles.openBtnText}>Open Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadBtn}>
          <DownloadIcon />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const PdfComponent = () => {
  return (
    <>
  <ScrollView style={{ backgroundColor: '#F5F4FD',}}>
    
    <LearningHeader/>
    <View style={{ backgroundColor: '#F5F4FD', paddingBottom: 12 ,flex:1}}>

    <FlatList
      data={dummyData}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => <PdfCard title={item.title} />}
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
