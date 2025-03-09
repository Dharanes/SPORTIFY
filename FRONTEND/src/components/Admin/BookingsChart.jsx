import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { blue, green, orange, red } from '@mui/material/colors';

// Registering chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingsChart = ({ bookingsData }) => {
  // Data for the bar chart
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // Days of the week
    datasets: [
      {
        label: 'Bookings per Day',
        data: bookingsData, // Bookings data passed as props
        backgroundColor: [blue[500], green[500], orange[500], red[500], blue[400], green[400], orange[400]], // Color for each bar
        borderColor: 'white', // Border color for bars
        borderWidth: 2,
      },
    ],
  };

  // Options for customizing the chart appearance
  const options = {
    responsive: true, // Makes the chart responsive to window resizing
    plugins: {
      title: {
        display: true,
        text: 'Bookings per Day of the Week',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const bookingCount = context.raw;
            return `${context.dataset.label}: ${bookingCount} bookings`;
          },
        },
      },
      legend: {
        display: false, // Hides the legend if not needed
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#444',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#444',
        },
      },
    },
    animation: {
      duration: 1500, // Sets animation speed
      easing: 'easeInOutQuart', // Easing function for smooth animations
    },
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BookingsChart;
