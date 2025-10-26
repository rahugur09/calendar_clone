import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';

const DayView = ({ events, selectedDate, onDateClick, onEventClick, loading }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return isSameDay(eventDate, selectedDate);
  });
  const getEventStyle = (event) => {
    if (event.all_day) {
      return {
        top: '0px',
        height: '1440px',
        left: '52px',
        right: '12px',
      };
    }
    
    const startTime = new Date(event.start_time);
    const endTime = new Date(event.end_time);
    
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    
    const top = (startHour + startMinute / 60) * 60;
    const duration = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;
    
    return {
      top: `${top}px`,
      height: `${Math.max(duration, 30)}px`,
      left: '52px',
      right: '12px',
    };
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className={`mx-10 text-2xl font-medium ${isToday(selectedDate) ? 'text-white bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center' : 'text-gray-900'}`}>
            {format(selectedDate, 'd')}
          </h2>
          <h2 className={`text-2xl font-medium ${isToday(selectedDate) ? 'text-white bg-blue-600 rounded-full px-4 py-1 flex items-center justify-center' : 'text-gray-900'} mx-10`}>
            {format(selectedDate, 'EEEE')}
          </h2>
        </div>
      </div>

      <div className="relative" style={{ minHeight: '1440px' }}>
        {hours.map((hour) => (
          <div key={hour} className="relative border-b border-gray-100" style={{ height: '60px' }}>
            <div className="absolute left-0 top-0 w-12 h-full flex items-center justify-end pr-2 text-xs text-gray-500">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>

            <div className="absolute left-12 right-0 h-full flex items-center">
              <div className="border-t border-gray-100 w-full"></div>
            </div>

            {hour === 0 && dayEvents.map((event) => {
              const style = getEventStyle(event);
              return (
                <div
                  key={event._id || event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className="absolute rounded px-2 py-1 text-xs font-medium text-white cursor-pointer hover:opacity-90 transition-opacity z-10 shadow-sm overflow-hidden"
                  style={{
                    ...style,
                    backgroundColor: event.color || '#4599df'
                  }}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  {event.all_day ? (
                    <div className="text-xs opacity-90 mt-0.5">All day</div>
                  ) : (
                    <div className="text-xs opacity-90 mt-0.5">
                      {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                    </div>
                  )}
                </div>
              );
            })}

            <div
              className="absolute left-12 right-0 h-full cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onDateClick(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;