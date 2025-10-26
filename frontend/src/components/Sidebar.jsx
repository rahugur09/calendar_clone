import React, { useState } from 'react';
import { Search, Plus, Calendar, Users } from 'lucide-react';
import { format, isToday } from 'date-fns';
import MiniCalendar from './MiniCalendar';
import { Group, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
const Sidebar = ({ events, selectedDate, onEventClick, onCreateEvent, onDateSelect }) => {
  const [myCalendarsExpanded, setMyCalendarsExpanded] = useState(true);
  const [otherCalendarsExpanded, setOtherCalendarsExpanded] = useState(true);
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return isToday(eventDate);
  });
  const calendars = [
  ];
  const otherCalendars = [
  ];
  return (
    <aside className="w-64 bg-[#f9fafd] overflow-y-auto flex-shrink-0" style={{ height: '100%' }}>
      <div className="p-3" style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}>
        <button
          onClick={onCreateEvent}
          className="w-xl shadow-sm shadow-gray-400 bg-white rounded-2xl hover:bg-blue-100 text-white px-2 py-4 flex items-center justify-between font-medium mb-3 transition-colors"
        >
          <span className="flex items-center gap-3 text-black mx-2 text-sm">
            <Plus className="w-6 h-6" />
            Create
          </span>
          <ArrowDropDown className="w-3 h-3 ml-1 text-black shadow-sm" />
        </button>
        <MiniCalendar 
          selectedDate={selectedDate} 
          onDateSelect={onDateSelect}
        />
        <div className="mt-4 mb-4 flex justify-center">
          <div className="relative w-full max-w-[200px]">
            <Group className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search for people"
              className="w-full bg-[#eaeef5] pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-0 focus:border-b-2 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mb-2 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer flex items-center justify-between">
          <span>Booking pages</span>
          <Plus className="w-4 h-4" />
        </div>
        <div className="mb-2">
          <div
            className="py-2 text-sm font-medium text-gray-900 cursor-pointer flex items-center justify-between"
            onClick={() => setMyCalendarsExpanded(!myCalendarsExpanded)}
          >
            <span>My calendars</span>
            {myCalendarsExpanded ? <ArrowDropUp className="w-4 h-4" /> : <ArrowDropDown className="w-4 h-4" />}
          </div>
          {myCalendarsExpanded && (
            <div className="pl-2">
              {calendars.map((cal, index) => (
                <label key={index} className="flex items-center gap-2 py-1 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={cal.checked}
                    className="rounded"
                    style={{ accentColor: cal.color }}
                  />
                  <span>{cal.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="mb-2">
          <div
            className="py-2 text-sm font-medium text-gray-900 cursor-pointer flex items-center justify-between"
            onClick={() => setOtherCalendarsExpanded(!otherCalendarsExpanded)}
          >
            <span>Other calendars</span>
            {otherCalendarsExpanded ? <ArrowDropUp className="w-4 h-4" /> : <ArrowDropDown className="w-4 h-4" />}
          </div>
          {otherCalendarsExpanded && (
            <div className="pl-2">
              {otherCalendars.map((cal, index) => (
                <label key={index} className="flex items-center gap-2 py-1 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={cal.checked}
                    className="rounded"
                    style={{ accentColor: cal.color }}
                  />
                  <span>{cal.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="absolute bottom-4 text-xs text-gray-500">
          <a href="#" className="hover:underline">Terms - Privacy</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;