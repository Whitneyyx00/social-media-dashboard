import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState('all');

    useEffect(() => {
        fetchMetrics();
        // Simulate real-time updates
        const interval = setInterval(() => {
            simulateMetricUpdate();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/metrics');
            const data = await response.json();
            setMetrics(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch metrics');
            setLoading(false);
        }
    };

    const simulateMetricUpdate = async () => {
        const platforms = ['facebook', 'twitter', 'instagram'];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const metrics = ['followers', 'likes'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = Math.floor(Math.random() * 1000);

        try {
            await fetch('http://localhost:3001/api/metrics/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ platform, metric, value }),
            });
            fetchMetrics();
        } catch (err) {
            console.error('Error updating metrics:', err);
        }
    };

    if (loading) return <div className='loading'>Loading dashboard...</div>;
    if (error) return <div className='error'>{error}</div>;
    if (!metrics) return null;

    const getChartData = () => {
        const data = [];
        Object.entries(metrics).forEach(([platform, platformMetrics]) => {
            if (selectedPlatform === 'all' || selectedPlatform === platform) {
                Object.entries(platformMetrics).forEach(([metric, value]) => {
                    data.push({
                        platform,
                        metric,
                        value
                    });
                });
            }
        });
        return data;
    };

    return (
        <div className='dashboard'>
            <header className='dashboard-header'>
                <h1>Social Media Analytics Dashboard</h1>
                <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className='platform-selector'
                >
                    <option value='all'>All Platforms</option>
                    <option value='facebook'>Facebook</option>
                    <option value='twitter'>Twitter</option>
                    <option value='instagram'>Instagram</option>
                </select>
            </header>

            <div className='metrics-grid'>
                {Object.entries(metrics).map(([platform, platformMetrics]) => (
                    (selectedPlatform === 'all' || selectedPlatform === platform) && (
                        <div key={platform} className={`platform-card ${platform}`}>
                            <h2>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h2>
                            <div className='metrics-container'>
                                {Object.entries(platformMetrics).map(([metric, value]) => (
                                    <div key={metric} className='metric-item'>
                                        <span className='metric-label'>
                                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                                        </span>
                                        <span className='metric-value'>{value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            <div className='chart-container'>
                <h2>Metrics Comparison</h2>
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke='#8884d8'
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;