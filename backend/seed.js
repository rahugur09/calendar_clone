const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar_clone';
mongoose.connect(MONGODB_URI);
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
const sampleEvents = [
  {
    title: 'Team Meeting',
    description: 'Weekly team standup',
    start_time: new Date('2024-01-15T10:00:00Z'),
    end_time: new Date('2024-01-15T11:00:00Z'),
    all_day: false,
    color: '#4285f4'
  },
  {
    title: 'Project Deadline',
    description: 'Submit final project',
    start_time: new Date('2024-01-20T23:59:00Z'),
    end_time: new Date('2024-01-20T23:59:00Z'),
    all_day: false,
    color: '#ea4335'
  },
  {
    title: 'Vacation',
    description: 'Family vacation',
    start_time: new Date('2024-01-25T00:00:00Z'),
    end_time: new Date('2024-01-27T23:59:59Z'),
    all_day: true,
    color: '#34a853'
  },
  {
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    start_time: new Date('2024-01-18T14:30:00Z'),
    end_time: new Date('2024-01-18T15:30:00Z'),
    all_day: false,
    color: '#fbbc04'
  }
];
async function seed() {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      await Event.insertMany(sampleEvents);
    }
    mongoose.connection.close();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
}
mongoose.connection.once('open', () => {
  console.log('Connected to DB');
  seed();
});
mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
});
