'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const DateRange = ({ start, end, className }) => {
  const [formattedRange, setFormattedRange] = useState('');

  useEffect(() => {
    const formatDates = () => {
      try {
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        // Same day event
        if (startDate.toDateString() === endDate.toDateString()) {
          return startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
        
        // Same month
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })} - ${endDate.toLocaleDateString('en-US', {
            day: 'numeric',
            year: 'numeric'
          })}`;
        }
        
        // Different months
        return `${startDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })} - ${endDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}`;
      } catch (error) {
        console.error('Error formatting date range:', error);
        return 'Invalid date';
      }
    };

    setFormattedRange(formatDates());
  }, [start, end]);

  return (
    <span className={className}>
      {formattedRange || 'Loading dates...'}
    </span>
  );
};

DateRange.propTypes = {
  start: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired,
  end: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired,
  className: PropTypes.string
};

export default DateRange;