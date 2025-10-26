import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek } from 'date-fns';
import { Search as SearchIcon, HelpOutline, Settings, ArrowDropDown } from '@mui/icons-material';
const Header = ({ 
  selectedDate, 
  view, 
  onViewChange, 
  onDateChange, 
  onCreateEvent,
  events,
  onEventClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const handlePrevious = () => {
    if (view === 'week') {
      onDateChange(subWeeks(selectedDate, 1));
    } else if (view === 'day') {
      onDateChange(subDays(selectedDate, 1));
    } else if (view === 'year') {
      onDateChange(new Date(selectedDate.getFullYear() - 1, 0, 1));
    } else {
      onDateChange(subMonths(selectedDate, 1));
    }
  };
  const handleNext = () => {
    if (view === 'week') {
      onDateChange(addWeeks(selectedDate, 1));
    } else if (view === 'day') {
      onDateChange(addDays(selectedDate, 1));
    } else if (view === 'year') {
      onDateChange(new Date(selectedDate.getFullYear() + 1, 0, 1));
    } else {
      onDateChange(addMonths(selectedDate, 1));
    }
  };
  const handleToday = () => {
    const today = new Date();
    onDateChange(today);
    setTimeout(() => {
      const elements = document.getElementsByClassName('calendar-container');
      if (elements[0]) {
        elements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };
  const getDateTitle = () => {
    if (view === 'week') {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      return format(weekStart, 'MMM d, yyyy');
    } else if (view === 'day') {
      return format(selectedDate, 'EEEE, MMM d, yyyy');
    } else if (view === 'year') {
      return format(selectedDate, 'yyyy');
    } else {
      return format(selectedDate, 'MMMM yyyy');
    }
  };
  const todayDate = new Date();
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents([]);
      setShowSearchResults(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = (events || []).filter(event => {
      const title = event.title?.toLowerCase() || '';
      const description = event.description?.toLowerCase() || '';
      const location = event.location?.toLowerCase() || '';
      return title.includes(query) || 
             description.includes(query) || 
             location.includes(query);
    });
    setFilteredEvents(filtered);
    setShowSearchResults(true);
  }, [searchQuery, events]);
  const handleSearchEventClick = (event) => {
    const eventDate = new Date(event.start_time);
    onDateChange(eventDate);
    onEventClick(event);
    setSearchQuery('');
    setShowSearchResults(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setSearchQuery('');
        setShowSearchResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowViewDropdown(false);
      }
    };
    if (isSearchActive || showViewDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchActive, showViewDropdown]);
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="absolute left-4 top-2 flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="w-10 h-10 flex items-center justify-center">
          <img src={`https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${todayDate.getDate()}_2x.png`} alt="Calendar" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl font-normal text-gray-900">Calendar</span>
      </div>
      <header className="bg-[#f9fafd] flex items-center justify-between px-4 h-16" style={{ paddingLeft: '264px' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-6 py-2 border border-gray-500 rounded-full hover:bg-blue-50 text-sm font-medium text-gray-700 transition-colors"
          >
            Today
          </button>
          <div className="ml-4 flex items-center gap-1">
            <button onClick={handlePrevious} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          <h2 className="ml-4 text-2xl font-light text-gray-900" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            {getDateTitle()}
          </h2>
        </div>
        <div className="flex items-center gap-3" ref={searchRef}>
          {isSearchActive ? (
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 w-96 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                autoFocus
                onBlur={() => {
                  if (searchQuery === '') {
                    setIsSearchActive(false);
                  }
                }}
              />
              {showSearchResults && filteredEvents.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id || event.id}
                      onClick={() => handleSearchEventClick(event)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-1" 
                          style={{ backgroundColor: event.color || '#4599df' }}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(event.start_time), 'MMM d, yyyy')} 
                            {!event.all_day && ` at ${format(new Date(event.start_time), 'h:mm a')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <SearchIcon 
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" 
              onClick={() => setIsSearchActive(true)}
            />
          )}
          <HelpOutline className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Settings className="w-5 h-5 cursor-pointer text-gray-600" />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white cursor-pointer flex items-center gap-2 hover:bg-blue-100 focus:outline-none focus:border-blue-500 focus:border-2 transition-colors"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
              <ArrowDropDown className="w-4 h-4" />
            </button>
            
            {showViewDropdown && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <div 
                    className={`px-4 py-2 cursor-pointer flex justify-between items-center ${view === 'day' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => { onViewChange('day'); setShowViewDropdown(false); }}
                  >
                    <span className="text-sm text-gray-900">Day</span>
                    <span className="text-xs text-gray-500">D</span>
                  </div>
                  <div 
                    className={`px-4 py-2 cursor-pointer flex justify-between items-center ${view === 'week' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => { onViewChange('week'); setShowViewDropdown(false); }}
                  >
                    <span className="text-sm text-gray-900">Week</span>
                    <span className="text-xs text-gray-500">W</span>
                  </div>
                  <div 
                    className={`px-4 py-2 cursor-pointer flex justify-between items-center ${view === 'month' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => { onViewChange('month'); setShowViewDropdown(false); }}
                  >
                    <span className="text-sm text-gray-900">Month</span>
                    <span className="text-xs text-gray-500">M</span>
                  </div>
                  <div 
                    className={`px-4 py-2 cursor-pointer flex justify-between items-center ${view === 'year' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    onClick={() => { onViewChange('year'); setShowViewDropdown(false); }}
                  >
                    <span className="text-sm text-gray-900">Year</span>
                    <span className="text-xs text-gray-500">Y</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
        </div>
      </header>
    </div>
  );
};
export default Header;