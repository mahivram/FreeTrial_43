import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const THEME_COLORS = {
  primary: '#059669',
  primaryLight: '#ECFDF5',
  secondary: '#666',
  background: '#f5f5f5',
  white: '#ffffff',
  shadow: '#000000'
}

const wellnessActivities = [
  {
    id: 1,
    title: 'Mood Tracking',
    description: 'Monitor your daily emotional well-being',
    icon: 'happy'
  },
  {
    id: 2,
    title: 'Meditation',
    description: 'Guided sessions for mental clarity',
    icon: 'leaf'
  },
  {
    id: 3,
    title: 'Sleep Journal',
    description: 'Track your sleep patterns',
    icon: 'moon'
  },
  {
    id: 4,
    title: 'Stress Relief',
    description: 'Techniques for managing stress',
    icon: 'water'
  }
]

const ActivityCard = ({ title, description, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#4a90e2" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
  </TouchableOpacity>
)

export default function Selfcare() {
  const [selectedActivity, setSelectedActivity] = useState(null)

  const handleActivityPress = (activity) => {
    setSelectedActivity(activity)
    console.log(`Selected activity: ${activity.title}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Self Care</Text>
        <Text style={styles.subtitle}>Your Wellness Journey</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Weekly Wellness Score</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>85</Text>
          <Text style={styles.scoreLabel}>Great</Text>
        </View>
      </View>

      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Wellness Activities</Text>
        {wellnessActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            {...activity}
            onPress={() => handleActivityPress(activity)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: THEME_COLORS.primary,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME_COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_COLORS.white,
    opacity: 0.9,
  },
  statsContainer: {
    margin: 20,
    backgroundColor: THEME_COLORS.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: THEME_COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.primary,
    marginBottom: 15,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primaryLight,
    padding: 15,
    borderRadius: 15,
  },
  score: {
    fontSize: 42,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  scoreLabel: {
    fontSize: 16,
    color: THEME_COLORS.primary,
    marginTop: 8,
    fontWeight: '600',
  },
  activitiesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: THEME_COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    backgroundColor: THEME_COLORS.primaryLight,
    padding: 12,
    borderRadius: 15,
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.primary,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: THEME_COLORS.secondary,
    lineHeight: 20,
  },
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
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  activitiesContainer: {
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
  },
})