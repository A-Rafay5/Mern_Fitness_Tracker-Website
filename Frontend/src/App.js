import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import { HelmetProvider } from "react-helmet-async";
import PageWrapper from './authentication/PageWrapper';

// Authentication components
import SignUp from './authentication/SignUp';
import Login from './authentication/Login';

// Dashboard pages and components
import Dashboard from './pages/Dashboard'; 
import Profile from './pages/Profile'; 
import DashboardLayout from './components/Layout/DashboardLayout';
import CreateWorkout from './pages/CreateWorkout';
import Workouts from './pages/Workouts';
import NutritionTracking from './pages/NutritionTracking';
import CreateNutrition from './pages/CreateNutrition';
import CreateProgress from './pages/CreateProgress';
import Progress from './pages/Progress';

// General Website Layout
import WebsiteLayout from './components/WebsiteLayout/WebsiteLayout'; 
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Wingman from './pages/Wingman';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          {/* Routes and Views */}
          <Routes>
            {/* General routes with WebsiteLayout (for non-dashboard pages) */}
            <Route element={<WebsiteLayout />}>       
              <Route path="/" element={<PageWrapper title="Home"><Home /></PageWrapper>} />
              <Route path="/signup" element={<PageWrapper title="Sign Up"><SignUp /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper title="Login"><Login /></PageWrapper>} />
              <Route path="/wingman" element={<PageWrapper title="Wingman"><Wingman /></PageWrapper>} />
              <Route path="/about-us" element={<PageWrapper title="About Us"><AboutUs /></PageWrapper>} />
            </Route>

            {/* Wrap Dashboard and Profile pages inside DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<PageWrapper title="Dashboard"><Dashboard /></PageWrapper>} />
              <Route path="/dashboard/profile" element={<PageWrapper title="Profile"><Profile /></PageWrapper>} />
              <Route path="/dashboard/workout/create" element={<PageWrapper title="Create Workout"><CreateWorkout /></PageWrapper>} />
              <Route path="/dashboard/workouts" element={<PageWrapper title="Workouts"><Workouts /></PageWrapper>} />
              <Route path="/dashboard/nutrition/create" element={<PageWrapper title="Create Nutrition Log"><CreateNutrition /></PageWrapper>} />
              <Route path="/dashboard/nutrition" element={<PageWrapper title="Nutrition Tracking"><NutritionTracking /></PageWrapper>} />
              <Route path="/dashboard/progress/create" element={<PageWrapper title="Create Progress"><CreateProgress /></PageWrapper>} />
              <Route path="/dashboard/progress" element={<PageWrapper title="Progress"><Progress /></PageWrapper>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
