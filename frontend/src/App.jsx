import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { getEvents, createEvent, updateEvent, deleteEvent } from './services/api';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = await createEvent(eventData);
      setEvents([...events, newEvent]);
      setShowEventModal(false);
    } catch (error) {
      alert('Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const eventId = selectedEvent._id || selectedEvent.id;
      const updatedEvent = await updateEvent(eventId, eventData);
      setEvents(events.map(event => {
        const currentEventId = event._id || event.id;
        return currentEventId === eventId ? updatedEvent : event;
      }));
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      alert('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => (event._id || event.id) !== eventId));
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen bg-[#f9fafd] overflow-hidden" style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}>
      <Header 
        selectedDate={selectedDate}
        view={view}
        onViewChange={setView}
        onDateChange={setSelectedDate}
        onCreateEvent={() => setShowEventModal(true)}
        events={events}
        onEventClick={handleEventClick}
      />
      
      <div className="flex" style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
        <Sidebar 
          events={events}
          selectedDate={selectedDate}
          onEventClick={handleEventClick}
          onCreateEvent={() => setShowEventModal(true)}
          onDateSelect={setSelectedDate}
        />
        
        <main className="flex-1 overflow-hidden">
          <Calendar
            events={events}
            selectedDate={selectedDate}
            view={view}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onDateChange={setSelectedDate}
            loading={loading}
          />
        </main>
      </div>

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          onDelete={selectedEvent ? handleDeleteEvent : null}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;