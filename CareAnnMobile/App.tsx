import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your components/screens
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import CareSeekerDashboard from './components/Dashboard/CareSeekerDashboard';
import CaregiverDashboard from './components/Dashboard/CaregiverDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Messaging from './components/Messaging/Messaging';
import JobPostingForm from './components/Forms/JobPostingForm';
import CaregiverJobManagement from './components/Jobs/CaregiverJobManagement';
import PaymentManagement from './components/Forms/PaymentManagement';
import SearchCaregiversForm from './components/Forms/SearchCaregiversForm';
import RatingReviewForm from './components/Forms/RatingReviewForm';
import UserManagement from './components/Admin/UserManagement';
import ContentModeration from './components/Admin/ContentModeration';
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';
import SupportTickets from './components/Admin/SupportTickets';
import DisputeResolution from './components/Admin/DisputeResolution';
import ModerationAction from './components/Admin/ModerationAction';
import UserActivity from './components/Admin/UserActivity';
import JobList from './components/Jobs/JobList';
import JobDetail from './components/Jobs/JobDetail';
import CaregiverJobSearch from './components/Jobs/CaregiverJobSearch';
import JobApplicationForm from './components/Jobs/JobApplicationForm';
import JobApplicationList from './components/Jobs/JobApplicationList';
import JobApplicationUpdate from './components/Jobs/JobApplicationUpdate';
import ProposeJobTime from './components/Jobs/ProposeJobTime';
import AcceptJobTime from './components/Jobs/AcceptJobTime';
import JobApplicationDetails from './components/Jobs/JobApplicationDetails';

// Define types for your stack parameters
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  CareSeekerDashboard: undefined;
  CaregiverDashboard: undefined;
  AdminDashboard: undefined;
  CareSeekerMessaging: undefined;
  JobPostingForm: undefined;
  PaymentManagement: undefined;
  SearchCaregiversForm: undefined;
  RatingReviewForm: undefined;
  JobDetail: { jobId: string };
  JobApplicationList: undefined;
  JobApplicationUpdate: { pk: string };
  ProposeJobTime: { id: string };
  CaregiverMessaging: undefined;
  CaregiverJobSearch: undefined;
  JobApplicationForm: { jobId: string };
  AcceptJobTime: { id: string };
  JobApplicationDetails: { id: string };
  CaregiverJobManagement: undefined;
  UserManagement: undefined;
  ContentModeration: undefined;
  AnalyticsDashboard: undefined;
  SupportTickets: undefined;
  DisputeResolution: undefined;
  ModerationAction: undefined;
  UserActivity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('role');
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setIsLoading(false); // Ensure loading is complete
      }
    };

    fetchUserRole();

    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const renderRoleBasedScreens = () => {
    switch (userRole) {
      case 'care_seeker':
        return (
          <>
            <Stack.Screen name="CareSeekerDashboard" component={CareSeekerDashboard} />
            <Stack.Screen name="CareSeekerMessaging" component={Messaging} />
            <Stack.Screen name="JobPostingForm" component={JobPostingForm} />
            <Stack.Screen name="PaymentManagement" component={PaymentManagement} />
            <Stack.Screen name="SearchCaregiversForm" component={SearchCaregiversForm} />
            <Stack.Screen name="RatingReviewForm" component={RatingReviewForm} />
            <Stack.Screen name="JobDetail" component={JobDetail} />
            <Stack.Screen name="JobApplicationList" component={JobApplicationList} />
            <Stack.Screen name="JobApplicationUpdate" component={JobApplicationUpdate} />
            <Stack.Screen name="ProposeJobTime" component={ProposeJobTime} />
          </>
        );
      case 'caregiver':
        return (
          <>
            <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboard} />
            <Stack.Screen name="CaregiverMessaging" component={Messaging} />
            <Stack.Screen name="CaregiverJobSearch" component={CaregiverJobSearch} />
            <Stack.Screen name="JobDetail" component={JobDetail} />
            <Stack.Screen name="JobApplicationForm" component={JobApplicationForm} />
            <Stack.Screen name="AcceptJobTime" component={AcceptJobTime} />
            <Stack.Screen name="JobApplicationDetails" component={JobApplicationDetails} />
            <Stack.Screen name="CaregiverJobManagement" component={CaregiverJobManagement} />
          </>
        );
      case 'admin':
        return (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="UserManagement" component={UserManagement} />
            <Stack.Screen name="ContentModeration" component={ContentModeration} />
            <Stack.Screen name="PaymentManagement" component={PaymentManagement} />
            <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboard} />
            <Stack.Screen name="SupportTickets" component={SupportTickets} />
            <Stack.Screen name="DisputeResolution" component={DisputeResolution} />
            <Stack.Screen name="ModerationAction" component={ModerationAction} />
            <Stack.Screen name="UserActivity" component={UserActivity} />
          </>
        );
      default:
        return <Stack.Screen name="Home" component={Home} />;
    }
  };

  if (isLoading) {
    return null; // or a loading spinner if desired
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        {/* Public Routes */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />

        {/* Role-based Routes */}
        {renderRoleBasedScreens()}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
