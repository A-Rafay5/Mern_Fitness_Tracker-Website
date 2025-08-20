import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressChart from '../components/charts/ProgressChart';
import NutritionChart from '../components/charts/NutritionChart';

const Dashboard = () => {
  const navigate = useNavigate();

  // Check if user is logged in by looking for the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');

    // If no token found, redirect to login page
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center py-2">
      <div className="max-w-7xl w-full px-4 sm:px-6 md:px-8">

        <div className="w-full space-y-8"> {/* Stack the charts vertically */}
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Nutrition Breakdown</h2>
            <NutritionChart />
          </div><div className="bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h2>
            <ProgressChart />
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
