import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isToday, isSameDay } from 'date-fns';
const WeekView = ({ events, selectedDate, onDateClick, onEventClick, loading }) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };
  const getEventStyle = (event, day) => {
    const eventDay = new Date(event.start_time);
    const currentDay = day;
    
    if (isSameDay(eventDay, currentDay)) {
      if (event.all_day) {
        return {
          top: '0px',
          height: '1440px',
          left: '2px',
          right: '2px',
        };
      }
      
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);
      
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();
      const endHour = endTime.getHours();
      const endMinute = endTime.getMinutes();
      const top = (startHour * 60) + (startMinute * (60 / 60));
      const durationInHours = (endHour - startHour) + (endMinute - startMinute) / 60;
      const height = durationInHours * 60;
      return {
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`,
        left: '2px',
        right: '2px',
      };
    }
    
    return {
      top: '0px',
      height: '0px',
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
    <div className="h-full overflow-auto bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-1 border-r border-gray-200 bg-gray-50"></div>
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 pb-5 text-center border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className={`text-xs ${isToday(day) ? 'text-blue-600' : 'text-gray-600'} font-medium uppercase mb-1`}>
                {format(day, 'EEE')}
              </div>
              <div className={`text-2xl font-normal ${isToday(day) ? 'text-white bg-[#4599df] rounded-full w-10 h-10 flex items-center justify-center mx-auto' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative" style={{ minHeight: '1440px' }}>
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100 relative" style={{ height: '60px' }}>
            <div className="flex items-center justify-end pr-2 text-xs text-gray-500 border-r border-gray-200 bg-gray-50">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
            {weekDays.map((day) => (
              <div
                key={day}
                className="relative border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onDateClick(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour))}
              >
              </div>
            ))}
          </div>
        ))}
        {weekDays.map((day, dayIndex) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={`events-${day}`}
              className="absolute top-0 pointer-events-none"
              style={{
                left: `${(dayIndex + 1) * (100 / 8)}%`,
                width: `${100 / 9}%`,
                height: '1440px',
              }}
            >
              {dayEvents.map((event) => {
                const style = getEventStyle(event, day);
                return (
                  <div
                    key={event._id || event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="absolute rounded px-2 py-1 text-xs font-medium text-white cursor-pointer hover:opacity-90 transition-opacity z-10 shadow-sm pointer-events-auto overflow-hidden"
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
                        {format(new Date(event.start_time), 'h:mm a')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;