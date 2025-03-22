import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const schemes = [
  {
    id: 1,
    title: 'Education Grants',
    description: 'Scholarships and education support programs',
    icon: 'school',
    status: 'Available'
  },
  {
    id: 2,
    title: 'Housing Assistance',
    description: 'Affordable housing and rental support schemes',
    icon: 'home',
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'Employment Programs',
    description: 'Job training and placement assistance',
    icon: 'briefcase',
    status: 'Active'
  },
  {
    id: 4,
    title: 'Healthcare Benefits',
    description: 'Medical assistance and insurance programs',
    icon: 'medical',
    status: 'Available'
  }
]

const SchemeCard = ({ title, description, icon, status, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#4a90e2" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: status === 'Available' ? '#4CAF50' : status === 'Upcoming' ? '#FFC107' : '#2196F3' }]} />
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
  </TouchableOpacity>
)

export default function Governmentschemes() {
  const [selectedScheme, setSelectedScheme] = useState(null)

  const handleSchemePress = (scheme) => {
    setSelectedScheme(scheme)
    console.log(`Selected scheme: ${scheme.title}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Government Schemes</Text>
        <Text style={styles.subtitle}>Available Programs & Benefits</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Applications</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.schemesContainer}>
        <Text style={styles.sectionTitle}>Available Schemes</Text>
        {schemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            {...scheme}
            onPress={() => handleSchemePress(scheme)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    margin: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  schemesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
})