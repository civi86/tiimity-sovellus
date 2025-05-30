import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB yhdistetty'))
  .catch((err) => console.error('❌ MongoDB virhe:', err));

app.get('/', (req, res) => {
  res.send('Tiimiprojekti-backend toimii!');
});

app.listen(PORT, () => {
  console.log(`🚀 Palvelin käynnissä portissa ${PORT}`);
});
