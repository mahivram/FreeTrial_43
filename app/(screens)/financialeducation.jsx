import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const THEME_COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  secondary: '#666',
  background: '#f5f5f5',
  white: '#ffffff',
  shadow: '#000000'
}

const topics = [
  {
    id: 1,
    title: 'Budgeting Basics',
    description: 'Learn how to create and maintain a budget',
    icon: 'wallet'
  },
  {
    id: 2,
    title: 'Investment 101',
    description: 'Understanding investment fundamentals',
    icon: 'trending-up'
  },
  {
    id: 3,
    title: 'Debt Management',
    description: 'Strategies for managing and reducing debt',
    icon: 'card'
  },
  {
    id: 4,
    title: 'Saving Strategies',
    description: 'Smart ways to save money and build wealth',
    icon: 'save'
  }
]

const TopicCard = ({ title, description, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#4a90e2" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
  </TouchableOpacity>
)

export default function Financialeducation() {
  const [selectedTopic, setSelectedTopic] = useState(null)

  const handleTopicPress = (topic) => {
    setSelectedTopic(topic)
    // Here you can add navigation to detailed content or expand the topic
    console.log(`Selected topic: ${topic.title}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Education</Text>
        <Text style={styles.subtitle}>Master Your Money</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '30%' }]} />
        </View>
        <Text style={styles.progressText}>30% Complete</Text>
      </View>

      <View style={styles.topicsContainer}>
        <Text style={styles.sectionTitle}>Learning Topics</Text>
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            {...topic}
            onPress={() => handleTopicPress(topic)}
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
  progressContainer: {
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
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.primary,
    marginBottom: 15,
  },
  progressBar: {
    height: 12,
    backgroundColor: THEME_COLORS.primaryLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: THEME_COLORS.primary,
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  topicsContainer: {
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
  progressContainer: {
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
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  topicsContainer: {
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