import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
  Image,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const BudgetToolsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('income');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: '0',
    icon: 'target',
    color: '#4F46E5',
    category: 'other',
  });
  const [income, setIncome] = useState({
    salary: '',
    sideIncome: '',
    grants: '',
  });
  
  const [expenses, setExpenses] = useState([
    { id: '1', category: 'Housing', amount: '0', icon: 'home', color: '#4F46E5', type: 'essential' },
    { id: '2', category: 'Food', amount: '0', icon: 'food', color: '#059669', type: 'essential' },
    { id: '3', category: 'Transportation', amount: '0', icon: 'car', color: '#DC2626', type: 'essential' },
    { id: '4', category: 'Healthcare', amount: '0', icon: 'medical-bag', color: '#2563EB', type: 'essential' },
    { id: '5', category: 'Entertainment', amount: '0', icon: 'movie', color: '#7C3AED', type: 'leisure' },
    { id: '6', category: 'Shopping', amount: '0', icon: 'shopping', color: '#DB2777', type: 'leisure' },
    { id: '7', category: 'Investments', amount: '0', icon: 'chart-line', color: '#047857', type: 'investment' },
    { id: '8', category: 'Education', amount: '0', icon: 'school', color: '#6366F1', type: 'essential' },
    { id: '9', category: 'Other', amount: '0', icon: 'dots-horizontal', color: '#6B7280', type: 'other' },
  ]);

  const financialGoals = [
    {
      id: '1',
      title: 'Emergency Fund',
      target: 50000,
      current: 20000,
      icon: 'shield-check',
      color: '#4F46E5',
      category: 'emergency',
    },
    {
      id: '2',
      title: 'Child Education',
      target: 200000,
      current: 50000,
      icon: 'school',
      color: '#059669',
      category: 'education',
    },
    {
      id: '3',
      title: 'Business Startup',
      target: 300000,
      current: 75000,
      icon: 'store',
      color: '#DC2626',
      category: 'business',
    },
  ];

  const stockNews = [
    {
      id: '1',
      title: 'NIFTY 50 Hits New High',
      description: 'Indian stock market reaches new milestone with NIFTY 50 crossing 22,000 points',
      date: '2024-02-15',
      trend: 'up',
      change: '+1.2%',
      icon: 'trending-up',
      color: '#059669',
    },
    {
      id: '2',
      title: 'Banking Sector Update',
      description: 'Major banks report strong Q3 earnings, boosting market confidence',
      date: '2024-02-14',
      trend: 'up',
      change: '+0.8%',
      icon: 'bank',
      color: '#4F46E5',
    },
    {
      id: '3',
      title: 'Tech Stocks Rally',
      description: 'IT sector shows strong growth with increased global demand',
      date: '2024-02-13',
      trend: 'up',
      change: '+2.1%',
      icon: 'laptop',
      color: '#7C3AED',
    },
  ];

  const tabs = [
    { id: 'income', title: 'Income & Expenses', icon: 'cash-multiple' },
    { id: 'goals', title: 'Financial Goals', icon: 'target' },
    { id: 'investments', title: 'Investments', icon: 'chart-line' },
    { id: 'insurance', title: 'Insurance', icon: 'shield-check' },
  ];

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}>
              <Icon name="arrow-left" size={20} color={colors.primary.main} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Budget Tools</Text>
              <Text style={styles.headerSubtitle}>Manage your finances wisely</Text>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}>
            <Icon name={tab.icon} size={24} color={activeTab === tab.id ? colors.primary.main : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderIncomeSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="wallet" size={24} color={colors.primary.main} />
        <Text style={styles.sectionTitle}>Income Sources</Text>
      </View>
      <View style={styles.incomeContainer}>
        {Object.entries(income).map(([source, amount]) => (
          <View key={source} style={styles.incomeItem}>
            <View style={styles.incomeLabelContainer}>
              <View style={[styles.incomeIconContainer, { backgroundColor: `${colors.primary.main}15` }]}>
                <Icon 
                  name={source === 'salary' ? 'cash' : 
                        source === 'sideIncome' ? 'store' : 'gift'}
                  size={24} 
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.incomeLabelWrapper}>
                <Text style={styles.incomeLabel}>
                  {source.charAt(0).toUpperCase() + source.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
                <Text style={styles.incomeSubtext}>
                  {source === 'salary' ? 'Monthly salary' : 
                   source === 'sideIncome' ? 'Additional income' : 'Other sources'}
                </Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={(value) => setIncome({ ...income, [source]: value })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.totalContainer]}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Total Monthly Income</Text>
          <Text style={styles.totalSubtext}>Combined from all sources</Text>
        </View>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.currencySymbolLarge}>₹</Text>
          <Text style={[styles.totalAmount, { color: colors.primary.main }]}>
            {Object.values(income).reduce((sum, val) => sum + (Number(val) || 0), 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderExpensesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="credit-card" size={24} color={colors.primary.main} />
        <Text style={styles.sectionTitle}>Expense Categories</Text>
      </View>
      <View style={styles.incomeContainer}>
        {expenses.map(expense => (
          <View key={expense.id} style={styles.incomeItem}>
            <View style={styles.incomeLabelContainer}>
              <View style={[styles.incomeIconContainer, { backgroundColor: `${expense.color}15` }]}>
                <Icon name={expense.icon} size={24} color={expense.color} />
              </View>
              <View style={styles.incomeLabelWrapper}>
                <Text style={styles.incomeLabel}>{expense.category}</Text>
                <Text style={styles.incomeSubtext}>{expense.type}</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                value={expense.amount}
                onChangeText={(value) => {
                  setExpenses(expenses.map(e =>
                    e.id === expense.id ? { ...e, amount: value } : e
                  ));
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.totalContainer, { marginBottom: 40 }]}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalSubtext}>This month</Text>
        </View>
        <View style={styles.totalAmountContainer}>
          <Text style={styles.currencySymbolLarge}>₹</Text>
          <Text style={[styles.totalAmount, { color: '#DC2626' }]}>
            {expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal = {
        id: String(financialGoals.length + 1),
        title: newGoal.title,
        target: Number(newGoal.target),
        current: Number(newGoal.current),
        icon: newGoal.icon,
        color: newGoal.color,
        category: newGoal.category,
      };
      setFinancialGoals([...financialGoals, goal]);
      setShowAddGoalModal(false);
      setNewGoal({
        title: '',
        target: '',
        current: '0',
        icon: 'target',
        color: '#4F46E5',
        category: 'other',
      });
    }
  };

  const renderAddGoalModal = () => (
    <Modal
      visible={showAddGoalModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddGoalModal(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TouchableOpacity
              onPress={() => setShowAddGoalModal(false)}
              style={styles.closeButton}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Goal Title</Text>
            <TextInput
              style={styles.modalInput}
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
              placeholder="Enter goal title"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.modalInput}
                value={newGoal.target}
                onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
                keyboardType="numeric"
                placeholder="Enter target amount"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.modalInput}
                value={newGoal.current}
                onChangeText={(text) => setNewGoal({ ...newGoal, current: text })}
                keyboardType="numeric"
                placeholder="Enter current amount"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              {['emergency', 'education', 'business', 'other'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newGoal.category === category && styles.selectedCategory,
                  ]}
                  onPress={() => setNewGoal({ ...newGoal, category })}>
                  <Text
                    style={[
                      styles.categoryText,
                      newGoal.category === category && styles.selectedCategoryText,
                    ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.addGoalButton}
            onPress={handleAddGoal}>
            <Icon name="plus" size={24} color="#FFFFFF" />
            <Text style={styles.addGoalButtonText}>Add Goal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderFinancialGoals = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Icon name="target" size={24} color={colors.primary.main} />
          <Text style={styles.sectionTitle}>Financial Goals</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddGoalModal(true)}>
          <Icon name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.goalsContainer}>
        {financialGoals.map(goal => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIcon, { backgroundColor: `${goal.color}15` }]}>
                <Icon name={goal.icon} size={24} color={goal.color} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalAmount}>
                  ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(goal.current / goal.target) * 100}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: goal.color }]}>
                {Math.round((goal.current / goal.target) * 100)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
      {renderAddGoalModal()}
    </View>
  );

  const renderStockNews = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="chart-line" size={24} color={colors.primary.main} />
        <Text style={styles.sectionTitle}>Market Updates</Text>
      </View>
      <View style={styles.newsContainer}>
        {stockNews.map(news => (
          <TouchableOpacity key={news.id} style={styles.newsCard}>
            <View style={[styles.newsIcon, { backgroundColor: `${news.color}15` }]}>
              <Icon name={news.icon} size={24} color={news.color} />
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsDescription}>{news.description}</Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsDate}>{new Date(news.date).toLocaleDateString()}</Text>
                <View style={[styles.trendBadge, { backgroundColor: `${news.color}15` }]}>
                  <Icon name={news.trend === 'up' ? 'trending-up' : 'trending-down'} size={16} color={news.color} />
                  <Text style={[styles.trendText, { color: news.color }]}>{news.change}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'income':
        return (
          <>
            {renderIncomeSection()}
            {renderExpensesSection()}
          </>
        );
      case 'goals':
        return renderFinancialGoals();
      case 'investments':
        return renderStockNews();
      case 'insurance':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="shield-check" size={24} color={colors.primary.main} />
              <Text style={styles.sectionTitle}>Insurance Plans</Text>
            </View>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {renderTabs()}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerPlaceholder: {
    width: 36,
  },
  safeHeader: {
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 8,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    minWidth: 140,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  activeTab: {
    backgroundColor: `${colors.primary.main}15`,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: colors.primary.main,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  incomeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  incomeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  incomeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  incomeLabelWrapper: {
    flex: 1,
  },
  incomeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  incomeSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    minWidth: 120,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 4,
  },
  input: {
    width: 120,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
    textAlign: 'right',
  },
  expenseSourceContainer: {
    marginBottom: 24,
  },
  expenseSourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseCategoriesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  expenseCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  expenseCategoryLabel: {
    flex: 1,
  },
  expenseCategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
   
   
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbolLarge: {
    fontSize: 24,
    color: colors.primary.main,
    marginRight: 4,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  comingSoon: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
  goalsContainer: {
    marginTop: 8,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  newsContainer: {
    marginTop: 8,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  newsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  selectedCategory: {
    backgroundColor: `${colors.primary.main}15`,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default BudgetToolsScreen; 