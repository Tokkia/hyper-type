import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

// ✅ Chart.js v3+ requires manual registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserProfile = ({ userId, username }) => {
  const [results, setResults] = useState([]);
  const [metric, setMetric] = useState('wpm'); // or 'accuracy'
  const [timeframe, setTimeframe] = useState('all'); // 'day', 'week', etc.

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await axios.get(`http://localhost:5000/api/results/${userId}`);
        setResults(res.data);
      } catch (err) {
        console.error('Failed to load user results', err);
      }
    }
    fetchResults();
  }, [userId]);

  const topWPM = Math.max(...results.map(r => r.wpm), 0);
  const topAccuracy = Math.max(...results.map(r => r.accuracy), 0);

  const labels = results.map(r => new Date(r.timestamp).toLocaleDateString());
  const data = results.map(r => metric === 'wpm' ? r.wpm : r.accuracy);

  const chartData = {
    labels,
    datasets: [
      {
        label: metric.toUpperCase(),
        data,
        fill: false,
        borderColor: '#4f46e5',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="bg-gray-800 p-6 rounded-xl max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <span className="text-4xl mr-4">👤</span>
          <h2 className="text-2xl font-bold">{username}</h2>
        </div>
        <div className="flex justify-around text-lg mb-6">
          <div>
            <p className="uppercase text-sm text-gray-400">top wpm</p>
            <p className="text-3xl font-semibold">{topWPM}</p>
          </div>
          <div>
            <p className="uppercase text-sm text-gray-400">top accuracy</p>
            <p className="text-3xl font-semibold">{topAccuracy}%</p>
          </div>
        </div>

        {/* Metric + Time Filter */}
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <button onClick={() => setMetric('wpm')} className="px-3 py-1 bg-indigo-600 rounded">WPM</button>
            <button onClick={() => setMetric('accuracy')} className="px-3 py-1 bg-gray-700 rounded">Accuracy</button>
          </div>
          <div className="space-x-2">
            <button onClick={() => setTimeframe('day')} className="text-sm text-gray-400">Day</button>
            <button onClick={() => setTimeframe('week')} className="text-sm text-gray-400">Week</button>
            <button onClick={() => setTimeframe('month')} className="text-sm text-gray-400">Month</button>
            <button onClick={() => setTimeframe('6month')} className="text-sm text-gray-400">6 Month</button>
            <button onClick={() => setTimeframe('all')} className="text-sm text-white font-semibold">All Time</button>
          </div>
        </div>

        <Line data={chartData} />
      </div>
    </div>
  );
};

export default UserProfile;