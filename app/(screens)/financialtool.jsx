import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const calculators = [
  {
    id: 1,
    title: 'Loan Calculator',
    description: 'Calculate monthly loan payments',
    icon: 'calculator'
  },
  {
    id: 2,
    title: 'Savings Goal',
    description: 'Plan your savings targets',
    icon: 'trending-up'
  },
  {
    id: 3,
    title: 'Investment Returns',
    description: 'Calculate potential investment growth',
    icon: 'analytics'
  },
  {
    id: 4,
    title: 'Budget Planner',
    description: 'Plan your monthly budget',
    icon: 'wallet'
  }
]

const CalculatorCard = ({ title, description, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#4a90e2" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
  </TouchableOpacity>
)

export default function Financialtool() {
  const [selectedCalculator, setSelectedCalculator] = useState(null)

  const handleCalculatorPress = (calculator) => {
    setSelectedCalculator(calculator)
    console.log(`Selected calculator: ${calculator.title}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Tools</Text>
        <Text style={styles.subtitle}>Calculate Your Future</Text>
      </View>

      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recent Calculations</Text>
        <View style={styles.recentItem}>
          <Ionicons name="time" size={20} color="#666" />
          <Text style={styles.recentText}>Loan calculation - $250,000</Text>
        </View>
      </View>

      <View style={styles.calculatorsContainer}>
        <Text style={styles.sectionTitle}>Available Calculators</Text>
        {calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.id}
            {...calculator}
            onPress={() => handleCalculatorPress(calculator)}
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
  recentContainer: {
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
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  recentText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  calculatorsContainer: {
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