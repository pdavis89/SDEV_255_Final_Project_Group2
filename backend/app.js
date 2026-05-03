const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// sets up request parsing and cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// confirms the api is running
app.get('/', (req, res) => {
  res.json({ message: 'Express backend is running' });
});

// adds course api routes
app.use('/api', courseRoutes);

// adds auth api routes
app.use('/api/auth', authRoutes);

// starts the server after mongodb connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
