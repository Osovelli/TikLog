import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Sparkles,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { cn } from "@/lib/utils";

const DatePickerComponent = ({
  value,
  onChange,
  label,
  placeholder = "Select date of birth",
  error,
  minAge = 15,
  maxAge = 100,
  className,
  disabled = false,
  showPresets = true,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  
  const maxYear = currentYear - minAge;
  const minYear = currentYear - maxAge;

  const parseDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return {
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
    };
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  
  const [viewMonth, setViewMonth] = useState(currentMonth);
  const [viewYear, setViewYear] = useState(maxYear);
  const [decadeStart, setDecadeStart] = useState(Math.floor(maxYear / 10) * 10);

  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) {
        setSelectedDate(parsed);
        setViewMonth(parsed.month);
        setViewYear(parsed.year);
        setDecadeStart(Math.floor(parsed.year / 10) * 10);
      }
    }
  }, [value]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: viewMonth - 1,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
        isCurrentMonth: false,
      });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: viewMonth + 1,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [viewMonth, viewYear]);

  const decadeYears = useMemo(() => {
    const years = [];
    for (let year = decadeStart; year < decadeStart + 12; year++) {
      years.push(year);
    }
    return years;
  }, [decadeStart]);

  const canGoPrevMonth = viewYear > minYear || (viewYear === minYear && viewMonth > 0);
  const canGoNextMonth = viewYear < maxYear || (viewYear === maxYear && viewMonth < 11);
  const canGoPrevYear = viewYear > minYear;
  const canGoNextYear = viewYear < maxYear;

  const isDateValid = (year, month, day) => {
    const date = new Date(year, month, day);
    const minDate = new Date(minYear, 0, 1);
    const maxDate = new Date(maxYear, 11, 31);
    return date >= minDate && date <= maxDate;
  };

  const isSelected = (day, month, year) => {
    return selectedDate?.day === day && 
           selectedDate?.month === month && 
           selectedDate?.year === year;
  };

  const isToday = (day, month, year) => {
    return day === currentDay && month === currentMonth && year === currentYear;
  };

  // Only close when a DAY is selected (complete date)
  const handleDateSelect = (dayInfo) => {
    if (!isDateValid(dayInfo.year, dayInfo.month, dayInfo.day)) return;
    
    // If clicking a day from different month, navigate to that month first
    if (!dayInfo.isCurrentMonth) {
      const newMonth = dayInfo.month < 0 ? 11 : dayInfo.month > 11 ? 0 : dayInfo.month;
      setViewMonth(newMonth);
      setViewYear(dayInfo.year);
    }
    
    const newDate = { day: dayInfo.day, month: dayInfo.month, year: dayInfo.year };
    setSelectedDate(newDate);
    onChange?.(new Date(dayInfo.year, dayInfo.month, dayInfo.day));
    
    // Close picker after day selection (complete date)
    setIsOpen(false);
    setViewMode('calendar');
  };

  // Month selection - just switch view, don't close
  const handleMonthSelect = (e, monthIndex) => {
    e.stopPropagation();
    setViewMonth(monthIndex);
    setViewMode('calendar'); // Go back to calendar view
    // Don't close - user still needs to select a day
  };

  // Year selection - just switch view, don't close
  const handleYearSelect = (e, year) => {
    e.stopPropagation();
    if (year >= minYear && year <= maxYear) {
      setViewYear(year);
      setViewMode('calendar'); // Go back to calendar view
      // Don't close - user still needs to select month and day
    }
  };

  const goToPrevMonth = (e) => {
    e.stopPropagation();
    if (!canGoPrevMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = (e) => {
    e.stopPropagation();
    if (!canGoNextMonth) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToPrevYear = (e) => {
    e.stopPropagation();
    if (viewYear - 1 >= minYear) setViewYear(viewYear - 1);
  };

  const goToNextYear = (e) => {
    e.stopPropagation();
    if (viewYear + 1 <= maxYear) setViewYear(viewYear + 1);
  };

  const calculatedAge = useMemo(() => {
    if (selectedDate) {
      const birthDate = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return null;
  }, [selectedDate]);

  const displayValue = useMemo(() => {
    if (selectedDate) {
      return `${selectedDate.day} ${monthsShort[selectedDate.month]} ${selectedDate.year}`;
    }
    return '';
  }, [selectedDate]);

  const presets = [
    { 
      label: 'Today', 
      getDate: () => ({ day: currentDay, month: currentMonth, year: currentYear }),
      disabled: currentYear > maxYear
    },
    { 
      label: '18 yrs', 
      getDate: () => ({ day: currentDay, month: currentMonth, year: currentYear - 18 }),
      disabled: (currentYear - 18) > maxYear || (currentYear - 18) < minYear
    },
    { 
      label: '21 yrs', 
      getDate: () => ({ day: currentDay, month: currentMonth, year: currentYear - 21 }),
      disabled: (currentYear - 21) > maxYear || (currentYear - 21) < minYear
    },
    { 
      label: '30 yrs', 
      getDate: () => ({ day: currentDay, month: currentMonth, year: currentYear - 30 }),
      disabled: (currentYear - 30) > maxYear || (currentYear - 30) < minYear
    },
  ];

  // Presets set a complete date, so they can close the picker
  const applyPreset = (e, preset) => {
    e.stopPropagation();
    if (preset.disabled) return;
    const date = preset.getDate();
    setSelectedDate(date);
    setViewMonth(date.month);
    setViewYear(date.year);
    onChange?.(new Date(date.year, date.month, date.day));
    setIsOpen(false); // Close because preset is a complete date
  };

  // Handle popup click to prevent closing
  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.date-picker-container')) {
        setIsOpen(false);
        setViewMode('calendar');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className={cn(
          "text-sm font-medium leading-none",
          error && "text-red-500",
          disabled && "opacity-50"
        )}>
          {label}
        </label>
      )}
      
      <div className="date-picker-container relative">
        {/* Main Trigger */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "h-12 w-full rounded-lg border px-3 flex items-center justify-between cursor-pointer text-sm transition-all",
            disabled ? "bg-gray-100 cursor-not-allowed opacity-50" : "bg-white hover:border-gray-400",
            error ? "border-red-500" : "border-gray-300",
            isOpen && "border-blue-500 ring-2 ring-blue-100"
          )}
        >
          <div className="flex items-center gap-6">
            <span className={displayValue ? "text-gray-900" : "text-gray-500"}>
              {displayValue || placeholder}
            </span>
            {calculatedAge !== null && (
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-2xl font-medium">
                {calculatedAge} yrs
              </span>
            )}
          </div>
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>

        {/* Calendar Popup */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 w-[320px]"
            onClick={handlePopupClick}
          >
            
            {/* Presets */}
            {showPresets && (
              <div className="mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1 mb-2">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span className="text-xs font-medium text-gray-500">Quick select</span>
                </div>
                <div className="flex gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={(e) => applyPreset(e, preset)}
                      disabled={preset.disabled}
                      className={cn(
                        "flex-1 px-2 py-1.5 text-xs rounded-lg transition-colors font-medium",
                        preset.disabled
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={goToPrevYear}
                  disabled={!canGoPrevYear}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                    !canGoPrevYear && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  disabled={!canGoPrevMonth}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                    !canGoPrevMonth && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
              
              {/* Month/Year Display - Clickable */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode(viewMode === 'months' ? 'calendar' : 'months');
                  }}
                  className={cn(
                    "px-2 py-1 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors",
                    viewMode === 'months' && "bg-blue-100 text-blue-700"
                  )}
                >
                  {months[viewMonth]}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode(viewMode === 'years' ? 'calendar' : 'years');
                  }}
                  className={cn(
                    "px-2 py-1 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors",
                    viewMode === 'years' && "bg-blue-100 text-blue-700"
                  )}
                >
                  {viewYear}
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={goToNextMonth}
                  disabled={!canGoNextMonth}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                    !canGoNextMonth && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNextYear}
                  disabled={!canGoNextYear}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                    !canGoNextYear && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <>
                {/* Week Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((dayInfo, index) => {
                    const valid = isDateValid(dayInfo.year, dayInfo.month, dayInfo.day);
                    const selected = isSelected(dayInfo.day, dayInfo.month, dayInfo.year);
                    const today = isToday(dayInfo.day, dayInfo.month, dayInfo.year);
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateSelect(dayInfo);
                        }}
                        disabled={!valid}
                        className={cn(
                          "h-9 w-full rounded-lg text-sm transition-all relative",
                          dayInfo.isCurrentMonth ? "text-gray-900" : "text-gray-400",
                          valid && !selected && "hover:bg-gray-100",
                          selected && "bg-blue-500 text-white font-semibold hover:bg-blue-600",
                          today && !selected && "font-semibold text-blue-600",
                          !valid && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        {dayInfo.day}
                        {today && !selected && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Month Selection View */}
            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={(e) => handleMonthSelect(e, index)}
                    className={cn(
                      "py-3 px-2 text-sm rounded-lg transition-colors",
                      viewMonth === index
                        ? "bg-blue-500 text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    {monthsShort[index]}
                  </button>
                ))}
              </div>
            )}

            {/* Year Selection View */}
            {viewMode === 'years' && (
              <>
                {/* Decade Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDecadeStart(decadeStart - 12);
                    }}
                    disabled={decadeStart - 12 < minYear - 11}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                      decadeStart - 12 < minYear - 11 && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-gray-700">
                    {decadeStart} - {decadeStart + 11}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDecadeStart(decadeStart + 12);
                    }}
                    disabled={decadeStart + 12 > maxYear}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
                      decadeStart + 12 > maxYear && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Year Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {decadeYears.map((year) => {
                    const valid = year >= minYear && year <= maxYear;
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={(e) => handleYearSelect(e, year)}
                        disabled={!valid}
                        className={cn(
                          "py-2.5 text-sm rounded-lg transition-colors",
                          viewYear === year
                            ? "bg-blue-500 text-white font-semibold"
                            : valid
                              ? "hover:bg-gray-100 text-gray-700"
                              : "opacity-30 cursor-not-allowed text-gray-400"
                        )}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DatePickerComponent;