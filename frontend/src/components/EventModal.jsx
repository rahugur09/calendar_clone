import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AccessTime, Description, CalendarToday } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
const EventModal = ({ event, selectedDate, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    allDay: false,
    color: '#4599df',
    description: ''
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const colors = [
    '#4599df', '#c3291c', '#D88277', '#e25d33', '#832DA4',
    '#616161', '#7C86C6', '#4351AF', '#397E49', '#5EB47E', '#EEC14C'
  ];

  const startDate = formData.startTime ? new Date(formData.startTime) : null;
  const endDate = formData.endTime ? new Date(formData.endTime) : null;
  const calendarStart = startOfWeek(startOfMonth(currentCalendarMonth));
  const calendarEnd = endOfWeek(endOfMonth(currentCalendarMonth));
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        startTime: event.start_time ? format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm") : '',
        endTime: event.end_time ? format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm") : '',
        allDay: event.all_day || false,
        color: event.color || '#4599df',
        description: event.description || ''
      });
      if (event.description) {
        setShowDescriptionInput(true);
      }
    } else {
      const startTime = new Date(selectedDate);
      
      const hasHourSet = startTime.getHours() !== 0 || startTime.getMinutes() !== 0;
      
      if (!hasHourSet) {
        startTime.setHours(9, 0, 0, 0);
      }
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1, startTime.getMinutes(), 0, 0);

      const formattedStart = format(startTime, "yyyy-MM-dd'T'HH:mm");
      const formattedEnd = format(endTime, "yyyy-MM-dd'T'HH:mm");

      setFormData({
        title: '',
        startTime: formattedStart,
        endTime: formattedEnd,
        allDay: false,
        color: '#4599df',
        description: ''
      });
      setShowDescriptionInput(false);
      const dateOnly = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
      setCurrentCalendarMonth(dateOnly);
    }
  }, [event, selectedDate]);

  const handleSave = () => {
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    let startDate = new Date(formData.startTime);
    let endDate = new Date(formData.endTime);
    
    if (isNaN(startDate.getTime())) {
      alert('Invalid start time. Please select a valid date and time.');
      return;
    }
    
    if (isNaN(endDate.getTime())) {
      alert('Invalid end time. Please select a valid date and time.');
      return;
    }
    
    if (formData.allDay) {
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
    }
    
    const eventData = {
      title: formData.title,
      description: formData.description,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      all_day: formData.allDay,
      color: formData.color
    };
    
    onSave(eventData);

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const eventId = event._id || event.id;
      onDelete(eventId);
      onClose();
    }
  };

  const timeOptions = [];
  for (let hour24 = 0; hour24 < 24; hour24++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const isPM = hour24 >= 12;
      let displayHour = hour24 === 0 ? 12 : hour24;
      if (isPM && hour24 !== 12) {
        displayHour = hour24 - 12;
      }
      
      const minuteStr = minute.toString().padStart(2, '0');
      const timeLabel = minute === 0
        ? `${displayHour}:00${isPM ? 'pm' : 'am'}`
        : `${displayHour}:${minuteStr}${isPM ? 'pm' : 'am'}`;
      
      timeOptions.push({ 
        label: timeLabel, 
        hour: hour24, 
        minute 
      });
    }
  }

  const handleDateSelect = (date) => {
    const currentStart = new Date(formData.startTime);
    const currentEnd = new Date(formData.endTime);
    
    const newStart = new Date(date);
    newStart.setHours(currentStart.getHours(), currentStart.getMinutes());
    
    const newEnd = new Date(date);
    const duration = currentEnd - currentStart;
    newEnd.setTime(newStart.getTime() + duration);
    
    setFormData({
      ...formData,
      startTime: format(newStart, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(newEnd, "yyyy-MM-dd'T'HH:mm")
    });
    
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const handleTimeSelect = (timeOption, isEnd = false) => {
    if (isEnd) {
      const currentEnd = formData.endTime ? new Date(formData.endTime) : new Date(formData.startTime);
      currentEnd.setHours(timeOption.hour, timeOption.minute);
      setFormData({ ...formData, endTime: format(currentEnd, "yyyy-MM-dd'T'HH:mm") });
      setShowEndTimePicker(false);
    } else {
      const currentStart = formData.startTime ? new Date(formData.startTime) : new Date();
      currentStart.setHours(timeOption.hour, timeOption.minute);
      setFormData({ ...formData, startTime: format(currentStart, "yyyy-MM-dd'T'HH:mm") });
      setShowStartTimePicker(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-lg shadow-2xl z-50 rounded-2xl overflow-hidden"
        style={{ animation: 'scaleIn 0.2s ease-out' }}
      >
        <style>
          {`
            @keyframes scaleIn {
              from {
                transform: translate(-50%, -50%) scale(0.95);
                opacity: 0;
              }
              to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `}
        </style>

        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="w-10 h-10"></div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          {/* Title Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Add title and time"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-2xl font-normal border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none pb-2"
            />
          </div>

          {/* Date/Time Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <AccessTime className="w-5 h-5 text-gray-500" />
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 hover:bg-gray-50 text-left"
                  >
                    {startDate ? format(startDate, 'EEEE, MMMM d') : 'Select date'}
                  </button>
                  {showStartDatePicker && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => setCurrentCalendarMonth(subMonths(currentCalendarMonth, 1))}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <h4 className="font-medium">{format(currentCalendarMonth, 'MMMM yyyy')}</h4>
                          <button
                            onClick={() => setCurrentCalendarMonth(addMonths(currentCalendarMonth, 1))}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <div key={day} className="text-center text-xs text-gray-500 font-medium">{day}</div>
                          ))}
                          {calendarDays.map((day) => (
                            <button
                              key={day.toISOString()}
                              onClick={() => handleDateSelect(day)}
                              className={`p-2 text-sm rounded-lg ${
                                startDate && isSameDay(day, startDate) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                              }`}
                            >
                              {format(day, 'd')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {!formData.allDay && (
                  <>
                    <div className="relative">
                      <button
                        onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 hover:bg-gray-50 whitespace-nowrap"
                      >
                        {startDate ? format(startDate, 'h:mmaaa').toLowerCase() : 'Start time'}
                      </button>
                      {showStartTimePicker && (
                        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                          {timeOptions.map((time) => (
                            <div
                              key={time.label}
                              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleTimeSelect(time, false)}
                            >
                              {time.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <span>-</span>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 hover:bg-gray-50 whitespace-nowrap"
                      >
                        {endDate ? format(endDate, 'h:mmaaa').toLowerCase() : 'End time'}
                      </button>
                      {showEndTimePicker && (
                        <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                          {timeOptions.map((time) => (
                            <div
                              key={time.label}
                              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleTimeSelect(time, true)}
                            >
                              {time.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5"></div>
              <input
                type="checkbox"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm text-gray-700">All day</label>
              <span className="ml-auto text-sm text-blue-600 cursor-pointer hover:underline">Time zone</span>
            </div>
          </div>
          <div 
            className="flex items-center gap-3 mb-3 py-2 cursor-pointer hover:bg-gray-50 rounded"
            onClick={() => setShowDescriptionInput(true)}
          >
            <Description className="w-5 h-5 text-gray-500" />
            <div className="text-sm text-gray-900 flex-1">
              {showDescriptionInput || formData.description ? (
                <textarea
                  placeholder="Add description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                'Add description or a Google Drive attachment'
              )}
            </div>
          </div>

          {/* Calendar Selection */}
          <div className="flex items-center gap-3 mb-6 py-2">
            <CalendarToday className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 font-medium">Calendar</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formData.color }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Free • Default visibility
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
          {event && onDelete && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium ml-auto"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default EventModal;