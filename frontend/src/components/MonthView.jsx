import React, { useMemo, useRef, useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, differenceInWeeks } from 'date-fns';
const MonthView = ({ events, selectedDate, onDateClick, onEventClick, loading, onDateChange }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const numWeeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
  const rowHeight = useMemo(() => {
    const totalHeight = 'calc(100vh - 64px - 47px)';
    return `calc(${totalHeight} / ${numWeeks})`;
  }, [numWeeks]);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const scrollContainerRef = useRef(null);
  const lastScrollTop = useRef(0);
  const isScrolling = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const currentScrollTop = container.scrollTop;
      const scrollDelta = currentScrollTop - lastScrollTop.current;
      if (Math.abs(scrollDelta) > 100 && !isScrolling.current) {
        isScrolling.current = true;
        setFadeClass('opacity-0 transition-opacity duration-200');
        setTimeout(() => {
          if (scrollDelta > 0) {
            onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
          } else {
            onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
          }
          
          setTimeout(() => {
            container.scrollTop = 0;
            setFadeClass('opacity-100 transition-opacity duration-200');
            isScrolling.current = false;
          }, 50);
        }, 200);
      }
      
      lastScrollTop.current = currentScrollTop;
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedDate, onDateChange]);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events</p>
        </div>
      </div>
    );
  }
  let day = startDate;
  const rows = [];
  while (day <= endDate) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      const dayEvents = getEventsForDay(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isCurrentDay = isToday(day);
      const isSelectedDay = isSameDay(day, selectedDate);
      const currentDay = new Date(day);
      row.push(
        <div
          key={day.toISOString()}
          className={`border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors bg-white ${isCurrentDay ? 'bg-blue-500' : ''} ${isSelectedDay ? 'bg-blue-100' : ''}`}
          style={{ height: rowHeight }}
          onClick={() => onDateClick(currentDay)}
        >
          <div className="flex justify-center items-start h-5 mb-4">
            <span
              className={`text-sm font-medium ${!isCurrentMonth ? 'text-[#454746]' : 'text-[#1f1f1f]'} ${
                  isCurrentDay ? 'text-[#ffffff] font-semibold bg-[#4599df] rounded-full px-1.5 py-1' : ''
              } `}
            >
              {day.getDate() === 1 ? format(day, 'MMM d') : format(day, 'd')}
            </span>
          </div>
          <div className="space-y-0.5 mt-1">
            {dayEvents.slice(0, 3).map((event, idx) => (
              <div
                key={event._id || event.id || `${day.toISOString()}-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                className="text-xs px-2 py-1.5 rounded-lg text-white font-medium truncate cursor-pointer hover:opacity-70 transition-opacity"
                style={{ backgroundColor: event.color || '#4599df' }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toISOString()} className="grid grid-cols-7">
        {row}
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-white" style={{ zIndex: 30 }}>
        <div className="grid grid-cols-7">
          {weekDays.map((dayName) => (
            <div key={dayName} className="p-3 text-center text-xs font-medium text-gray-600 uppercase border-r border-gray-200">
              {dayName}
            </div>
          ))}
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-white">
        <div className={fadeClass}>
          {rows}
        </div>
      </div>
    </div>
  );
};

export default MonthView;