const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simulated data store
let metrics = {
    facebook: {
        followers: 2300,
        engagement: 456,
        posts: 89,
        likes: 12400
    },
    twitter: {
        followers: 5600,
        retweets: 234,
        tweets: 1200,
        likes: 8900
    },
    instagram: {
        followers: 8900,
        posts: 340,
        likes: 45600,
        comments: 2300
    }
};

// Endpoint to get all metrics
app.get('/api/metrics', (req, res) => {
    res.json(metrics);
});

// Endpoint to get platform specific metrics
app.get('/api/metrics/:platform', (req, res) => {
    const platform = req.params.platform.toLowerCase();
    if (metrics[platform]) {
        res.json(metrics[platform]);
    } else {
        res.status(404).json({ error: 'Platform not found' });
    }
});

// Endpoint to update metrics (simulating real-time updates)
app.post('/api/metrics/update', (req, res) => {
    const { platform, metric, value } = req.body;
    if (metrics[platform] && metrics[platform][metric] !== undefined) {
        metrics[platform][metric] = value;
        res.json({ success: true, updated: { platform, metric, value } });
    } else {
        res.status(400).json({ error: 'Invalid platform or metric' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});