import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MiniCalendar = ({ selectedDate, onDateSelect }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handlePrevious = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onDateSelect(prevMonth);
  };

  const handleNext = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onDateSelect(nextMonth);
  };

  return (
    <div className="mb-3 p-2 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{format(selectedDate, 'MMMM yyyy')}</span>
        <div className="flex items-center gap-1">
          <button onClick={handlePrevious} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={handleNext} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, i) => (
          <div key={i} className="text-xs text-center text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);
          const isSelectedDay = isSameDay(day, selectedDate);

          return (
            <button
              key={i}
              onClick={() => onDateSelect(day)}
              className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                !isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
              } ${
                isCurrentDay ? 'bg-blue-500 text-white font-medium rounded-full' : ''
              } ${
                isSelectedDay && !isCurrentDay ? 'bg-blue-100 text-blue-600' : ''
              } hover:bg-gray-100`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
