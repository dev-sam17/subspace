const express = require('express');

const app = express();
const blogStatsRouter = require('./routes/blog-stats')
const blogSearchRouter = require('./routes/blog-search')

app.use(express.json());
app.use('/api/blog-stats', blogStatsRouter);
app.use('/api/blog-search', blogSearchRouter)

app.get('/', (req, res) => {
    res.send('Subspace Home');
})


module.exports = app;