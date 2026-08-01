require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001','http://127.0.0.1:3000','http://127.0.0.1:3001'], credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/', rateLimit({ windowMs: 15*60*1000, max: 500 }));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/parties',      require('./routes/parties'));
app.use('/api/candidates',   require('./routes/candidates'));
app.use('/api/performance',  require('./routes/performance'));
app.use('/api/constituency', require('./routes/constituency'));
app.use('/api/ai',           require('./routes/ai'));
app.use('/api/stats',        require('./routes/stats'));
app.use('/api/news',         require('./routes/news'));
app.use('/api/auth/oauth',  require('./routes/oauth'));

app.use('/api/workflow',     require('./routes/workflow'));

app.get('/api/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🗳️  VoteWise India — http://localhost:${PORT}/api\n`);
});
