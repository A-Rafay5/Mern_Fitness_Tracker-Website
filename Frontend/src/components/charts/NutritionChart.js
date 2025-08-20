import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importing DatePicker CSS

const NutritionChart = () => {
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering

  const fetchNutritionData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/nutrition/get', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (response.ok) {
        setNutritionEntries(data);
        setLoading(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false); // Set loading to false if error occurs
    }
  };

  useEffect(() => {
    fetchNutritionData();
  }, []);

  // Filter nutrition entries based on selected date range
  const filterDataByDate = () => {
    if (!startDate || !endDate) return nutritionEntries;
    return nutritionEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const chartData = filterDataByDate().map(entry => {
    // Calculate the total calories, protein, carbs, and fats for all food items in the entry
    const totalCalories = entry.foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProtein = entry.foodItems.reduce((sum, item) => sum + (item.macros.protein || 0), 0);
    const totalCarbs = entry.foodItems.reduce((sum, item) => sum + (item.macros.carbs || 0), 0);
    const totalFats = entry.foodItems.reduce((sum, item) => sum + (item.macros.fats || 0), 0);

    return {
      date: new Date(entry.date).toLocaleDateString(), // Ensure date format
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
    };
  });

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="p-6">
        {error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : loading ? (
          <p className="text-center text-gray-600">Loading your nutrition data...</p>
        ) : (
          <>
            {/* Date Range Picker */}
            <div className="flex justify-center mb-6 border-b border-t border-gray-300 pt-3 pb-3">
              <div className="mr-4">
                <label htmlFor="start-date">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="MM/DD/YYYY"
                  dateFormat="MM/dd/yyyy"
                  className="form-control p-2 border rounded-md shadow-sm ml-2"
                  id="start-date"
                />
              </div>
              <span className="text-lg my-auto">to</span>
              <div className="ml-4">
                <label htmlFor="end-date">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="MM/DD/YYYY"
                  dateFormat="MM/dd/yyyy"
                  className="form-control p-2 border rounded-md shadow-sm ml-2"
                  id="end-date"
                />
              </div>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} barCategoryGap="10%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => `${name}: ${value.toFixed(2)}g`} />
                  <Legend />
                  <Bar dataKey="calories" fill="#ff7300" barSize={20} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="protein" fill="#387908" barSize={20} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="carbs" fill="#00c49f" barSize={20} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="fats" fill="#ff0044" barSize={20} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600">No nutrition data available for the selected date range.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NutritionChart;
