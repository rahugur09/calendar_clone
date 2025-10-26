import React, { useState, useEffect } from 'react';
import { Search } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const SearchModal = ({ events, onClose, onEventClick, onDateSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = events.filter(event => {
      const title = event.title?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      const location = event.location?.toLowerCase() || '';
      
      return title.includes(query) || 
             description.includes(query) || 
             location.includes(query);
    });
    
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const handleEventClick = (event) => {
    const eventDate = new Date(event.start_time);
    onDateSelect(eventDate);
    onEventClick(event);
    onClose();
  };

  const handleDateSearch = (dateString) => {
    try {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        onDateSelect(parsedDate);
        onClose();
      }
    } catch (error) {
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, dates, or locations..."
              className="w-full pl-10 pr-4 py-3 text-lg border-0 focus:outline-none"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredEvents.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <div
                  key={event._id || event.id}
                  onClick={() => handleEventClick(event)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1" 
                      style={{ backgroundColor: event.color || '#4599df' }}
                    ></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(event.start_time), 'MMM d, yyyy')} 
                        {!event.all_day && ` at ${format(new Date(event.start_time), 'h:mm a')}`}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-400">{event.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div className="p-8 text-center text-gray-500">
              <p>No events found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search for events...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

