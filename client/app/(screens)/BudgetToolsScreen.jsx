import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

const BudgetToolsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('income');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showSubGoalModal, setShowSubGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newSubGoal, setNewSubGoal] = useState({
    title: '',
    target: '',
    completed: false
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: '0',
    icon: 'target',
    color: '#4F46E5',
    category: 'other',
    subGoals: [],
    tasks: []
  });
  const [tempSubGoal, setTempSubGoal] = useState({
    title: '',
    target: '',
    tasks: '',
    completed: false
  });
  const [income, setIncome] = useState({
    salary: '',
    sideIncome: '',
    grants: '',
  });
  
  const [expenses, setExpenses] = useState([
    { id: '1', category: 'Housing & Utilities', amount: '', icon: 'home', color: '#4F46E5', type: 'essential', description: 'Rent, mortgage, utilities, maintenance' },
    { id: '2', category: 'Daily Expenses', amount: '', icon: 'food', color: '#059669', type: 'essential', description: 'Food, groceries, transportation' },
    { id: '3', category: 'Healthcare', amount: '', icon: 'medical-bag', color: '#2563EB', type: 'essential', description: 'Medical expenses, insurance' },
    { id: '4', category: 'Lifestyle', amount: '', icon: 'shopping', color: '#7C3AED', type: 'non_essential', description: 'Entertainment, shopping, personal care' },
    { id: '5', category: 'Savings', amount: '', icon: 'shield-check', color: '#F59E0B', type: 'savings', description: 'Emergency fund, general savings' },
    { id: '6', category: 'Investments', amount: '', icon: 'chart-line', color: '#047857', type: 'investment', description: 'Stocks, mutual funds, other investments' },
    { id: '7', category: 'Debt Payments', amount: '', icon: 'credit-card', color: '#EF4444', type: 'debt', description: 'Credit cards, loans', interest_rate: 0, minimum_payment: 0 }
  ]);

  const [financialGoals, setFinancialGoals] = useState([
    {
      id: '1',
      title: 'Emergency Fund',
      target: 50000,
      current: 20000,
      icon: 'shield-check',
      color: '#4F46E5',
      category: 'emergency',
      subGoals: [
        { id: '1-1', title: 'First Month Savings', target: 10000, completed: true },
        { id: '1-2', title: 'Second Month Target', target: 20000, completed: true },
        { id: '1-3', title: 'Third Month Goal', target: 20000, completed: false },
      ]
    },
    {
      id: '2',
      title: 'Child Education',
      target: 200000,
      current: 50000,
      icon: 'school',
      color: '#059669',
      category: 'education',
      subGoals: [
        { id: '2-1', title: 'Primary Education Fund', target: 50000, completed: true },
        { id: '2-2', title: 'Secondary Education Fund', target: 75000, completed: false },
        { id: '2-3', title: 'College Fund', target: 75000, completed: false },
      ]
    },
    {
      id: '3',
      title: 'Business Startup',
      target: 300000,
      current: 75000,
      icon: 'store',
      color: '#DC2626',
      category: 'business',
      subGoals: [
        { id: '3-1', title: 'Initial Capital', target: 100000, completed: false },
        { id: '3-2', title: 'Equipment Fund', target: 100000, completed: false },
        { id: '3-3', title: 'Operating Costs', target: 100000, completed: false },
      ]
    },
  ]);

  // Load saved data when component mounts
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [income, expenses, financialGoals]);

  const loadSavedData = async () => {
    try {
      const savedIncome = await AsyncStorage.getItem('budget_income');
      const savedExpenses = await AsyncStorage.getItem('budget_expenses');
      const savedGoals = await AsyncStorage.getItem('budget_goals');

      if (savedIncome) setIncome(JSON.parse(savedIncome));
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        // Ensure each goal has a subGoals array
        const validatedGoals = parsedGoals.map(goal => ({
          ...goal,
          subGoals: goal.subGoals || []
        }));
        setFinancialGoals(validatedGoals);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('budget_income', JSON.stringify(income));
      await AsyncStorage.setItem('budget_expenses', JSON.stringify(expenses));
      await AsyncStorage.setItem('budget_goals', JSON.stringify(financialGoals));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

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

  const addSubGoalToNewGoal = () => {
    if (!tempSubGoal.title || !tempSubGoal.target || !tempSubGoal.tasks) return;

    const tasks = tempSubGoal.tasks.split(',').map(task => task.trim());
    const subGoal = {
      id: `temp-${newGoal.subGoals.length + 1}`,
      title: tempSubGoal.title,
      target: Number(tempSubGoal.target),
      tasks: tasks,
      completed: false
    };

    setNewGoal(prev => ({
      ...prev,
      subGoals: [...prev.subGoals, subGoal]
    }));

    setTempSubGoal({
      title: '',
      target: '',
      tasks: '',
      completed: false
    });
  };

  const removeSubGoalFromNewGoal = (subGoalId) => {
    setNewGoal(prev => ({
      ...prev,
      subGoals: prev.subGoals.filter(sg => sg.id !== subGoalId)
    }));
  };

  const handleAddGoal = async () => {
    if (newGoal.title && newGoal.target) {
      const goal = {
        id: String(financialGoals.length + 1),
        title: newGoal.title,
        target: Number(newGoal.target),
        current: Number(newGoal.current),
        icon: newGoal.icon,
        color: newGoal.color,
        category: newGoal.category,
        subGoals: newGoal.subGoals.map((sg, index) => ({
          ...sg,
          id: `${financialGoals.length + 1}-${index + 1}`
        }))
      };
      const updatedGoals = [...financialGoals, goal];
      setFinancialGoals(updatedGoals);
      setShowAddGoalModal(false);
      setNewGoal({
        title: '',
        target: '',
        current: '0',
        icon: 'target',
        color: '#4F46E5',
        category: 'other',
        subGoals: [],
        tasks: []
      });
    }
  };

  const handleAddSubGoal = () => {
    if (!selectedGoal || !newSubGoal.title || !newSubGoal.target) return;

    const subGoal = {
      id: `${selectedGoal.id}-${selectedGoal.subGoals.length + 1}`,
      title: newSubGoal.title,
      target: Number(newSubGoal.target),
      completed: false
    };

    const updatedGoals = financialGoals.map(goal => {
      if (goal.id === selectedGoal.id) {
        return {
          ...goal,
          subGoals: [...goal.subGoals, subGoal]
        };
      }
      return goal;
    });

    setFinancialGoals(updatedGoals);
    setNewSubGoal({ title: '', target: '', completed: false });
    setShowSubGoalModal(false);
  };

  const handleSubGoalCompletion = (goalId, subGoalId) => {
    const updatedGoals = financialGoals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubGoals = (goal.subGoals || []).map(subGoal => {
          if (subGoal.id === subGoalId) {
            return { ...subGoal, completed: !subGoal.completed };
          }
          return subGoal;
        });
        
        // Calculate new current amount based on completed sub-goals
        const completedAmount = updatedSubGoals
          .filter(sg => sg.completed)
          .reduce((sum, sg) => sum + (sg.target || 0), 0);

        return {
          ...goal,
          current: completedAmount,
          subGoals: updatedSubGoals
        };
      }
      return goal;
    });

    setFinancialGoals(updatedGoals);
  };

  const deleteGoal = (goalId) => {
    const updatedGoals = financialGoals.filter(goal => goal.id !== goalId);
    setFinancialGoals(updatedGoals);
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
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TouchableOpacity
              onPress={() => setShowAddGoalModal(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
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
                  style={[styles.modalInput, { flex: 1, borderWidth: 0, backgroundColor: 'transparent' }]}
                  value={newGoal.target}
                  onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
                  keyboardType="numeric"
                  placeholder="Enter target amount"
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
                    onPress={() => setNewGoal({ ...newGoal, category })}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        newGoal.category === category && styles.selectedCategoryText,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.subGoalsSection}>
              <Text style={[styles.inputLabel, { marginBottom: 16 }]}>Sub-Goals</Text>
              
              <View style={styles.subGoalInputGroup}>
                <TextInput
                  style={styles.modalInput}
                  value={tempSubGoal.title}
                  onChangeText={(text) => setTempSubGoal({ ...tempSubGoal, title: text })}
                  placeholder="Sub-goal title"
                  placeholderTextColor="#9CA3AF"
                />
                
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={[styles.modalInput, { flex: 1, borderWidth: 0, backgroundColor: 'transparent' }]}
                    value={tempSubGoal.target}
                    onChangeText={(text) => setTempSubGoal({ ...tempSubGoal, target: text })}
                    keyboardType="numeric"
                    placeholder="Target amount"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <TextInput
                  style={[styles.modalInput, styles.tasksInput]}
                  value={tempSubGoal.tasks}
                  onChangeText={(text) => setTempSubGoal({ ...tempSubGoal, tasks: text })}
                  placeholder="Enter tasks (comma-separated)"
                  placeholderTextColor="#9CA3AF"
                  multiline
                />

                <TouchableOpacity
                  style={styles.addSubGoalButton}
                  onPress={addSubGoalToNewGoal}
                >
                  <Icon name="plus" size={20} color={colors.primary.main} />
                  <Text style={styles.addSubGoalText}>Add Sub-Goal</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.subGoalsList}>
                {newGoal.subGoals.map((subGoal) => (
                  <View key={subGoal.id} style={styles.subGoalItem}>
                    <View style={styles.subGoalInfo}>
                      <Text style={styles.subGoalTitle}>{subGoal.title}</Text>
                      <Text style={styles.subGoalAmount}>₹{subGoal.target.toLocaleString()}</Text>
                      <View style={styles.tasksList}>
                        {subGoal.tasks.map((task, taskIndex) => (
                          <Text key={taskIndex} style={styles.taskItem}>• {task}</Text>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeSubGoalFromNewGoal(subGoal.id)}
                      style={styles.removeSubGoalButton}
                    >
                      <Icon name="close" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.addGoalButton,
              (!newGoal.title || !newGoal.target) && { opacity: 0.7 }
            ]}
            onPress={handleAddGoal}
            disabled={!newGoal.title || !newGoal.target}
          >
            <Icon name="plus" size={24} color="#FFFFFF" />
            <Text style={styles.addGoalButtonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderSubGoalModal = () => (
    <Modal
      visible={showSubGoalModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSubGoalModal(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Sub-Goal</Text>
            <TouchableOpacity
              onPress={() => setShowSubGoalModal(false)}
              style={styles.closeButton}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Sub-Goal Title</Text>
            <TextInput
              style={styles.modalInput}
              value={newSubGoal.title}
              onChangeText={(text) => setNewSubGoal({ ...newSubGoal, title: text })}
              placeholder="Enter sub-goal title"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Target Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.modalInput}
                value={newSubGoal.target}
                onChangeText={(text) => setNewSubGoal({ ...newSubGoal, target: text })}
                keyboardType="numeric"
                placeholder="Enter target amount"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.addGoalButton}
            onPress={handleAddSubGoal}>
            <Icon name="plus" size={24} color="#FFFFFF" />
            <Text style={styles.addGoalButtonText}>Add Sub-Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        {(financialGoals || []).map(goal => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={[styles.goalIcon, { backgroundColor: `${goal.color}15` }]}>
                <Icon name={goal.icon} size={24} color={goal.color} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalAmount}>
                  ₹{(goal.current || 0).toLocaleString()} / ₹{(goal.target || 0).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteGoal(goal.id)}
                style={styles.deleteGoalButton}>
                <Icon name="delete" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((goal.current || 0) / (goal.target || 1)) * 100}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: goal.color }]}>
                {Math.round(((goal.current || 0) / (goal.target || 1)) * 100)}%
              </Text>
            </View>

            <View style={styles.subGoalsContainer}>
              {(goal.subGoals || []).map(subGoal => (
                <View key={subGoal.id} style={styles.subGoalItem}>
                  <TouchableOpacity
                    style={[
                      styles.subGoalCheckbox,
                      subGoal.completed && styles.subGoalCheckboxCompleted
                    ]}
                    onPress={() => handleSubGoalCompletion(goal.id, subGoal.id)}>
                    {subGoal.completed && <Icon name="check" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <View style={styles.subGoalInfo}>
                    <Text style={styles.subGoalTitle}>{subGoal.title}</Text>
                    <Text style={styles.subGoalAmount}>₹{(subGoal.target || 0).toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addSubGoalButton}
              onPress={() => {
                setSelectedGoal(goal);
                setShowSubGoalModal(true);
              }}>
              <Icon name="plus" size={20} color={goal.color} />
              <Text style={[styles.addSubGoalText, { color: goal.color }]}>Add Sub-Goal</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {renderSubGoalModal()}
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
                  name={source === 'salary' ? 'cash' : source === 'sideIncome' ? 'store' : 'gift'}
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

  const renderExpensesSection = () => {
    const essentialExpenses = expenses.filter(expense => expense.type === 'essential');
    const nonEssentialExpenses = expenses.filter(expense => expense.type === 'non_essential');
    const savingsExpenses = expenses.filter(expense => expense.type === 'savings');
    const debtExpenses = expenses.filter(expense => expense.type === 'debt');

    const renderExpenseGroup = (expenseList, title) => (
      <View style={styles.expenseGroup}>
        <Text style={styles.expenseGroupTitle}>{title}</Text>
        {expenseList.map(expense => (
          <View key={expense.id} style={styles.expenseItem}>
            <View style={styles.expenseHeader}>
              <View style={[styles.expenseIconContainer, { backgroundColor: `${expense.color}15` }]}>
                <Icon name={expense.icon} size={24} color={expense.color} />
              </View>
              <View style={styles.expenseLabelWrapper}>
                <Text style={styles.expenseLabel}>{expense.category}</Text>
                <Text style={styles.expenseSubtext}>{expense.description}</Text>
              </View>
            </View>
            <View style={styles.expenseInputWrapper}>
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
          </View>
        ))}
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>{title} Total:</Text>
          <View style={styles.subtotalAmountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.subtotalAmount}>
              {expenseList.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );

        return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="credit-card" size={24} color={colors.primary.main} />
          <Text style={styles.sectionTitle}>Expense Categories</Text>
        </View>
        <View style={styles.expensesContainer}>
          {renderExpenseGroup(essentialExpenses, "Essential Expenses")}
          {renderExpenseGroup(nonEssentialExpenses, "Non-Essential Expenses")}
          {renderExpenseGroup(savingsExpenses, "Savings")}
          {renderExpenseGroup(debtExpenses, "Debt Payments")}
        </View>
        <View style={[styles.totalContainer, { marginBottom: 40 }]}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Total Monthly Expenses</Text>
            <Text style={styles.totalSubtext}>Including all expenses & payments</Text>
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
  };

  const handleSaheliSuggestion = () => {
    // Collect all the data
    const budgetData = {
      income: {
        ...income,
        totalIncome: Object.values(income).reduce((sum, val) => sum + (Number(val) || 0), 0)
      },
      expenses: {
        essential: expenses.filter(e => e.type === 'essential').map(e => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          description: e.description
        })),
        nonEssential: expenses.filter(e => e.type === 'non_essential').map(e => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          description: e.description
        })),
        savings: expenses.filter(e => e.type === 'savings').map(e => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          description: e.description
        })),
        debts: expenses.filter(e => e.type === 'debt').map(e => ({
          category: e.category,
          amount: Number(e.amount) || 0,
          description: e.description,
          interest_rate: e.interest_rate,
          minimum_payment: e.minimum_payment
        }))
      },
      totalExpenses: expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0),
      financialGoals: financialGoals
    };

    // Navigate to Saheli AI with the data
    router.push({
      pathname: '/SaheliAi',
      params: {
        budgetData: JSON.stringify(budgetData)
      }
    });
  };

  const renderIncomeAndExpensesContent = () => (
    <ScrollView style={styles.contentContainer}>
            {renderIncomeSection()}
            {renderExpensesSection()}
      <View style={styles.saheliButtonContainer}>
        <TouchableOpacity
          style={styles.saheliButton}
          onPress={handleSaheliSuggestion}
        >
          <Icon name="robot" size={24} color="#FFFFFF" />
          <Text style={styles.saheliButtonText}>Get Saheli AI Suggestion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'income':
        return renderIncomeAndExpensesContent();
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
    fontSize: 20,
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
    marginTop: 4,
  },
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 4,
  },
  tabsScrollContent: {
    paddingHorizontal: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    minWidth: 120,
    justifyContent: 'center',
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
    paddingVertical: 8,
  },
  section: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  incomeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  incomeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  incomeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  incomeLabelWrapper: {
    flex: 1,
  },
  incomeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  incomeSubtext: {
    fontSize: 13,
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
  expenseGroup: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  expenseGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 6,
  },
  expenseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  expenseLabelWrapper: {
    flex: 1,
  },
  expenseLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  expenseSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
  expenseInputWrapper: {
    alignItems: 'flex-end',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subtotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtotalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
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
    fontSize: 24,
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
    maxHeight: '90%',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalScrollView: {
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 48,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    minHeight: 48,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategory: {
    backgroundColor: `${colors.primary.main}15`,
    borderColor: colors.primary.main,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  subGoalsSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  subGoalInputGroup: {
    gap: 16,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tasksInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  subGoalsList: {
    gap: 12,
    marginTop: 16,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subGoalInfo: {
    flex: 1,
    marginRight: 12,
  },
  subGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subGoalAmount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  tasksList: {
    marginTop: 8,
  },
  taskItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 20,
  },
  addSubGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  addSubGoalText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  removeSubGoalButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
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
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  submitContainer: {
    padding: 16,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  expensesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  debtItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  debtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  debtDetailsContainer: {
    gap: 12,
  },
  debtDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtDetailLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  debtInput: {
    width: 150,
    backgroundColor: '#FFFFFF',
  },
  percentageSymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  saheliButtonContainer: {
    padding: 16,
    marginBottom: 24,
  },
  saheliButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saheliButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteGoalButton: {
    padding: 8,
  },
  subGoalsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  subGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subGoalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subGoalCheckboxCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  subGoalInfo: {
    flex: 1,
  },
  subGoalTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  subGoalAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
  addSubGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addSubGoalText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalScrollView: {
    maxHeight: '90%',
  },
  subGoalsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  subGoalInputGroup: {
    gap: 12,
    marginBottom: 16,
  },
  tasksInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  subGoalsList: {
    gap: 12,
  },
  tasksList: {
    marginTop: 8,
  },
  taskItem: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  removeSubGoalButton: {
    padding: 8,
  },
});

export default BudgetToolsScreen; 