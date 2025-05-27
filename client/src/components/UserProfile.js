import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import { FaRegUser } from "react-icons/fa";

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

const UserProfile = () => {
  const userId = localStorage.getItem('userId');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [metric, setMetric] = useState('wpm');
  const [timeframe, setTimeframe] = useState('week'); // 'week' or 'month'
  const [timerLength, setTimerLength] = useState(30); // 15, 30, or 60
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, []);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await axios.get(`http://localhost:5001/api/results/${userId}`);
        setResults(res.data);
      } catch (err) {
        console.error('Failed to load user results', err);
      }
    }
    fetchResults();
  }, [userId]);

  const topWPM = Math.max(...results.map(r => r.wpm), 0);
  const topAccuracy = Math.max(...results.map(r => r.accuracy), 0);

  const today = dayjs();
  let labels = [];

  if (timeframe === 'week') {
    labels = Array.from({ length: 7 }, (_, i) =>
      today.subtract(6 - i, 'day').format('MMM D')
    );
  }

  if (timeframe === 'month') {
    labels = Array.from({ length: 30 }, (_, i) =>
      today.subtract(29 - i, 'day').format('MMM D')
    );
  }

  const groupedResults = {};
  results.forEach(r => {
    if (r.time !== timerLength) return; // filter by test duration

    const date = dayjs(r.timestamp);
    let key = timeframe === 'week' ? date.format('dddd') : date.format('MMM D');

    if (!groupedResults[key]) groupedResults[key] = [];
    groupedResults[key].push(metric === 'wpm' ? r.wpm : r.accuracy);
  });

  const data = labels.map(label => {
    const values = groupedResults[label];
    if (!values) return null;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(avg * 10) / 10;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: metric.toUpperCase(),
        data,
        borderColor: '#4f46e5',
        backgroundColor: '#4f46e5',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: metric === 'wpm' ? 200 : 100,
        ticks: {
          stepSize: metric === 'wpm' ? 20 : 10,
          callback: value => {
            if (metric === 'wpm') return [0, 100, 200].includes(value) ? `${value} wpm` : '';
            return [0, 50, 100].includes(value) ? `${value}%` : '';
          }
        },
        title: {
          display: true,
          text: metric === 'wpm' ? 'wpm' : 'accuracy'
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          autoSkip: false,
          callback: function (val, index) {
            const label = this.getLabelForValue(val);
            
            if (timeframe === 'week') {
              return index === 0 || index === 3 || index === 6 ? label : '';
            }

            if (timeframe === 'month') {
              return index === 0 || index === 15 || index === 29 ? label : '';
            }

            return '';
          }
        },
        title: {
          display: true,
          text: timeframe === 'week' ? 'week' : 'month'
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="bg-background p-8">
      <div className="bg-overlay rounded-2xl h-[25vh] w-[90vw] mx-auto flex items-center justify-center mb-12">
        <div className="flex items-center gap-4 text-accent text-9xl font-bold ">
          <FaRegUser />
          {isLoggedIn && <h2 className="text-4xl font-bold text-accentText">{username}</h2>}
        </div>
        <div className="flex md:ml-12 lg:ml-32 gap-8 sm:gap-10 md:gap-14 lg:gap-20">
          <div>
            <p className="font-bold text-3xl text-accent mb-3">top wpm</p>
            <p className="text-5xl font-bold text-accentText">{topWPM}</p>
          </div>
          <div>
            <p className="font-bold text-3xl text-accent mb-3">top accuracy</p>
            <p className="text-5xl font-bold text-accentText">{topAccuracy}%</p>
          </div>
        </div>
      </div>

      <div className="w-[90vw] mx-auto flex font-semibold justify-end text-sm text-accentText mb-4 gap-4 flex-wrap">
        <div className="rounded-2xl px-6 py-1 h-[4vh] bg-overlay flex gap-4 items-center">
          <button onClick={() => setMetric('wpm')} className={`hover:text-accent ${metric === 'wpm' ? 'bg-yellow-400 text-background px-2 rounded' : ''}`}>wpm</button>
          <button onClick={() => setMetric('accuracy')} className={`hover:text-accent ${metric === 'accuracy' ? 'bg-yellow-400 text-background px-2 rounded' : ''}`}>accuracy</button>
        </div>
        <div className="rounded-2xl px-6 py-1 h-[4vh] bg-overlay flex gap-4 items-center">
          <button onClick={() => setTimeframe('week')} className={`hover:text-accent ${timeframe === 'week' ? 'bg-yellow-400 text-background px-2 rounded' : ''}`}>week</button>
          <button onClick={() => setTimeframe('month')} className={`hover:text-accent ${timeframe === 'month' ? 'bg-yellow-400 text-background px-2 rounded' : ''}`}>month</button>
        </div>
        <div className="rounded-2xl px-6 py-1 h-[4vh] bg-overlay flex gap-4 items-center">
          {[15, 30, 60].map(time => (
            <button
              key={time}
              onClick={() => setTimerLength(time)}
              className={`hover:text-accent px-2 rounded ${timerLength === time ? 'bg-yellow-400 text-background' : ''}`}
            >
              {time}s
            </button>
          ))}
        </div>
      </div>

      <div className="bg-overlay rounded-2xl h-[50vh] w-[90vw] mx-auto flex justify-center items-center">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default UserProfile;