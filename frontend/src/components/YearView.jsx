import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isSameDay } from 'date-fns';

const YearView = ({ events, selectedDate, onDateClick, onEventClick, loading }) => {
  const year = selectedDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const renderMonth = (monthStart) => {
    const monthName = format(monthStart, 'MMMM');
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const days = [];
    
    let day = startDate;
    while (day <= endDate) {
      const dayEvents = getEventsForDay(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isCurrentDay = isToday(day);
      
      days.push({
        date: day,
        dayNum: day.getDate(),
        isCurrentMonth,
        isCurrentDay,
        events: dayEvents
      });
      
      day = addDays(day, 1);
    }
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return { monthName, days, weeks };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      <div className="grid grid-cols-4 gap-6">
        {months.map((monthStart) => {
          const { monthName, weeks } = renderMonth(monthStart);
          return (
            <div key={monthName} className="bg-white">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">{monthName}</h3>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName, idx) => (
                  <div key={idx} className="text-xs text-center text-gray-500 font-medium pb-1">
                    {dayName}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weeks.map((week, weekIdx) =>
                  week.map((day, dayIdx) => {
                    const shouldHighlightToday = day.isCurrentDay && day.isCurrentMonth;
                    return (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`text-xs text-center p-1 cursor-pointer hover:bg-gray-100 rounded ${
                          !day.isCurrentMonth ? 'text-gray-300' : ''
                        } ${shouldHighlightToday ? 'bg-blue-500 text-white rounded-full' : ''}`}
                        onClick={() => onDateClick(day.date)}
                      >
                        <div className="text-center">{day.dayNum}</div>
                        {day.isCurrentMonth && day.events.length > 0 && (
                          <div className="flex justify-center gap-0.5 mt-0.5">
                            {day.events.slice(0, 3).map((event, idx) => (
                              <div
                                key={event._id || event.id || idx}
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: event.color || '#4599df' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEventClick(event);
                                }}
                              ></div>
                            ))}
                            {day.events.length > 3 && (
                              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearView;

