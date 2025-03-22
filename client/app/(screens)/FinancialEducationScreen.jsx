import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';
import VideoPlayer from '../components/VideoPlayer';
import { Link, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Add levels array at the top with other constants
const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

const FinancialEducationScreen = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('modules');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [activeVideoLevel, setActiveVideoLevel] = useState('beginner');

  // New state variables for points and progress
  const [userPoints, setUserPoints] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [unlockedLevels, setUnlockedLevels] = useState(['beginner']);

  // Points required to unlock each level
  const levelRequirements = {
    intermediate: 100,
    advanced: 250,
    expert: 500
  };

  const educationModules = {
    basics: {
      title: 'Financial Basics',
      lessons: [
        {
          id: '1',
          title: 'Understanding Money',
          description: 'Learn about money, its functions, and value',
          duration: '10 min',
          topics: [
            'What is money?',
            'Functions of money',
            'Types of money',
            'Value of money'
          ]
        },
        {
          id: '2',
          title: 'Budgeting 101',
          description: 'Master the basics of budgeting and financial planning',
          duration: '15 min',
          topics: [
            'Creating a budget',
            'Income and expenses',
            'Tracking spending',
            'Setting financial goals'
          ]
        },
        {
          id: '3',
          title: 'Saving Strategies',
          description: 'Effective ways to save money and build wealth',
          duration: '12 min',
          topics: [
            'Importance of saving',
            'Different types of savings',
            'Setting saving goals',
            'Automating savings'
          ]
        }
      ]
    },
    investment: {
      title: 'Investment Knowledge',
      lessons: [
        {
          id: '4',
          title: 'Investment Basics',
          description: 'Introduction to different investment options',
          duration: '15 min',
          topics: [
            'Types of investments',
            'Risk and return',
            'Diversification',
            'Investment strategies'
          ]
        },
        {
          id: '5',
          title: 'Stock Market Basics',
          description: 'Understanding how the stock market works',
          duration: '20 min',
          topics: [
            'What are stocks?',
            'Stock exchanges',
            'Buying and selling stocks',
            'Market analysis'
          ]
        }
      ]
    },
    credit: {
      title: 'Credit & Loans',
      lessons: [
        {
          id: '6',
          title: 'Understanding Credit',
          description: 'Learn about credit scores and credit management',
          duration: '15 min',
          topics: [
            'What is credit?',
            'Credit scores',
            'Building good credit',
            'Managing credit cards'
          ]
        },
        {
          id: '7',
          title: 'Loan Management',
          description: 'Smart borrowing and loan management strategies',
          duration: '12 min',
          topics: [
            'Types of loans',
            'Interest rates',
            'Loan terms',
            'Repayment strategies'
          ]
        }
      ]
    }
  };

  const moduleCategories = [
    {
      id: 'basics',
      title: 'Financial Basics',
      icon: 'cash-multiple',
      color: '#4F46E5'
    },
    {
      id: 'investment',
      title: 'Investment',
      icon: 'chart-line',
      color: '#059669'
    },
    {
      id: 'credit',
      title: 'Credit & Loans',
      icon: 'credit-card',
      color: '#DC2626'
    }
  ];

  // Module content for each topic
  const moduleContent = {
    emergencyFund: {
      title: "Emergency Fund",
      pages: [
        {
          title: "What is an Emergency Fund?",
          content: "An emergency fund is money you set aside specifically for unexpected expenses or financial emergencies. It acts as a financial safety net to help you avoid going into debt when unexpected costs arise.\n\nKey Components:\n• Liquid savings readily available\n• Separate from regular savings\n• No investment risk\n• Easy to access\n\nPurpose:\n• Financial security\n• Peace of mind\n• Risk management\n• Debt prevention\n\nCommon Uses:\n• Medical emergencies\n• Job loss\n• Car repairs\n• Home repairs\n• Family emergencies",
        },
        {
          title: "Why Do You Need One?",
          content: "Emergency funds provide essential financial protection and reduce stress during unexpected situations.\n\nKey Benefits:\n\n1. Financial Security\n• Protection against job loss\n• Coverage for medical emergencies\n• Buffer for unexpected repairs\n• Prevention of debt accumulation\n\n2. Mental Well-being\n• Reduced financial stress\n• Better sleep and peace of mind\n• Improved decision-making\n• Greater confidence\n\n3. Financial Freedom\n• Flexibility in career choices\n• Ability to take calculated risks\n• Independence from credit\n• Better negotiating position\n\n4. Long-term Advantages\n• Better credit scores\n• Lower insurance costs\n• Improved investment decisions\n• Enhanced financial stability",
        },
        {
          title: "How Much Should You Save?",
          content: "Your emergency fund size depends on your personal circumstances and financial obligations.\n\nRecommended Targets by Stage:\n\n1. Starter Emergency Fund\n• Goal: ₹10,000 - ₹25,000\n• Timeline: 3-6 months\n• Purpose: Handle small emergencies\n\n2. Basic Emergency Fund\n• Goal: 3 months of expenses\n• Calculation: Monthly expenses × 3\n• Coverage: Basic necessities\n\n3. Comprehensive Emergency Fund\n• Goal: 6 months of expenses\n• Additional buffers for dependents\n• Coverage: All living expenses\n\nExpense Categories to Consider:\n1. Essential Expenses\n• Housing (rent/mortgage)\n• Utilities\n• Food and groceries\n• Transportation\n• Insurance premiums\n• Healthcare\n\n2. Regular Bills\n• Phone and internet\n• Subscriptions\n• Minimum debt payments\n• Child care\n\n3. Variable Expenses\n• Maintenance costs\n• Seasonal expenses\n• Personal care\n• Basic entertainment",
        },
        {
          title: "Where to Keep It?",
          content: "Your emergency fund should balance accessibility with modest returns.\n\nBest Options:\n\n1. High-yield Savings Account\nAdvantages:\n• Immediate access\n• FDIC/DICGC insurance\n• Better interest rates\n• No market risk\n\nConsiderations:\n• Compare interest rates\n• Check account fees\n• Online vs. traditional banks\n• Minimum balance requirements\n\n2. Money Market Account\nBenefits:\n• Higher interest rates\n• Check writing capability\n• ATM access\n• Professional management\n\nLimitations:\n• Minimum balance rules\n• Transaction limits\n• Potential fees\n• Withdrawal restrictions\n\n3. Short-term Fixed Deposits\nAdvantages:\n• Better interest rates\n• Structured saving\n• Flexible tenures\n• Auto-renewal options\n\nStrategy:\n• Ladder multiple FDs\n• Stagger maturity dates\n• Keep some funds liquid\n• Balance accessibility",
        },
        {
          title: "Building Your Fund",
          content: "Create a systematic approach to build your emergency fund.\n\n1. Initial Steps\nAssess Current Situation:\n• Calculate monthly expenses\n• Review current savings\n• Identify saving opportunities\n• Set realistic goals\n\n2. Saving Strategies\nAutomate Savings:\n• Direct deposit splits\n• Automatic transfers\n• Round-up programs\n• Savings apps\n\nFind Extra Money:\n• Reduce expenses\n• Sell unused items\n• Side gigs\n• Overtime work\n• Tax refunds\n• Bonuses\n\n3. Accelerate Growth\nOptimize Income:\n• Ask for a raise\n• Develop skills\n• Freelance work\n• Part-time jobs\n\nReduce Expenses:\n• Cut unnecessary subscriptions\n• Negotiate bills\n• Energy efficiency\n• Smart shopping\n\n4. Maintain and Monitor\nRegular Review:\n• Track progress monthly\n• Adjust goals as needed\n• Rebalance allocations\n• Update for life changes\n\nProtect Your Fund:\n• Avoid temptation to spend\n• Replace used funds\n• Regular account monitoring\n• Maintain separate accounts",
        },
      ]
    },
    goalSetting: {
      title: "Financial Goal Setting",
      pages: [
        {
          title: "Understanding Financial Goals",
          content: "Financial goals are specific targets you want to achieve with your money. They give direction to your financial decisions and help measure progress. Types of goals include:\n\n• Short-term (1 year or less)\n• Medium-term (1-5 years)\n• Long-term (5+ years)\n\nEach type requires different planning and saving strategies.",
        },
        {
          title: "Setting SMART Goals",
          content: "Use the SMART framework for effective goal setting:\n\nS - Specific: Clear and well-defined\nM - Measurable: Track progress with numbers\nA - Achievable: Realistic within your means\nR - Relevant: Aligned with your values\nT - Time-bound: Set deadlines\n\nExample: Save ₹50,000 for a down payment in 12 months",
        },
        {
          title: "Creating an Action Plan",
          content: "Break down your goals into actionable steps:\n\n1. Calculate required monthly savings\n2. Identify potential obstacles\n3. Create a timeline with milestones\n4. Set up tracking systems\n5. Plan for setbacks\n\nUse tools like spreadsheets or apps to monitor progress and stay motivated.",
        },
        {
          title: "Prioritizing Multiple Goals",
          content: "Balance multiple financial goals effectively:\n\n1. Emergency fund first\n2. High-interest debt reduction\n3. Retirement savings\n4. Other specific goals\n\nConsider:\n• Urgency of each goal\n• Available resources\n• Impact on long-term financial health\n• Risk tolerance",
        },
        {
          title: "Staying on Track",
          content: "Maintain momentum towards your goals:\n\n1. Regular Review\n• Monthly progress checks\n• Quarterly goal assessment\n• Annual planning\n\n2. Adjustments\n• Update goals as needed\n• Revise strategies\n• Account for life changes\n\n3. Motivation\n• Visualize success\n• Share goals with supporters\n• Reward progress milestones",
        },
      ]
    },
    stockMarket: {
      title: "Stock Market Basics",
      pages: [
        {
          title: "Understanding Stocks",
          content: "Foundation concepts of stock market investing.\n\n1. What are Stocks?\nBasic Concepts:\n• Company ownership\n• Share types\n• Market value\n• Voting rights\n\nTypes of Stocks:\n• Common stocks\n• Preferred stocks\n• Growth stocks\n• Value stocks\n• Blue-chip stocks\n\n2. Stock Markets\nMarket Structure:\n• Stock exchanges\n• Trading hours\n• Market indices\n• Market makers\n\nParticipants:\n• Investors\n• Traders\n• Brokers\n• Regulators\n\n3. Stock Pricing\nPrice Factors:\n• Company performance\n• Market sentiment\n• Economic conditions\n• Industry trends\n\nValuation Metrics:\n• P/E ratio\n• EPS\n• Book value\n• Dividend yield",
        },
        {
          title: "Market Analysis",
          content: "Methods to analyze and evaluate stocks.\n\n1. Fundamental Analysis\nCompany Analysis:\n• Financial statements\n• Business model\n• Management team\n• Competitive position\n\nFinancial Metrics:\n• Revenue growth\n• Profit margins\n• Debt levels\n• Cash flow\n\n2. Technical Analysis\nPrice Patterns:\n• Trend lines\n• Support/resistance\n• Chart patterns\n• Volume analysis\n\nTechnical Indicators:\n• Moving averages\n• RSI\n• MACD\n• Bollinger Bands\n\n3. Market Research\nInformation Sources:\n• Company reports\n• Financial news\n• Analyst reports\n• Industry data\n\nResearch Process:\n• Data collection\n• Analysis methods\n• Documentation\n• Regular updates",
        },
        {
          title: "Trading Basics",
          content: "Essential knowledge for stock trading.\n\n1. Order Types\nBasic Orders:\n• Market orders\n• Limit orders\n• Stop orders\n• Stop-limit orders\n\nAdvanced Orders:\n• Good-till-cancelled\n• All-or-none\n• Fill-or-kill\n• Trailing stops\n\n2. Trading Process\nAccount Setup:\n• Choose broker\n• Account type\n• Funding methods\n• Trading platform\n\nExecution:\n• Place orders\n• Monitor positions\n• Track performance\n• Maintain records\n\n3. Trading Costs\nDirect Costs:\n• Brokerage fees\n• Transaction charges\n• Taxes\n• Platform fees\n\nIndirect Costs:\n• Spread costs\n• Slippage\n• Opportunity cost\n• Time value",
        },
        {
          title: "Risk Management",
          content: "Strategies to manage investment risks.\n\n1. Types of Risk\nMarket Risks:\n• Price volatility\n• Market cycles\n• Sector risks\n• Global events\n\nCompany Risks:\n• Business risk\n• Financial risk\n• Management risk\n• Operational risk\n\n2. Risk Mitigation\nDiversification:\n• Asset allocation\n• Sector spread\n• Geographic mix\n• Investment size\n\nProtective Strategies:\n• Stop losses\n• Position sizing\n• Portfolio rebalancing\n• Regular monitoring\n\n3. Portfolio Management\nConstruction:\n• Risk tolerance\n• Time horizon\n• Investment goals\n• Asset mix\n\nMaintenance:\n• Regular review\n• Rebalancing\n• Performance tracking\n• Strategy updates",
        },
        {
          title: "Advanced Concepts",
          content: "Advanced stock market topics and strategies.\n\n1. Investment Strategies\nTrading Styles:\n• Day trading\n• Swing trading\n• Position trading\n• Value investing\n\nAdvanced Techniques:\n• Margin trading\n• Short selling\n• Options trading\n• Derivatives\n\n2. Market Psychology\nBehavioral Factors:\n• Fear and greed\n• Market sentiment\n• Crowd psychology\n• Decision biases\n\nEmotional Control:\n• Trading discipline\n• Risk management\n• Strategy adherence\n• Performance review\n\n3. Professional Tools\nAnalysis Tools:\n• Screening tools\n• Charting software\n• Research platforms\n• Portfolio trackers\n\nTrading Platforms:\n• Order execution\n• Real-time data\n• Analysis tools\n• Risk management",
        }
      ]
    },
    mutualFunds: {
      title: "Mutual Funds",
      pages: [
        {
          title: "Understanding Mutual Funds",
          content: "A comprehensive introduction to mutual funds and their role in investing.\n\n1. What are Mutual Funds?\nBasic Concept:\n• Pooled investment vehicle\n• Professional management\n• Diversified portfolio\n• Regulated structure\n\nKey Benefits:\n• Professional expertise\n• Risk diversification\n• Lower investment threshold\n• High liquidity\n• Transparency\n\n2. Types of Mutual Funds\nBy Investment Objective:\n• Growth funds\n• Income funds\n• Balanced funds\n• Tax-saving funds\n• Index funds\n\nBy Asset Class:\n• Equity funds\n• Debt funds\n• Hybrid funds\n• Money market funds\n• Commodity funds\n\n3. Fund Structure\nKey Components:\n• Asset Management Company\n• Trustees\n• Custodian\n• Transfer Agent\n• Unit holders",
        },
        {
          title: "Investment Process",
          content: "Step-by-step guide to investing in mutual funds.\n\n1. Account Setup\nRequired Documents:\n• PAN card\n• Address proof\n• Bank account\n• KYC verification\n• Demat account (optional)\n\nInvestment Modes:\n• Online platforms\n• Fund house directly\n• Financial advisors\n• Banking channels\n\n2. Investment Options\nSIP Benefits:\n• Rupee cost averaging\n• Disciplined investing\n• Lower market risk\n• Power of compounding\n\nLump Sum Benefits:\n• Market timing\n• Lower transaction costs\n• Immediate deployment\n• Better for large amounts\n\n3. Fund Selection\nResearch Process:\n• Investment objective\n• Fund category\n• Past performance\n• Fund manager track record\n• Expense ratio\n• Exit load",
        },
        {
          title: "Risk and Returns",
          content: "Understanding the risk-return relationship in mutual funds.\n\n1. Return Components\nTypes of Returns:\n• Capital appreciation\n• Dividend income\n• Interest income\n• Tax benefits\n\nPerformance Metrics:\n• Absolute returns\n• CAGR\n• Rolling returns\n• Risk-adjusted returns\n\n2. Risk Factors\nMarket Risks:\n• Equity market risk\n• Interest rate risk\n• Credit risk\n• Liquidity risk\n\nOperational Risks:\n• Fund manager risk\n• Concentration risk\n• Style drift\n• Regulatory risk\n\n3. Risk Management\nDiversification Strategies:\n• Asset allocation\n• Sector spread\n• Market cap distribution\n• Geographic diversification\n\nMonitoring Tools:\n• Performance tracking\n• Risk metrics\n• Portfolio analysis\n• Rebalancing triggers",
        },
        {
          title: "Advanced Concepts",
          content: "Deep dive into sophisticated mutual fund concepts.\n\n1. Portfolio Analysis\nKey Metrics:\n• Alpha and Beta\n• Sharpe ratio\n• Standard deviation\n• R-squared\n• Information ratio\n\nPortfolio Characteristics:\n• Market capitalization\n• P/E ratio\n• Dividend yield\n• Sector weights\n• Credit quality\n\n2. Tax Implications\nEquity Funds:\n• LTCG rules\n• STCG rates\n• Dividend taxation\n• Tax harvesting\n\nDebt Funds:\n• Indexation benefits\n• TDS rules\n• Capital gains\n• Tax efficiency\n\n3. Market Timing\nTiming Strategies:\n• Economic cycles\n• Market indicators\n• Valuation metrics\n• Momentum factors\n\nRebalancing:\n• Periodic review\n• Threshold-based\n• Risk-based\n• Goal-based",
        },
        {
          title: "Investment Strategies",
          content: "Advanced strategies for mutual fund investing.\n\n1. Core-Satellite Approach\nCore Portfolio:\n• Index funds\n• Large-cap funds\n• Balanced funds\n• Low-cost options\n\nSatellite Portfolio:\n• Sector funds\n• Mid/small-cap funds\n• International funds\n• Thematic funds\n\n2. Goal-Based Investing\nShort-term Goals:\n• Liquid funds\n• Ultra-short funds\n• Low-duration funds\n\nLong-term Goals:\n• Equity funds\n• Balanced funds\n• ELSS funds\n• Retirement funds\n\n3. Advanced Techniques\nDynamic Strategies:\n• Asset allocation funds\n• Multi-asset funds\n• Arbitrage funds\n• Fund of funds\n\nSpecialized Approaches:\n• Factor investing\n• Smart beta funds\n• Quant funds\n• ESG investing",
        }
      ]
    },
    healthInsurance: {
      title: "Health Insurance",
      pages: [
        {
          title: "Basics of Health Insurance",
          content: "Health insurance protects against medical expenses. Key components:\n\n1. Coverage Types\n• Individual plans\n• Family floater\n• Group insurance\n• Critical illness\n\n2. Benefits\n• Hospitalization coverage\n• Pre/post hospitalization\n• Ambulance charges\n• Preventive care\n\n3. Policy Terms\n• Sum insured\n• Premium payments\n• Waiting periods\n• Network hospitals",
        },
        {
          title: "Types of Coverage",
          content: "Understanding policy features:\n\n1. Basic Coverage\n• In-patient treatment\n• Day care procedures\n• Room rent limits\n• ICU charges\n\n2. Additional Coverage\n• Maternity benefits\n• Dental care\n• Vision care\n• Alternative treatments\n\n3. Add-on Options\n• Personal accident\n• Hospital cash\n• Recovery benefit\n• International coverage",
        },
        {
          title: "Choosing a Plan",
          content: "Factors to consider:\n\n1. Personal Needs\n• Age and health\n• Family size\n• Medical history\n• Lifestyle factors\n\n2. Policy Features\n• Coverage amount\n• Network hospitals\n• Claim settlement ratio\n• Sub-limits\n\n3. Cost Factors\n• Premium affordability\n• Co-payment options\n• Deductibles\n• Long-term costs",
        },
        {
          title: "Claims Process",
          content: "Understanding claims:\n\n1. Cashless Claims\n• Network hospitals\n• Pre-authorization\n• Documentation\n• Settlement time\n\n2. Reimbursement Claims\n• Original bills\n• Medical reports\n• Claim forms\n• Follow-up process\n\n3. Common Rejections\n• Pre-existing conditions\n• Waiting period\n• Policy exclusions\n• Incomplete documents",
        },
        {
          title: "Maximizing Benefits",
          content: "Get the most from your policy:\n\n1. Preventive Care\n• Regular check-ups\n• Health screenings\n• Wellness programs\n\n2. Policy Management\n• Timely renewals\n• Premium payments\n• Policy updates\n\n3. Tax Benefits\n• Section 80D\n• Premium deductions\n• Family coverage\n\n4. Regular Review\n• Coverage adequacy\n• New features\n• Better options",
        },
      ]
    },
    propertyInsurance: {
      title: "Property Insurance",
      pages: [
        {
          title: "Property Insurance Fundamentals",
          content: "Essential concepts of property insurance protection.\n\n1. Coverage Types\nResidential Coverage:\n• Building structure\n• Contents coverage\n• Personal liability\n• Additional living expenses\n\nCommercial Coverage:\n• Building insurance\n• Business interruption\n• Equipment breakdown\n• Liability protection\n\n2. Policy Components\nBasic Elements:\n• Sum insured\n• Premium calculation\n• Policy period\n• Deductibles\n\nEndorsements:\n• Additional coverage\n• Policy modifications\n• Special conditions\n• Coverage extensions",
        },
        {
          title: "Risk Assessment",
          content: "Understanding and evaluating property risks.\n\n1. Property Valuation\nValuation Methods:\n• Market value\n• Replacement cost\n• Actual cash value\n• Agreed value\n\nFactors Considered:\n• Location\n• Construction type\n• Age of property\n• Safety features\n• Usage pattern\n\n2. Risk Factors\nNatural Risks:\n• Floods\n• Earthquakes\n• Storms\n• Lightning\n\nMan-made Risks:\n• Fire\n• Theft\n• Vandalism\n• Accidents\n\n3. Risk Mitigation\nSafety Measures:\n• Fire protection\n• Security systems\n• Building maintenance\n• Emergency planning\n\nDocumentation:\n• Property inventory\n• Maintenance records\n• Safety certificates\n• Inspection reports",
        },
        {
          title: "Claims Process",
          content: "Detailed guide to property insurance claims.\n\n1. Immediate Actions\nEmergency Response:\n• Safety measures\n• Damage control\n• Authority notification\n• Evidence collection\n\nClaim Initiation:\n• Insurance notification\n• Police report\n• Documentation\n• Preliminary assessment\n\n2. Documentation\nRequired Documents:\n• Claim forms\n• Damage photos\n• Repair estimates\n• Purchase receipts\n• Inventory list\n\nSupporting Evidence:\n• Witness statements\n• Expert reports\n• Maintenance records\n• Previous claims\n\n3. Settlement Process\nClaim Evaluation:\n• Adjuster inspection\n• Damage assessment\n• Coverage verification\n• Cost estimation\n\nSettlement Options:\n• Repair/replacement\n• Cash settlement\n• Partial settlement\n• Depreciation handling",
        },
        {
          title: "Policy Management",
          content: "Effective management of property insurance policies.\n\n1. Policy Review\nAnnual Assessment:\n• Coverage adequacy\n• Premium review\n• Policy updates\n• Risk changes\n\nCoverage Updates:\n• Property improvements\n• Value changes\n• Usage modifications\n• New acquisitions\n\n2. Cost Management\nPremium Reduction:\n• Safety discounts\n• Multi-policy discounts\n• Claims-free bonus\n• Higher deductibles\n\nCost Optimization:\n• Coverage comparison\n• Market research\n• Bundle options\n• Payment plans\n\n3. Compliance\nRegulatory Requirements:\n• Mandatory coverage\n• Documentation\n• Reporting\n• Renewals\n\nBest Practices:\n• Regular updates\n• Record keeping\n• Policy review\n• Risk assessment",
        },
        {
          title: "Special Considerations",
          content: "Advanced topics in property insurance.\n\n1. Special Properties\nUnique Coverage:\n• Heritage buildings\n• Vacation homes\n• Investment properties\n• Under-construction\n\nSpecial Risks:\n• Coastal properties\n• Mountain locations\n• Remote areas\n• High-value assets\n\n2. Business Properties\nCommercial Aspects:\n• Business interruption\n• Stock insurance\n• Machinery breakdown\n• Public liability\n\nRisk Management:\n• Employee training\n• Safety protocols\n• Emergency response\n• Business continuity\n\n3. Future Trends\nEmerging Risks:\n• Climate change\n• Cyber threats\n• Technology impact\n• Regulatory changes\n\nInnovations:\n• Smart monitoring\n• Digital claims\n• Risk analytics\n• Parametric insurance",
        }
      ]
    },
    budgeting: {
      title: "Budgeting",
      pages: [
        {
          title: "Budgeting Basics",
          content: "A budget is your financial roadmap that helps you manage money effectively.\n\n1. Income Sources\nPrimary Income:\n• Salary/wages\n• Business income\n• Freelance earnings\n• Commission/bonuses\n\nSecondary Income:\n• Investments\n• Rental income\n• Side hustles\n• Passive income\n\n2. Expense Categories\nFixed Expenses:\n• Rent/mortgage\n• Loan payments\n• Insurance\n• Utilities\n\nVariable Expenses:\n• Groceries\n• Transportation\n• Entertainment\n• Shopping\n\n3. Budget Types\nZero-based Budget:\n• Every rupee has a purpose\n• Complete allocation\n• Detailed tracking\n• Regular adjustments\n\n50/30/20 Rule:\n• 50% needs\n• 30% wants\n• 20% savings\n\nEnvelope System:\n• Cash allocation\n• Category limits\n• Visual management\n• Spending control",
        },
        {
          title: "Creating Your Budget",
          content: "Follow these steps to create an effective budget:\n\n1. Income Assessment\nCalculate Total Income:\n• List all income sources\n• Average variable income\n• Account for taxes\n• Consider timing\n\nIncome Stability:\n• Regular vs irregular\n• Seasonal variations\n• Growth potential\n• Risk factors\n\n2. Expense Tracking\nFixed Expenses:\n• Housing costs\n• Utilities\n• Insurance\n• Loan payments\n• Subscriptions\n\nVariable Expenses:\n• Food and dining\n• Transportation\n• Healthcare\n• Entertainment\n• Shopping\n\nPeriodic Expenses:\n• Annual payments\n• Seasonal costs\n• Maintenance\n• Special occasions\n\n3. Goal Setting\nShort-term Goals:\n• Emergency fund\n• Debt reduction\n• Specific purchases\n• Travel plans\n\nLong-term Goals:\n• Retirement savings\n• Education funds\n• Home ownership\n• Investment growth",
        },
        {
          title: "Digital Tools & Apps",
          content: "Leverage technology for better budget management:\n\n1. Budgeting Apps\nFeatures to Look For:\n• Expense tracking\n• Bill reminders\n• Category management\n• Goal tracking\n• Reports and analytics\n\nPopular Options:\n• Money Manager\n• Wallet\n• Spendee\n• ET Money\n• PhonePe\n\n2. Spreadsheet Templates\nComponents:\n• Income tracker\n• Expense categories\n• Savings goals\n• Debt payoff plans\n• Investment tracking\n\nAdvanced Features:\n• Automatic calculations\n• Visual charts\n• Forecast models\n• Budget vs. actual\n\n3. Banking Apps\nKey Functions:\n• Balance checking\n• Transaction history\n• Bill payments\n• Fund transfers\n• Savings tools\n\nSmart Features:\n• Category tagging\n• Spending alerts\n• Budget warnings\n• Savings suggestions",
        },
        {
          title: "Common Challenges",
          content: "Overcome typical budgeting obstacles:\n\n1. Irregular Income\nStrategies:\n• Base budget on minimum income\n• Create buffer fund\n• Prioritize expenses\n• Flexible allocations\n\nContingency Planning:\n• Emergency fund\n• Multiple income streams\n• Expense flexibility\n• Savings buffer\n\n2. Unexpected Expenses\nPreparation:\n• Emergency fund\n• Insurance coverage\n• Regular maintenance\n• Budget buffers\n\nResponse Plan:\n• Prioritize payments\n• Adjust categories\n• Find extra income\n• Review coverage\n\n3. Overspending\nPrevention:\n• Track all expenses\n• Use cash envelopes\n• Wait before buying\n• Find alternatives\n\nRecovery Steps:\n• Identify triggers\n• Create limits\n• Find substitutes\n• Build new habits",
        },
        {
          title: "Budget Maintenance",
          content: "Keep your budget effective and current:\n\n1. Regular Reviews\nWeekly Tasks:\n• Track expenses\n• Check balances\n• Update records\n• Flag issues\n\nMonthly Reviews:\n• Compare to plan\n• Adjust categories\n• Check progress\n• Plan ahead\n\n2. Adjustments\nWhen to Adjust:\n• Income changes\n• Life events\n• New goals\n• Market changes\n\nHow to Adjust:\n• Review priorities\n• Reallocate funds\n• Update goals\n• Modify habits\n\n3. Long-term Success\nHabit Formation:\n• Start small\n• Be consistent\n• Track progress\n• Celebrate wins\n\nContinuous Improvement:\n• Learn from mistakes\n• Seek knowledge\n• Update skills\n• Share experiences\n\n4. Support System\nTools and Resources:\n• Financial advisor\n• Budget apps\n• Education\n• Community\n\nAccountability:\n• Share goals\n• Regular check-ins\n• Progress tracking\n• Support network",
        },
      ]
    },
    creditCards: {
      title: "Credit Cards",
      pages: [
        {
          title: "Credit Card Fundamentals",
          content: "Understanding the basics of credit cards and how they work.\n\n1. Core Concepts\nWhat is a Credit Card:\n• Revolving credit line\n• Payment flexibility\n• Digital transactions\n• Purchase protection\n\nKey Components:\n• Credit limit\n• Interest rates (APR)\n• Grace period\n• Minimum payments\n• Statement cycle\n\n2. Types of Cards\nRewards Cards:\n• Cashback benefits\n• Travel rewards\n• Shopping points\n• Lifestyle perks\n\nSpecialty Cards:\n• Business cards\n• Student cards\n• Secured cards\n• Co-branded cards\n\n3. Important Terms\nFees and Charges:\n• Annual fees\n• Late payment fees\n• Foreign transaction fees\n• Cash advance charges\n\nInterest Calculations:\n• Daily periodic rate\n• Balance computation\n• Compound interest\n• Promotional rates",
        },
        {
          title: "Smart Usage Guidelines",
          content: "Best practices for responsible credit card use.\n\n1. Payment Management\nPayment Strategies:\n• Pay full balance\n• Before due date\n• Automatic payments\n• Payment reminders\n\nAvoiding Interest:\n• Understanding grace period\n• Tracking due dates\n• Balance monitoring\n• Early payments\n\n2. Security Measures\nPhysical Security:\n• Safe storage\n• Regular checks\n• Immediate reporting\n• Card activation\n\nDigital Security:\n• Strong passwords\n• Secure websites\n• Regular monitoring\n• Fraud alerts\n\n3. Common Pitfalls\nAvoid These Mistakes:\n• Minimum payments trap\n• Cash advances\n• Missing payments\n• Over-limit charges\n\nSpending Control:\n• Budget alignment\n• Impulse control\n• Emergency only\n• Regular review",
        },
        {
          title: "Maximizing Benefits",
          content: "Get the most value from your credit cards.\n\n1. Rewards Programs\nTypes of Rewards:\n• Cashback programs\n• Travel miles\n• Shopping points\n• Hotel points\n\nOptimization Strategies:\n• Category bonuses\n• Seasonal promotions\n• Sign-up bonuses\n• Redemption timing\n\n2. Additional Benefits\nInsurance Coverage:\n• Purchase protection\n• Travel insurance\n• Rental car coverage\n• Extended warranty\n\nLifestyle Benefits:\n• Airport lounge access\n• Concierge services\n• Entertainment access\n• Shopping discounts\n\n3. Strategic Usage\nMaximize Value:\n• Right card for spending\n• Bonus categories\n• Stack rewards\n• Time purchases\n\nBenefit Tracking:\n• Monitor rewards\n• Track expiration\n• Compare benefits\n• Evaluate usage",
        },
        {
          title: "Credit Building",
          content: "Use credit cards to build a strong credit profile.\n\n1. Credit Score Impact\nPositive Factors:\n• Payment history\n• Credit utilization\n• Account age\n• Credit mix\n\nScore Components:\n• Payment record (35%)\n• Utilization (30%)\n• History length (15%)\n• New credit (10%)\n• Credit mix (10%)\n\n2. Building Strategy\nEstablish Credit:\n• Start with secured card\n• Become authorized user\n• Regular small charges\n• Consistent payments\n\nMaintain Good Standing:\n• Low utilization\n• On-time payments\n• Active accounts\n• Regular monitoring\n\n3. Recovery Plans\nCredit Repair:\n• Identify issues\n• Contact creditors\n• Setup payments\n• Monitor progress\n\nPrevention:\n• Set spending limits\n• Payment reminders\n• Regular checks\n• Emergency fund",
        },
        {
          title: "Advanced Management",
          content: "Advanced strategies for credit card management.\n\n1. Multiple Card Strategy\nCard Portfolio:\n• Primary card\n• Backup cards\n• Specialty cards\n• Emergency cards\n\nOptimization:\n• Rotate cards\n• Match benefits\n• Track expenses\n• Review strategy\n\n2. Debt Management\nDebt Prevention:\n• Spending limits\n• Budget alignment\n• Emergency fund\n• Regular review\n\nDebt Resolution:\n• Balance transfer\n• Debt consolidation\n• Payment planning\n• Professional help\n\n3. Annual Review\nCard Assessment:\n• Fee evaluation\n• Benefit usage\n• Reward value\n• Needs alignment\n\nOptimization Steps:\n• Upgrade options\n• Downgrade choices\n• Cancel unused\n• New applications",
        }
      ]
    },
    womenEmpowerment: {
      title: "Financial Independence ",
      pages: [
        {
          title: "Understanding Financial Independence",
          content: "Financial independence means having control over your money and making informed decisions. Key aspects include:\n\n• Managing your own bank accounts\n• Understanding your income and expenses\n• Making independent financial decisions\n• Building personal credit history\n• Creating long-term financial security",
        },
        {
          title: "Building Financial Confidence",
          content: "Steps to develop financial confidence:\n\n1. Financial Education\n• Learn basic financial terms\n• Understand banking services\n• Know your rights\n\n2. Money Management\n• Create personal budgets\n• Track expenses\n• Set financial boundaries\n\n3. Decision Making\n• Evaluate financial choices\n• Research before investing\n• Seek professional advice when needed",
        },
        {
          title: "Breaking Financial Barriers",
          content: "Overcome common challenges:\n\n1. Knowledge Gaps\n• Join financial literacy programs\n• Read financial blogs and books\n• Attend money management workshops\n\n2. Cultural Barriers\n• Challenge limiting beliefs\n• Build supportive networks\n• Share experiences with other women\n\n3. Workplace Equality\n• Know your worth\n• Negotiate salary\n• Seek growth opportunities",
        },
        {
          title: "Creating Financial Security",
          content: "Essential steps for security:\n\n1. Emergency Fund\n• Start with small savings\n• Increase gradually\n• Keep funds accessible\n\n2. Insurance Coverage\n• Health insurance\n• Life insurance\n• Disability protection\n\n3. Retirement Planning\n• Start early\n• Regular contributions\n• Diversified investments",
        },
        {
          title: "Building Generational Wealth",
          content: "Create lasting financial impact:\n\n1. Investment Strategies\n• Start with safe investments\n• Diversify portfolio\n• Think long-term\n\n2. Asset Building\n• Property ownership\n• Business investments\n• Educational investments\n\n3. Legacy Planning\n• Estate planning\n• Wealth transfer strategies\n• Teaching financial literacy",
        }
      ]
    },
    womenEntrepreneurship: {
      title: "Women Entrepreneurs Guide",
      pages: [
        {
          title: "Starting Your Business",
          content: "Essential steps for business success:\n\n1. Business Planning\n• Market research\n• Business model\n• Financial projections\n\n2. Legal Requirements\n• Business registration\n• Licenses and permits\n• Tax compliance\n\n3. Funding Options\n• Government schemes\n• Bank loans\n• Angel investors\n• Crowdfunding",
        },
        {
          title: "Financial Management",
          content: "Managing business finances:\n\n1. Basic Accounting\n• Income tracking\n• Expense management\n• Cash flow monitoring\n\n2. Business Banking\n• Separate accounts\n• Payment systems\n• Credit facilities\n\n3. Pricing Strategy\n• Cost analysis\n• Profit margins\n• Market positioning",
        },
        {
          title: "Growth Strategies",
          content: "Scaling your business:\n\n1. Market Expansion\n• New products/services\n• Geographic expansion\n• Online presence\n\n2. Team Building\n• Hiring strategies\n• Training programs\n• Leadership development\n\n3. Technology Integration\n• Digital tools\n• Automation\n• Online marketing",
        },
        {
          title: "Networking & Support",
          content: "Building business relationships:\n\n1. Professional Networks\n• Industry associations\n• Women's business groups\n• Mentorship programs\n\n2. Government Support\n• Women entrepreneur schemes\n• Training programs\n• Financial assistance\n\n3. Business Partnerships\n• Strategic alliances\n• Supplier relationships\n• Customer networks",
        },
        {
          title: "Work-Life Balance",
          content: "Managing business and personal life:\n\n1. Time Management\n• Priority setting\n• Delegation\n• Efficient systems\n\n2. Support Systems\n• Family support\n• Childcare solutions\n• Household management\n\n3. Self-Care\n• Stress management\n• Health priorities\n• Personal development",
        }
      ]
    },
    womenInvesting: {
      title: "Investment Guide for Women",
      pages: [
        {
          title: "Investment Basics",
          content: "Foundation of investing:\n\n1. Investment Types\n• Fixed deposits\n• Mutual funds\n• Stocks\n• Real estate\n\n2. Risk Assessment\n• Risk tolerance\n• Time horizon\n• Financial goals\n\n3. Starting Points\n• Emergency fund first\n• Small, regular investments\n• Diversification basics",
        },
        {
          title: "Investment Strategy",
          content: "Building your portfolio:\n\n1. Goal-Based Investing\n• Short-term needs\n• Children's education\n• Retirement planning\n\n2. Asset Allocation\n• Balancing risk\n• Age-based planning\n• Regular rebalancing\n\n3. Investment Selection\n• Research methods\n• Performance analysis\n• Cost consideration",
        },
        {
          title: "Market Understanding",
          content: "Key market concepts:\n\n1. Market Basics\n• Economic cycles\n• Market indicators\n• Industry trends\n\n2. Analysis Methods\n• Fundamental analysis\n• Technical analysis\n• Market news interpretation\n\n3. Risk Management\n• Diversification strategies\n• Stop-loss orders\n• Regular monitoring",
        },
        {
          title: "Common Challenges",
          content: "Overcoming investment hurdles:\n\n1. Knowledge Gaps\n• Educational resources\n• Professional guidance\n• Learning communities\n\n2. Emotional Aspects\n• Managing fear\n• Avoiding impulse decisions\n• Long-term perspective\n\n3. Time Constraints\n• Automated investing\n• Regular review schedule\n• Professional help",
        },
        {
          title: "Advanced Strategies",
          content: "Taking it to next level:\n\n1. Portfolio Expansion\n• International markets\n• Alternative investments\n• Tax-efficient strategies\n\n2. Wealth Building\n• Compound growth\n• Dividend reinvestment\n• Portfolio optimization\n\n3. Future Planning\n• Estate planning\n• Inheritance management\n• Charitable giving",
        }
      ]
    },
    womenFinancialIndependence: {
      title: "Financial Independence for Women",
      pages: [
        {
          title: "Foundation of Financial Independence",
          content: "Essential steps towards financial independence.\n\n1. Financial Awareness\nBasic Concepts:\n• Income management\n• Expense tracking\n• Savings discipline\n• Investment basics\n\nFinancial Literacy:\n• Banking knowledge\n• Digital transactions\n• Financial terms\n• Market understanding\n\n2. Independent Banking\nAccount Management:\n• Savings account\n• Fixed deposits\n• Credit cards\n• Online banking\n\nSecurity Measures:\n• Digital safety\n• Fraud prevention\n• Account monitoring\n• Emergency access\n\n3. Career Planning\nProfessional Growth:\n• Skill development\n• Career progression\n• Income growth\n• Work-life balance\n\nEntrepreneurship:\n• Business planning\n• Market research\n• Funding options\n• Risk management",
        },
        {
          title: "Investment Planning",
          content: "Building wealth through smart investments.\n\n1. Investment Basics\nInvestment Options:\n• Fixed deposits\n• Mutual funds\n• Stocks\n• Gold\n• Real estate\n\nRisk Management:\n• Risk assessment\n• Portfolio diversification\n• Regular monitoring\n• Rebalancing\n\n2. Goal-Based Investing\nShort-term Goals:\n• Emergency fund\n• Major purchases\n• Travel plans\n• Skill development\n\nLong-term Goals:\n• Retirement planning\n• Children's education\n• Property purchase\n• Wealth creation\n\n3. Tax Planning\nTax Efficiency:\n• Tax-saving investments\n• Deductions available\n• Tax filing\n• Documentation\n\nWealth Protection:\n• Insurance needs\n• Estate planning\n• Will creation\n• Nominee declaration",
        },
        {
          title: "Financial Security",
          content: "Building and maintaining financial security.\n\n1. Emergency Planning\nEmergency Fund:\n• Fund size\n• Easy access\n• Regular review\n• Replenishment\n\nInsurance Coverage:\n• Health insurance\n• Life insurance\n• Critical illness\n• Personal accident\n\n2. Debt Management\nCredit Usage:\n• Credit score\n• Loan management\n• Debt reduction\n• Interest optimization\n\nFinancial Discipline:\n• Budgeting\n• Expense control\n• Savings automation\n• Credit monitoring\n\n3. Retirement Planning\nRetirement Corpus:\n• Corpus calculation\n• Investment strategy\n• Regular contributions\n• Portfolio review\n\nIncome Sources:\n• Pension plans\n• Rental income\n• Investment returns\n• Business income",
        },
        {
          title: "Legal & Documentation",
          content: "Important legal aspects of financial independence.\n\n1. Essential Documents\nPersonal Documents:\n• Identity proof\n• Address proof\n• PAN card\n• Bank documents\n\nLegal Papers:\n• Property papers\n• Insurance policies\n• Investment certificates\n• Will document\n\n2. Rights & Protection\nLegal Rights:\n• Property rights\n• Inheritance laws\n• Marriage laws\n• Divorce rights\n\nFinancial Protection:\n• Joint accounts\n• Nominations\n• Power of attorney\n• Legal consultation\n\n3. Digital Security\nOnline Safety:\n• Password protection\n• Two-factor authentication\n• Regular monitoring\n• Fraud prevention\n\nRecord Keeping:\n• Digital copies\n• Cloud storage\n• Regular updates\n• Access management",
        },
        {
          title: "Future Planning",
          content: "Long-term financial planning and growth.\n\n1. Wealth Creation\nInvestment Growth:\n• Portfolio expansion\n• Risk adjustment\n• Regular review\n• Market monitoring\n\nAlternative Income:\n• Business ventures\n• Passive income\n• Skill monetization\n• Investment returns\n\n2. Knowledge Enhancement\nFinancial Education:\n• Market understanding\n• Investment knowledge\n• Tax planning\n• Estate planning\n\nNetworking:\n• Professional groups\n• Financial advisors\n• Mentorship\n• Support system\n\n3. Legacy Planning\nWealth Transfer:\n• Estate planning\n• Will creation\n• Trust formation\n• Tax efficiency\n\nFamily Education:\n• Financial literacy\n• Money management\n• Investment basics\n• Risk awareness",
        }
      ]
    }
  };

  const videoContent = {
    beginner: [
      {
        id: 'ZW9MzeSZ5tI',
        title: "Understanding Personal Finance",
        channelTitle: "Pranjal Kamra",
        duration: "45 min",
        thumbnail: "https://img.youtube.com/vi/UcAY6qRHlw0/maxresdefault.jpg",
      },
      {
        id: 'Rl9Lw9_xuVg',
        title: "Income & Expense Tracking",
        channelTitle: "Ankur Warikoo",
        duration: "30 min",
        thumbnail: "https://img.youtube.com/vi/v6bx9g-mqyo/maxresdefault.jpg",
      },
      {
        id: 'kxo4mPqPLHI',
        title: "Budgeting Methods: Zero-based & 50/30/20",
        channelTitle: "CA Rachana Ranade",
        duration: "35 min",
        thumbnail: "https://img.youtube.com/vi/jNUbhmB8zw8/maxresdefault.jpg",
      },
      {
        id: 'M9dVG6ezEVk',
        title: "Savings Strategies & Emergency Funds",
        channelTitle: "Labour Law Advisor",
        duration: "40 min",
        thumbnail: "https://img.youtube.com/vi/M9dVG6ezEVk/maxresdefault.jpg",
      },
      {
        id: 'bJACHlcKKgw',
        title: "Understanding Bank Accounts & Credit Score",
        channelTitle: "Akshat Shrivastava",
        duration: "35 min",
        thumbnail: "https://img.youtube.com/vi/bJACHlcKKgw/maxresdefault.jpg",
      }
    ],
    intermediate: [
      {
        id: '9_8vcAmVO7I',
        title: "Introduction to Investments & Stock Market",
        channelTitle: "CA Rachana Ranade",
        duration: "60 min",
        thumbnail: "https://img.youtube.com/vi/qIw-yFC-HNU/maxresdefault.jpg",
      },
      {
        id: 'K7LJ2hTgxPM',
        title: "Mutual Funds, SIPs & Index Funds",
        channelTitle: "Pranjal Kamra",
        duration: "45 min",
        thumbnail: "https://img.youtube.com/vi/Jds2CU0_N_k/maxresdefault.jpg",
      },
      {
        id: 'x4jWwkGNdGY',
        title: "Retirement Planning & Insurance",
        channelTitle: "Ankur Warikoo",
        duration: "50 min",
        thumbnail: "https://img.youtube.com/vi/xAPowOyA0LU/maxresdefault.jpg",
      },
      {
        id: 'za5EkxRG3Gk',
        title: "Real Estate Investment & REITs",
        channelTitle: "Akshat Shrivastava",
        duration: "55 min",
        thumbnail: "https://img.youtube.com/vi/za5EkxRG3Gk/maxresdefault.jpg",
      },
      {
        id: 'wjLI99_nXBE',
        title: "Tax Planning & Gold Investments",
        channelTitle: "Labour Law Advisor",
        duration: "40 min",
        thumbnail: "https://img.youtube.com/vi/wjLI99_nXBE/maxresdefault.jpg",
      }
    ],
    advanced: [
      {
        id: 'TL6I-gYZ5c4',
        title: "Asset Allocation & Portfolio Management",
        channelTitle: "CA Rachana Ranade",
        duration: "75 min",
        thumbnail: "https://img.youtube.com/vi/dSX3qa2mWCQ/maxresdefault.jpg",
      },
      {
        id: 'XBQetKqJpPE',
        title: "Technical & Fundamental Analysis",
        channelTitle: "Pranjal Kamra",
        duration: "65 min",
        thumbnail: "https://img.youtube.com/vi/yzRP-mA2eiE/maxresdefault.jpg",
      },
      {
        id: 'PHe0bXAIuk0',
        title: "Cryptocurrency & Forex Trading",
        channelTitle: "Ray Dalio",
        duration: "70 min",
        thumbnail: "https://img.youtube.com/vi/GIrXxemhoVg/maxresdefault.jpg",
      },
      {
        id: 'F3QpgXBtDeo',
        title: "Angel Investing & Venture Capital",
        channelTitle: "Warren Buffett Archive",
        duration: "80 min",
        thumbnail: "https://img.youtube.com/vi/F3QpgXBtDeo/maxresdefault.jpg",
      },
      {
        id: 'TJDcGv9OH4Q',
        title: "Passive Income & Risk Management",
        channelTitle: "Morgan Housel",
        duration: "60 min",
        thumbnail: "https://img.youtube.com/vi/TJDcGv9OH4Q/maxresdefault.jpg",
      }
    ],
    expert: [
      {
        id: 'dQw4w9WgXcQ',
        title: "Entrepreneurship & Business Finance",
        channelTitle: "Harvard Business Review",
        duration: "90 min",
        thumbnail: "https://img.youtube.com/vi/eHJnEHyyN1Y/maxresdefault.jpg",
      },
      {
        id: 'jfKfPfyJRdk',
        title: "Private Equity & Hedge Funds",
        channelTitle: "Bloomberg Markets",
        duration: "85 min",
        thumbnail: "https://img.youtube.com/vi/yca0A3B7Pqc/maxresdefault.jpg",
      },
      {
        id: '5qap5aO4i9A',
        title: "Estate Planning & Wealth Management",
        channelTitle: "Financial Times",
        duration: "75 min",
        thumbnail: "https://img.youtube.com/vi/nZ4SAXgUrIc/maxresdefault.jpg",
      },
      {
        id: 'DWcJFNfaw9c',
        title: "FIRE Movement & Financial Freedom",
        channelTitle: "The Economist",
        duration: "70 min",
        thumbnail: "https://img.youtube.com/vi/IntxsqfLFXA/maxresdefault.jpg",
      },
      {
        id: 'casJrjGyPxE',
        title: "AI in Finance & Global Economic Trends",
        channelTitle: "World Economic Forum",
        duration: "80 min",
        thumbnail: "https://img.youtube.com/vi/casJrjGyPxE/maxresdefault.jpg",
      }
    ]
  };

  const handleModulePress = (moduleId) => {
    setSelectedModule(moduleId);
    setShowModuleModal(true);
    setCurrentPage(1);
  };

  const handleVideoPress = (videoId) => {
    setSelectedVideo(videoId);
    setVideoModalVisible(true);
  };

  // Check if a level is unlocked
  const isLevelUnlocked = (level) => {
    if (level === 'beginner') return true;
    
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const levelIndex = levels.indexOf(level);
    const previousLevel = levels[levelIndex - 1];
    
    // Check both points requirement and previous level test score
    const hasEnoughPoints = userPoints >= levelRequirements[level];
    const passedPreviousTest = testScores[previousLevel] >= testThresholds[previousLevel];
    
    return hasEnoughPoints && passedPreviousTest;
  };

  // Handle video completion
  const handleVideoCompletion = (videoId) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos([...completedVideos, videoId]);
    }
  };

  // Handle module completion
  const handleModuleCompletion = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  // Check if new level should be unlocked
  const checkLevelUnlock = (points) => {
    const newUnlockedLevels = ['beginner'];
    
    if (points >= levelRequirements.intermediate && 
        testScores.beginner >= testThresholds.beginner) {
      newUnlockedLevels.push('intermediate');
    }
    if (points >= levelRequirements.advanced && 
        testScores.intermediate >= testThresholds.intermediate) {
      newUnlockedLevels.push('advanced');
    }
    if (points >= levelRequirements.expert && 
        testScores.advanced >= testThresholds.advanced) {
      newUnlockedLevels.push('expert');
    }
    
    setUnlockedLevels(newUnlockedLevels);
  };

  // Modify video player close handler
  const handleVideoClose = () => {
    if (selectedVideo) {
      handleVideoCompletion(selectedVideo);
    }
    setVideoModalVisible(false);
    setSelectedVideo(null);
  };

  // Modify module modal close handler
  const handleModuleClose = () => {
    if (selectedModule) {
      handleModuleCompletion(selectedModule);
    }
    setShowModuleModal(false);
    setSelectedModule(null);
  };

  const renderModuleModal = () => {
    if (!selectedModule || !moduleContent[selectedModule]) return null;

    const content = moduleContent[selectedModule];
    const currentPageContent = content.pages[currentPage - 1];

    return (
      <Modal
        visible={showModuleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModuleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{content.title}</Text>
              <TouchableOpacity
                onPress={handleModuleClose}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageNumber}>Page {currentPage} of {content.pages.length}</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.pageTitle}>{currentPageContent.title}</Text>
              <Text style={styles.pageContent}>{currentPageContent.content}</Text>
            </ScrollView>

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="chevron-left" size={24} color={currentPage === 1 ? "#9CA3AF" : "#FFFFFF"} />
                <Text style={[styles.navButtonText, currentPage === 1 && styles.disabledButtonText]}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, currentPage === content.pages.length && styles.disabledButton]}
                onPress={() => setCurrentPage(prev => Math.min(content.pages.length, prev + 1))}
                disabled={currentPage === content.pages.length}
              >
                <Text style={[styles.navButtonText, currentPage === content.pages.length && styles.disabledButtonText]}>Next</Text>
                <Icon name="chevron-right" size={24} color={currentPage === content.pages.length ? "#9CA3AF" : "#FFFFFF"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderVideosSection = () => (
    <View style={styles.section}>
      {/* Level Tabs */}
      <View style={styles.levelTabsWrapper}>
        <View style={styles.levelTabsContainer}>
          {renderLevelTab('beginner', 'school', 'Beginner')}
          {renderLevelTab('intermediate', 'trending-up', 'Intermediate')}
          {renderLevelTab('advanced', 'star', 'Advanced')}
          {renderLevelTab('expert', 'trophy', 'Expert')}
        </View>
      </View>

      <FlatList
        data={videoContent[activeVideoLevel] || []}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tutorialList}
        ListHeaderComponent={<View style={styles.listHeaderSpace} />}
        renderItem={renderVideoCard}
      />

      <VideoPlayer
        videoId={selectedVideo}
        visible={videoModalVisible}
        onClose={handleVideoClose}
      />
    </View>
  );

  const renderLevelTab = (level, icon, label) => {
    const isUnlocked = isLevelUnlocked(level);
    const isActive = activeVideoLevel === level;
    
    return (
      <TouchableOpacity 
        style={[
          styles.levelTab,
          isActive && styles.activeLevelTab,
          !isUnlocked && styles.lockedTab
        ]}
        onPress={() => isUnlocked && setActiveVideoLevel(level)}
        disabled={!isUnlocked}>
        <Icon 
          name={isUnlocked ? icon : "lock"}
          size={20} 
          color={isActive ? colors.primary.main : isUnlocked ? '#6B7280' : '#9CA3AF'} 
        />
        <Text style={[
          styles.levelTabText,
          isActive && styles.activeLevelTabText,
          !isUnlocked && styles.lockedTabText
        ]}>
          {label}
        </Text>
        {!isUnlocked && (
          <View style={styles.pointsRequiredBadge}>
            <Icon name="lock" size={12} color="#DC2626" />
            <Text style={styles.pointsRequiredText}>{levelRequirements[level]} pts</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderVideoCard = ({ item }) => {
    const isCompleted = completedVideos.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.tutorialCard, isCompleted && styles.completedCard]}
        onPress={() => handleVideoPress(item.id)}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
        />
        <View style={styles.playButton}>
          <Icon name={isCompleted ? "check-circle" : "play-circle"} size={40} color="#fff" />
        </View>
        <View style={styles.tutorialInfo}>
          <Text style={styles.tutorialTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.tutorialMeta}>
            <View style={styles.metaItem}>
              <Icon name="account" size={14} color={semantic.text.secondary} />
              <Text style={styles.metaText}>{item.channelTitle}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={14} color={semantic.text.secondary} />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Icon name="check" size={12} color="#FFFFFF" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Link href="../" asChild>
        <TouchableOpacity
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={semantic.text.primary} />
        </TouchableOpacity>
      </Link>
      <Text style={styles.headerTitle}>Financial Education</Text>
      <View style={styles.pointsContainer}>
        <Icon name="star" size={16} color={colors.primary.main} />
        <Text style={styles.pointsText}>{userPoints} pts</Text>
      </View>
    </View>
  );

  const renderSectionTabs = () => (
    <View style={styles.sectionTabsContainer}>
      <TouchableOpacity
        style={[styles.sectionTab, activeSection === 'modules' && styles.activeSectionTab]}
        onPress={() => setActiveSection('modules')}>
        <Icon name="book-open-variant" size={24} color={activeSection === 'modules' ? colors.primary.main : '#6B7280'} />
        <Text style={[styles.sectionTabText, activeSection === 'modules' && styles.activeSectionTabText]}>Modules</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionTab, activeSection === 'videos' && styles.activeSectionTab]}
        onPress={() => setActiveSection('videos')}>
        <Icon name="play-circle" size={24} color={activeSection === 'videos' ? colors.primary.main : '#6B7280'} />
        <Text style={[styles.sectionTabText, activeSection === 'videos' && styles.activeSectionTabText]}>Lecture</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sectionTab, activeSection === 'tests' && styles.activeSectionTab]}
        onPress={() => setActiveSection('tests')}>
        <Icon name="pencil" size={24} color={activeSection === 'tests' ? colors.primary.main : '#6B7280'} />
        <Text style={[styles.sectionTabText, activeSection === 'tests' && styles.activeSectionTabText]}>Tests</Text>
      </TouchableOpacity>
    </View>
  );

  const renderModulesSection = () => (
    <View style={styles.section}>
      <View style={styles.modulesContainer}>
        {/* Basic Finance Section - Beginner Level */}
        <View style={styles.moduleSubsection}>
          <View style={styles.subsectionHeader}>
            <Icon name="cash-multiple" size={20} color="#059669" />
            <Text style={styles.subsectionTitle}>Basic Finance (Beginner)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleCardsContainer}>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#059669' },
                completedModules.includes('budgeting') && styles.completedModuleCard
              ]}
              onPress={() => handleModulePress('budgeting')}
            >
              <Icon name="calculator" size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Budgeting</Text>
              <Text style={styles.moduleCardSubtitle}>First steps in finance</Text>
              {completedModules.includes('budgeting') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#059669' },
                completedModules.includes('emergencyFund') && styles.completedModuleCard
              ]}
              onPress={() => handleModulePress('emergencyFund')}
            >
              <Icon name="bank" size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Emergency Fund</Text>
              <Text style={styles.moduleCardSubtitle}>Build your safety net</Text>
              {completedModules.includes('emergencyFund') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Saving Section - Intermediate Level */}
        <View style={styles.moduleSubsection}>
          <View style={styles.subsectionHeader}>
            <Icon name="piggy-bank" size={20} color="#2563EB" />
            <Text style={styles.subsectionTitle}>Saving (Intermediate)</Text>
            {!isLevelUnlocked('intermediate') && (
              <View style={styles.pointsRequiredBadge}>
                <Icon name="lock" size={12} color="#DC2626" />
                <Text style={styles.pointsRequiredText}>{levelRequirements.intermediate} pts</Text>
              </View>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleCardsContainer}>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#2563EB' },
                !isLevelUnlocked('intermediate') && styles.lockedModuleCard,
                completedModules.includes('goalSetting') && styles.completedModuleCard
              ]}
              onPress={() => isLevelUnlocked('intermediate') && handleModulePress('goalSetting')}
              disabled={!isLevelUnlocked('intermediate')}
            >
              <Icon name={isLevelUnlocked('intermediate') ? "target" : "lock"} size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Goal Setting</Text>
              <Text style={styles.moduleCardSubtitle}>Plan your future</Text>
              {completedModules.includes('goalSetting') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#2563EB' },
                !isLevelUnlocked('intermediate') && styles.lockedModuleCard,
                completedModules.includes('creditCards') && styles.completedModuleCard
              ]}
              onPress={() => isLevelUnlocked('intermediate') && handleModulePress('creditCards')}
              disabled={!isLevelUnlocked('intermediate')}
            >
              <Icon name={isLevelUnlocked('intermediate') ? "credit-card" : "lock"} size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Credit Cards</Text>
              <Text style={styles.moduleCardSubtitle}>Smart credit usage</Text>
              {completedModules.includes('creditCards') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Advanced Level */}
        <View style={styles.moduleSubsection}>
          <View style={styles.subsectionHeader}>
            <Icon name="shield-check" size={20} color="#4F46E5" />
            <Text style={styles.subsectionTitle}>Protection (Advanced)</Text>
            {!isLevelUnlocked('advanced') && (
              <View style={styles.pointsRequiredBadge}>
                <Icon name="lock" size={12} color="#DC2626" />
                <Text style={styles.pointsRequiredText}>{levelRequirements.advanced} pts</Text>
              </View>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleCardsContainer}>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#4F46E5' },
                !isLevelUnlocked('advanced') && styles.lockedModuleCard,
                completedModules.includes('healthInsurance') && styles.completedModuleCard
              ]}
              onPress={() => isLevelUnlocked('advanced') && handleModulePress('healthInsurance')}
              disabled={!isLevelUnlocked('advanced')}
            >
              <Icon name={isLevelUnlocked('advanced') ? "heart-pulse" : "lock"} size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Health Insurance</Text>
              <Text style={styles.moduleCardSubtitle}>Protect your health</Text>
              {completedModules.includes('healthInsurance') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#4F46E5' },
                !isLevelUnlocked('advanced') && styles.lockedModuleCard,
                completedModules.includes('propertyInsurance') && styles.completedModuleCard
              ]}
              onPress={() => isLevelUnlocked('advanced') && handleModulePress('propertyInsurance')}
              disabled={!isLevelUnlocked('advanced')}
            >
              <Icon name={isLevelUnlocked('advanced') ? "home" : "lock"} size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Property Insurance</Text>
              <Text style={styles.moduleCardSubtitle}>Secure your assets</Text>
              {completedModules.includes('propertyInsurance') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Expert Level */}
        <View style={styles.moduleSubsection}>
          <View style={styles.subsectionHeader}>
            <Icon name="chart-line" size={20} color="#DC2626" />
            <Text style={styles.subsectionTitle}>Investing (Expert)</Text>
            {!isLevelUnlocked('expert') && (
              <View style={styles.pointsRequiredBadge}>
                <Icon name="lock" size={12} color="#DC2626" />
                <Text style={styles.pointsRequiredText}>{levelRequirements.expert} pts</Text>
              </View>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moduleCardsContainer}>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#DC2626' },
                !isLevelUnlocked('expert') && styles.lockedModuleCard,
                completedModules.includes('stockMarket') && styles.completedModuleCard
              ]}
              onPress={() => isLevelUnlocked('expert') && handleModulePress('stockMarket')}
              disabled={!isLevelUnlocked('expert')}
            >
              <Icon name={isLevelUnlocked('expert') ? "trending-up" : "lock"} size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Stock Market</Text>
              <Text style={styles.moduleCardSubtitle}>Advanced trading</Text>
              {completedModules.includes('stockMarket') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.moduleCard, 
                { backgroundColor: '#DC2626' },
                !isLevelUnlocked('expert') && styles.lockedModuleCard,
                completedModules.includes('mutualFunds') && styles.completedModuleCard
              ]}
              onPress={() => isLevelUnlocked('expert') && handleModulePress('mutualFunds')}
              disabled={!isLevelUnlocked('expert')}
            >
              <Icon name={isLevelUnlocked('expert') ? "gold" : "lock"} size={32} color="#FFFFFF" />
              <Text style={styles.moduleCardTitle}>Mutual Funds</Text>
              <Text style={styles.moduleCardSubtitle}>Portfolio management</Text>
              {completedModules.includes('mutualFunds') && (
                <View style={styles.moduleCompletedBadge}>
                  <Icon name="check" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      {renderModuleModal()}
    </View>
  );

  // Add test content for each level
  const testContent = {
    beginner: {
      title: "Beginner Level Test",
      questions: [
        {
          id: 1,
          question: "What is the primary purpose of an emergency fund?",
          options: [
            "To invest in stocks",
            "To handle unexpected expenses and financial emergencies",
            "To save for vacation",
            "To buy luxury items"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Which of the following is a key component of budgeting?",
          options: [
            "Spending all your income",
            "Ignoring small expenses",
            "Tracking income and expenses",
            "Avoiding savings"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "What is the recommended size for a starter emergency fund?",
          options: [
            "₹1,000",
            "₹5,000",
            "₹10,000 - ₹25,000",
            "₹1,00,000"
          ],
          correctAnswer: 2
        },
        {
          id: 4,
          question: "What is the 50/30/20 rule in budgeting?",
          options: [
            "50% savings, 30% needs, 20% wants",
            "50% needs, 30% wants, 20% savings",
            "50% wants, 30% savings, 20% needs",
            "50% investments, 30% savings, 20% expenses"
          ],
          correctAnswer: 1
        },
        {
          id: 5,
          question: "Which is the best place to keep your emergency fund?",
          options: [
            "Stock market",
            "High-yield savings account",
            "Under your mattress",
            "Cryptocurrency"
          ],
          correctAnswer: 1
        }
      ]
    },
    intermediate: {
      title: "Intermediate Level Test",
      questions: [
        {
          id: 1,
          question: "What is a mutual fund?",
          options: [
            "A type of bank account",
            "A pooled investment vehicle managed professionally",
            "A government bond",
            "A type of insurance"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "What is the benefit of SIP (Systematic Investment Plan)?",
          options: [
            "Guaranteed returns",
            "No market risk",
            "Rupee cost averaging",
            "Instant profits"
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "Which factor affects your credit score the most?",
          options: [
            "Number of credit cards",
            "Payment history",
            "Credit utilization",
            "Credit mix"
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          question: "What is diversification in investing?",
          options: [
            "Investing all money in one stock",
            "Spreading investments across different assets",
            "Only investing in gold",
            "Keeping all money in savings"
          ],
          correctAnswer: 1
        },
        {
          id: 5,
          question: "What is the purpose of asset allocation?",
          options: [
            "To maximize risk",
            "To balance risk and return",
            "To eliminate all returns",
            "To avoid investing"
          ],
          correctAnswer: 1
        }
      ]
    },
    advanced: {
      title: "Advanced Level Test",
      questions: [
        {
          id: 1,
          question: "What is the Sharpe ratio used for?",
          options: [
            "Measuring fund manager performance",
            "Calculating dividend yield",
            "Measuring risk-adjusted returns",
            "Determining market cap"
          ],
          correctAnswer: 2
        },
        {
          id: 2,
          question: "What is a stop-loss order?",
          options: [
            "An order to buy at market price",
            "An order to sell if price falls below specified level",
            "An order to buy more shares",
            "An order to hold shares"
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What is technical analysis in stock trading?",
          options: [
            "Analyzing company financials",
            "Studying price patterns and trends",
            "Reading news articles",
            "Calculating dividends"
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          question: "What is the core-satellite approach in portfolio management?",
          options: [
            "Only investing in index funds",
            "Only investing in active funds",
            "Combining index funds with active investments",
            "Avoiding diversification"
          ],
          correctAnswer: 2
        },
        {
          id: 5,
          question: "What is the purpose of portfolio rebalancing?",
          options: [
            "To increase risk",
            "To maintain target asset allocation",
            "To eliminate dividends",
            "To avoid taxes"
          ],
          correctAnswer: 1
        }
      ]
    },
    expert: {
      title: "Expert Level Test",
      questions: [
        {
          id: 1,
          question: "What is factor investing?",
          options: [
            "Random stock selection",
            "Investing based on specific characteristics",
            "Day trading strategy",
            "Avoiding stocks"
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "What is the purpose of parametric insurance?",
          options: [
            "Traditional claims process",
            "Automatic payout based on triggered events",
            "No insurance coverage",
            "Only life insurance"
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What is ESG investing?",
          options: [
            "Only environmental investing",
            "Investment based on environmental, social, and governance factors",
            "High-risk trading",
            "Short-term trading"
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          question: "What is a smart beta fund?",
          options: [
            "Pure index fund",
            "Active management only",
            "Combination of passive and factor investing",
            "Avoiding stocks"
          ],
          correctAnswer: 2
        },
        {
          id: 5,
          question: "What is the purpose of a trust in estate planning?",
          options: [
            "Avoid asset protection",
            "Increase taxes",
            "Efficient transfer of assets and tax benefits",
            "Eliminate inheritance"
          ],
          correctAnswer: 2
        }
      ]
    }
  };

  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Update test points rewards
  const testPointsReward = {
    beginner: 100,      // Points for passing beginner test
    intermediate: 150,  // Points for passing intermediate test
    advanced: 200,      // Points for passing advanced test
    expert: 250        // Points for passing expert test
  };

  const handleStartTest = (level) => {
    setSelectedTest(level);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setShowTestModal(true);
  };

  // Update handleAnswer function to handle points only through tests
  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const currentTest = testContent[selectedTest];
    if (answerIndex === currentTest.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < currentTest.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        const finalScore = ((score + (answerIndex === currentTest.questions[currentQuestion].correctAnswer ? 1 : 0)) / currentTest.questions.length) * 100;
        
        // Update test scores
        const previousScore = testScores[selectedTest];
        setTestScores(prev => ({
          ...prev,
          [selectedTest]: Math.max(finalScore, prev[selectedTest])
        }));

        // Award points only if:
        // 1. Test is passed (meets threshold)
        // 2. Previous score was below threshold (first time passing)
        // 3. New score is above threshold
        if (finalScore >= testThresholds[selectedTest] && 
            previousScore < testThresholds[selectedTest]) {
          const newPoints = userPoints + testPointsReward[selectedTest];
          setUserPoints(newPoints);
          checkLevelUnlock(newPoints);
        }
        
        setShowResults(true);
      }
    }, 1000);
  };

  const renderTestModal = () => {
    if (!selectedTest || !testContent[selectedTest]) return null;

    const currentTest = testContent[selectedTest];
    const currentQ = currentTest.questions[currentQuestion];

    return (
      <Modal
        visible={showTestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTestModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentTest.title}</Text>
              <TouchableOpacity
                onPress={() => setShowTestModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {!showResults ? (
              <>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>Question {currentQuestion + 1} of {currentTest.questions.length}</Text>
                  <Text style={styles.questionText}>{currentQ.question}</Text>
                </View>

                <View style={styles.optionsContainer}>
                  {currentQ.options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        selectedAnswer === index && styles.selectedOption,
                        selectedAnswer !== null && index === currentQ.correctAnswer && styles.correctOption,
                        selectedAnswer === index && selectedAnswer !== currentQ.correctAnswer && styles.wrongOption
                      ]}
                      onPress={() => selectedAnswer === null && handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedAnswer === index && styles.selectedOptionText
                      ]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.resultsContainer}>
                <Text style={styles.scoreText}>Your Score: {score}/{currentTest.questions.length}</Text>
                <Text style={styles.scorePercentage}>
                  {Math.round((score / currentTest.questions.length) * 100)}%
                </Text>
                {Math.round((score / currentTest.questions.length) * 100) >= testThresholds[selectedTest] && 
                 testScores[selectedTest] < testThresholds[selectedTest] && (
                  <View style={styles.pointsEarnedContainer}>
                    <Icon name="star" size={24} color={colors.primary.main} />
                    <Text style={styles.pointsEarnedText}>
                      +{testPointsReward[selectedTest]} points earned!
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setShowResults(false);
                    setSelectedAnswer(null);
                  }}
                >
                  <Text style={styles.retakeButtonText}>Retake Test</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Add test scores state
  const [testScores, setTestScores] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    expert: 0
  });

  // Add test thresholds
  const testThresholds = {
    beginner: 60,
    intermediate: 70,
    advanced: 80,
    expert: 90
  };

  const renderTestsSection = () => (
    <View style={styles.section}>
      <ScrollView style={styles.testsContainer}>
        {Object.entries(testContent).map(([level, test]) => {
          const isUnlocked = isLevelUnlocked(level);
          const score = testScores[level];
          const isPassed = score >= testThresholds[level];
          const pointsRequired = levelRequirements[level];
          const hasPoints = userPoints >= pointsRequired;
          const levelIndex = levels.indexOf(level);
          const previousLevel = levelIndex > 0 ? levels[levelIndex - 1] : null;
          
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.testCard,
                !isUnlocked && styles.lockedTestCard,
                isPassed && styles.passedTestCard
              ]}
              onPress={() => isUnlocked && handleStartTest(level)}
              disabled={!isUnlocked}
            >
              <View style={styles.testCardContent}>
                <Icon
                  name={!isUnlocked ? "lock" : isPassed ? "check-circle" : "pencil-circle"}
                  size={32}
                  color={!isUnlocked ? "#9CA3AF" : isPassed ? "#059669" : colors.primary.main}
                />
                <View style={styles.testCardText}>
                  <Text style={styles.testCardTitle}>{test.title}</Text>
                  <Text style={styles.testCardDescription}>
                    {!isUnlocked ? 
                      `Requirements: ${pointsRequired} points${previousLevel ? ` and pass ${previousLevel} test` : ''}` :
                      score > 0 ?
                        `Your best score: ${score}% (${score >= testThresholds[level] ? 'Passed' : 'Not Passed'})` :
                        `${test.questions.length} questions - Need ${testThresholds[level]}% to pass`
                    }
                  </Text>
                  {!isUnlocked && (
                    <View style={styles.requirementsList}>
                      <Text style={[styles.requirementText, hasPoints && styles.metRequirement]}>
                        • Points: {userPoints}/{pointsRequired}
                      </Text>
                      {previousLevel && (
                        <Text style={[
                          styles.requirementText, 
                          testScores[previousLevel] >= testThresholds[previousLevel] && 
                          styles.metRequirement
                        ]}>
                          • Previous Test: {testScores[previousLevel]}%/{testThresholds[previousLevel]}%
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTestModal()}
    </View>
  );

  // Update the main return statement to include the tests section
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {renderSectionTabs()}
        {activeSection === 'modules' ? (
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {renderModulesSection()}
          </ScrollView>
        ) : activeSection === 'videos' ? (
          <View style={styles.content}>
            {renderVideosSection()}
          </View>
        ) : (
          <View style={styles.content}>
            {renderTestsSection()}
          </View>
        )}
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary.main}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary.main}30`,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
    marginLeft: 6,
  },
  sectionTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  activeSectionTab: {
    backgroundColor: `${colors.primary.main}15`,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  sectionTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeSectionTabText: {
    color: colors.primary.main,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  section: {
    flex: 1,
  },
  tutorialList: {
    paddingBottom: 16,
  },
  listHeaderSpace: {
    height: 8,
  },
  tutorialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  tutorialInfo: {
    padding: 12,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 20,
  },
  tutorialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  playButton: {
    position: 'absolute',
    top: '25%',
    left: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
  },
  levelTabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  levelTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  levelTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  activeLevelTab: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  levelTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  lockedTab: {
    opacity: 0.7,
    backgroundColor: '#E5E7EB',
  },
  lockedTabText: {
    color: '#9CA3AF',
  },
  pointsRequiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  pointsRequiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 4,
  },
  completedCard: {
    borderColor: colors.primary.main,
    borderWidth: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  completedText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  modulesContainer: {
    paddingHorizontal: 16,
  },
  moduleSubsection: {
    marginBottom: 24,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 4,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  moduleCardsContainer: {
    paddingVertical: 4,
  },
  moduleCard: {
    width: 180,
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  moduleCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  moduleCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  lockedModuleCard: {
    // Remove opacity
  },
  completedModuleCard: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moduleCompletedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  pageIndicator: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pageNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalBody: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  pageContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  testsContainer: {
    padding: 16,
  },
  testCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  lockedTestCard: {
    opacity: 0.7,
    backgroundColor: '#F3F4F6',
  },
  testCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testCardText: {
    marginLeft: 12,
    flex: 1,
  },
  testCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  testCardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: `${colors.primary.main}15`,
    borderColor: colors.primary.main,
    borderWidth: 1,
  },
  correctOption: {
    backgroundColor: '#D1FAE5',
    borderColor: '#059669',
    borderWidth: 1,
  },
  wrongOption: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  resultsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: 24,
  },
  retakeButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary.main}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colors.primary.main}30`,
  },
  testScoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
    marginLeft: 6,
  },
  passedTestCard: {
    borderColor: '#059669',
    borderWidth: 1,
    backgroundColor: '#F0FDF4',
  },
  requirementsList: {
    marginTop: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 2,
  },
  metRequirement: {
    color: '#059669',
  },
  pointsEarnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary.main}15`,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  pointsEarnedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
    marginLeft: 8,
  },
});

export default FinancialEducationScreen; 