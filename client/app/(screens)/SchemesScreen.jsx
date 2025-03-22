import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';
import { Link } from 'expo-router';

const schemes = [
  {
    id: '1',
    title: 'PM Matru Vandana Yojana (PMMVY)',
    type: 'scheme',
    description: 'Maternity benefit program providing financial assistance of ₹5,000 to pregnant women.',
    date: 'Ongoing',
    location: 'All India',
    category: 'Financial Aid',
    website: 'https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana',
    icon: 'mother-nurse',
    color: '#4F46E5',
  },
  {
    id: '2',
    title: 'Nari Adalat Scheme - Gujarat',
    type: 'scheme',
    description: 'Alternative dispute resolution body for women dealing with domestic violence and family matters.',
    date: 'Ongoing',
    location: 'Gujarat',
    category: 'Legal Aid',
    website: 'https://www.gujaratindia.gov.in/state-women-commission',
    icon: 'scale-balance',
    color: '#DC2626',
  },
  {
    id: '3',
    title: 'Mission Shakti Scheme',
    type: 'scheme',
    description: 'Empowering women through safety, security, and financial independence initiatives.',
    date: 'Ongoing',
    location: 'All India',
    category: 'Empowerment',
    website: 'https://wcd.nic.in/mission-shakti',
    icon: 'hand-heart',
    color: '#059669',
  },
  {
    id: '4',
    title: 'Mahila Samridhi Yojana',
    type: 'scheme',
    description: 'Financial assistance and training for women entrepreneurs.',
    date: 'Ongoing',
    location: 'All India',
    category: 'Business',
    website: 'https://www.nsfdc.nic.in/en/mahila-samridhi-yojana-msy-1',
    icon: 'cash-multiple',
    color: '#D97706',
  },
  {
    id: '5',
    title: 'Mahila Shakti Kendra Scheme',
    type: 'scheme',
    description: 'One-stop convergence support services for empowering rural women.',
    date: 'Ongoing',
    location: 'All India',
    category: 'Support',
    website: 'https://wcd.nic.in/schemes/mahila-shakti-kendra',
    icon: 'office-building',
    color: '#7C3AED',
  },
  {
    id: '6',
    title: 'Gangaswaroop Financial Aid - Gujarat',
    type: 'scheme',
    description: 'Financial assistance scheme for widows in Gujarat.',
    date: 'Ongoing',
    location: 'Gujarat',
    category: 'Financial Aid',
    website: 'https://www.gujarat.gov.in/women-child-development',
    icon: 'currency-inr',
    color: '#EA580C',
  },
  {
    id: '7',
    title: 'Working Women Hostel Scheme',
    type: 'scheme',
    description: 'Safe and affordable accommodation for working women.',
    date: 'Ongoing',
    location: 'All India',
    category: 'Housing',
    website: 'https://wcd.nic.in/schemes/working-women-hostel',
    icon: 'home-city',
    color: '#2563EB',
  },
  {
    id: '8',
    title: 'Nari Gaurav Nidhi Scheme - Gujarat',
    type: 'scheme',
    description: 'Educational and skill development support for single mothers.',
    date: 'Ongoing',
    location: 'Gujarat',
    category: 'Education',
    website: 'https://www.gujarat.gov.in/women-child-development',
    icon: 'school',
    color: '#9333EA',
  }
];

const SchemesScreen = () => {
  const handleSchemePress = (scheme) => {
    if (scheme.website) {
      Linking.openURL(scheme.website).catch(err => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Could not open the website. Please try again later.');
      });
    }
  };

  const renderSchemeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.schemeCard}
      onPress={() => handleSchemePress(item)}>
      <View style={[styles.schemeIconContainer, { backgroundColor: `${item.color}15` }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.schemeContent}>
        <View style={styles.schemeHeader}>
          <Text style={styles.schemeTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.schemeTag, { backgroundColor: `${item.color}15` }]}>
            <Text style={[styles.schemeTagText, { color: item.color }]}>
              {item.location === 'Gujarat' ? 'Gujarat' : 'National'}
            </Text>
          </View>
        </View>
        <Text style={styles.schemeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.schemeMeta}>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={14} color={semantic.text.secondary} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="map-marker" size={14} color={semantic.text.secondary} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="tag" size={14} color={semantic.text.secondary} />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={semantic.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Link href="../" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Icon name="arrow-left" size={24} color={semantic.text.primary} />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Government Schemes</Text>
        </View>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}>
          {schemes.map((scheme) => (
            <View key={scheme.id}>
              {renderSchemeItem({ item: scheme })}
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: semantic.background.paper,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  schemeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.background.paper,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  schemeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  schemeContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  schemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  schemeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    flex: 1,
    marginRight: 8,
  },
  schemeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  schemeTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  schemeDescription: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  schemeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: semantic.text.secondary,
    marginLeft: 4,
  },
});

export default SchemesScreen; 