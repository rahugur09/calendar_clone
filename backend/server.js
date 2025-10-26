const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar_clone';
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Connection error:', err);
});
db.once('open', () => {
  console.log('Connected to database');
});
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  all_day: { type: Boolean, default: false },
  color: { type: String, default: '#4285f4' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
const Event = mongoose.model('Event', eventSchema);
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});
app.get('/api/events', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    if (startDate && endDate) {
      query.start_time = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const events = await Event.find(query).sort({ start_time: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, start_time, end_time, startTime, endTime, all_day, allDay, color } = req.body;
    const startDate = start_time || startTime;
    const endDate = end_time || endTime;
    const allDayEvent = all_day !== undefined ? all_day : allDay || false;
    const event = new Event({
      title,
      description: description || '',
      start_time: new Date(startDate),
      end_time: new Date(endDate),
      all_day: allDayEvent,
      color: color || '#4285f4',
    });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});
app.delete('/api/events', async (req, res) => {
  try {
    await Event.deleteMany({});
    res.json({ message: 'All events deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete events' });
  }
});
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_time, end_time, startTime, endTime, all_day, allDay, color } = req.body;
    const startDate = start_time || startTime;
    const endDate = end_time || endTime;
    const allDayEvent = all_day !== undefined ? all_day : allDay || false;
    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description: description || '',
        start_time: new Date(startDate),
        end_time: new Date(endDate),
        all_day: allDayEvent,
        color: color || '#4285f4',
        updated_at: new Date(),
      },
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});
module.exports = app;