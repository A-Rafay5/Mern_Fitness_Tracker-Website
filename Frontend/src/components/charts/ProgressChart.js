import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importing DatePicker CSS

const ProgressChart = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering

  const fetchProgressData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/progress/get', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProgressEntries(data.progressEntries);
        setBaseline(data.progressEntries[0]); // Set the first entry as baseline
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
    fetchProgressData();
  }, []);

  const calculateProgress = (entry) => {
    if (!baseline) return 0;

    const weightWeight = 0.2;
    const waistWeight = 0.3;
    const chestWeight = 0.1;
    const runTimeWeight = 0.2;
    const benchPressWeight = 0.2;

    const weightChange = baseline.weight ? ((entry.weight - baseline.weight) / baseline.weight) * 100 : 0;
    const waistChange = baseline.waist ? ((baseline.waist - entry.waist) / baseline.waist) * 100 : 0; // Waist reduction is good
    const chestChange = baseline.chest ? ((entry.chest - baseline.chest) / baseline.chest) * 100 : 0; // Chest increase is good
    const runTimeChange = baseline.runTime ? ((baseline.runTime - entry.runTime) / baseline.runTime) * 100 : 0; // Less time is good
    const benchPressChange = baseline.benchPress ? ((entry.benchPress - baseline.benchPress) / baseline.benchPress) * 100 : 0; // More weight lifted is good

    // Sum up the weighted percentage changes for progress
    const progress =
      (weightChange * weightWeight) +
      (waistChange * waistWeight) +
      (chestChange * chestWeight) +
      (runTimeChange * runTimeWeight) +
      (benchPressChange * benchPressWeight);

    // Ensure progress is between 0% and 100%
    return Math.max(0, Math.min(100, progress));
  };

  // Filter progress entries based on selected date range
  const filterDataByDate = () => {
    if (!startDate || !endDate) return progressEntries;
    return progressEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const chartData = filterDataByDate().map(entry => ({
    date: new Date(entry.date).toLocaleDateString(), // Ensure date format
    progress: calculateProgress(entry)
  }));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      {error ? (
        <p className="text-red-600 font-semibold">Error: {error}</p>
      ) : loading ? (
        <p className="text-gray-600">Loading your progress...</p>
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
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#4CAF50" fill="#4CAF50" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No progress data available for the selected date range.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressChart;
