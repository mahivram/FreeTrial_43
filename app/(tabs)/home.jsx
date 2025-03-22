import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";

const THEME_COLORS = {
  primary: "#4F46E5",
  secondary: "#2563EB",
  success: "#059669",
  purple: "#9333EA",
  violet: "#7C3AED",
  background: "#F9FAFB",
  paper: "#FFFFFF",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
  },
};

export default function Home() {
  const mainCategories = [
    {
      id: "1",
      title: "Financial Education",
      description: "Learn smart money management",
      icon: "school",
      color: THEME_COLORS.primary,
      bgColor: "#EEF2FF",
      href: "/(screens)/financialeducation",
    },
    {
      id: "2",
      title: "Financial Tools",
      description: "Budget planning & tracking",
      icon: "calculator",
      color: THEME_COLORS.secondary,
      bgColor: "#DBEAFE",
      href: "/(screens)/financialtool",
    },
    {
      id: "3",
      title: "Self Care",
      description: "Mental & physical wellness tips",
      icon: "heart",
      color: THEME_COLORS.success,
      bgColor: "#ECFDF5",
      href: "/(screens)/selfcare",
    },
    {
      id: "4",
      title: "Jobs",
      description: "Find your next opportunity",
      icon: "briefcase",
      color: THEME_COLORS.purple,
      bgColor: "#F3E8FF",
      href: "/(screens)/jobs",
    },
  ];

  const renderCategoryCard = ({ item }) => (
    <Link href={item.href} asChild>
      <TouchableOpacity
        style={StyleSheet.flatten([styles.categoryCard, { backgroundColor: item.bgColor }])}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.categoryIconContainer,
            { backgroundColor: item.color + "20" },
          ]}
        >
          <Icon name={item.icon} size={32} color={item.color} />
        </View>
        <Text style={[styles.categoryTitle, { color: item.color }]}>
          {item.title}
        </Text>
        <Text style={styles.categoryDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryArrow}>
          <Icon name="arrow-right" size={20} color={item.color} />
        </View>
      </TouchableOpacity>
    </Link>
  );
  

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar backgroundColor={THEME_COLORS.paper} barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="account-circle" size={40} color={THEME_COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        {mainCategories.map((category) => (
          <View key={category.id} style={styles.categoryWrapper}>
            {renderCategoryCard({ item: category })}
          </View>
        ))}
      </View>

      <View style={styles.additionalResourcesContainer}>
        <Link href="/(screens)/governmentschemes" asChild>
          <TouchableOpacity style={styles.schemesButton} activeOpacity={0.7}>
            <View style={styles.schemesContent}>
              <View style={styles.schemesIconContainer}>
                <Icon name="bank" size={32} color={THEME_COLORS.violet} />
              </View>
              <View style={styles.schemesTextContainer}>
                <Text style={styles.schemesTitle}>Government Schemes</Text>
                <Text style={styles.schemesDescription}>
                  Access government schemes & benefits
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={THEME_COLORS.violet} />
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 12,
    backgroundColor: THEME_COLORS.paper,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: THEME_COLORS.text.primary,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
    fontWeight: "500",
  },
  profileButton: {
    padding: 12,
    backgroundColor: THEME_COLORS.primaryLight,
    borderRadius: 24,
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  categoryCard: {
    padding: 8,
    
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 200,
    justifyContent: "space-between",
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
  
    fontWeight: "800",
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: THEME_COLORS.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryArrow: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  additionalResourcesContainer: {
    marginBottom: 20,
  },
  schemesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME_COLORS.paper,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  schemesContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  schemesIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  schemesTextContainer: {
    flex: 1,
  },
  schemesTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME_COLORS.text.primary,
    marginBottom: 6,
  },
  schemesDescription: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    lineHeight: 20,
  },
  additionalResourcesContainer: {
    width: "100%",
    marginBottom: 16,
  },
  schemesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLORS.paper,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  schemesContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  schemesIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  schemesTextContainer: {
    flex: 1,
  },
  schemesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME_COLORS.text.primary,
    marginBottom: 4,
  },
  schemesDescription: {
    fontSize: 15,
    color: THEME_COLORS.text.secondary,
    lineHeight: 20,
  },
});
