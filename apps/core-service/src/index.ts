import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check endpoint to confirm the service is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Core Service' });
});

app.listen(PORT, () => {
  console.log(`Core Service is running on http://localhost:${PORT}`);
});