import React from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';

const Calendar = ({ 
  events, 
  selectedDate, 
  view, 
  onDateClick, 
  onEventClick, 
  onDateChange,
  loading 
}) => {
  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView
            events={events}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onDateChange={onDateChange}
            loading={loading}
          />
        );
      case 'week':
        return (
          <WeekView
            events={events}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onDateChange={onDateChange}
            loading={loading}
          />
        );
      case 'day':
        return (
          <DayView
            events={events}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onDateChange={onDateChange}
            loading={loading}
          />
        );
      case 'year':
        return (
          <YearView
            events={events}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            loading={loading}
          />
        );
      default:
        return (
          <MonthView
            events={events}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onDateChange={onDateChange}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm mr-2 shadow-gray-400 border border-gray-200 overflow-hidden h-[99.5%]">
      {renderView()}
    </div>
  );
};

export default Calendar;
