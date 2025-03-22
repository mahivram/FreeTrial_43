import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const jobListings = [
  {
    id: 1,
    title: 'Software Developer',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    icon: 'code-working'
  },
  {
    id: 2,
    title: 'Marketing Manager',
    company: 'Digital Brands Co.',
    location: 'New York',
    icon: 'megaphone'
  },
  {
    id: 3,
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'San Francisco',
    icon: 'color-palette'
  },
  {
    id: 4,
    title: 'Data Analyst',
    company: 'Data Insights Ltd.',
    location: 'Chicago',
    icon: 'analytics'
  }
]

const JobCard = ({ title, company, location, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#4a90e2" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCompany}>{company}</Text>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={14} color="#666" />
        <Text style={styles.locationText}>{location}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
  </TouchableOpacity>
)

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState(null)

  const handleJobPress = (job) => {
    setSelectedJob(job)
    console.log(`Selected job: ${job.title} at ${job.company}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jobs</Text>
        <Text style={styles.subtitle}>Find Your Next Opportunity</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Application Status</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>
      </View>

      <View style={styles.jobsContainer}>
        <Text style={styles.sectionTitle}>Recent Job Listings</Text>
        {jobListings.map((job) => (
          <JobCard
            key={job.id}
            {...job}
            onPress={() => handleJobPress(job)}
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
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
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
  jobsContainer: {
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
  cardCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
})

