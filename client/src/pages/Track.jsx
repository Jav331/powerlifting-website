import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles/Track.css';

const localizer = momentLocalizer(moment);

const Track = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`https://6r2f6r0qfc.execute-api.us-east-2.amazonaws.com/workouts/${userId}`);
      const formattedWorkouts = response.data.map(workout => {
        const workoutDate = new Date(workout.date);
        const localDate = new Date(workoutDate.getTime() + workoutDate.getTimezoneOffset() * 60000);
        return {
          ...workout,
          start: localDate,
          end: localDate,
          title: workout.description
        };
      });
      setWorkouts(formattedWorkouts);
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts. Please try again later.');
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const localDate = new Date(slotInfo.start.getTime() + slotInfo.start.getTimezoneOffset() * 60000);
    setSelectedDate(localDate);
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !description) return;

    try {
      await axios.post('https://6r2f6r0qfc.execute-api.us-east-2.amazonaws.com/track', {
        userId,
        date: selectedDate.toISOString().split('T')[0],
        description
      });
      fetchWorkouts();
      setDescription('');
      setSelectedDate(null);
    } catch (error) {
      console.error('Error tracking workout:', error);
      setError('Failed to add workout. Please try again later.');
    }
  };

  const handleDelete = async (workoutId) => {
    try {
      await axios.delete(`https://6r2f6r0qfc.execute-api.us-east-2.amazonaws.com/workouts/${workoutId}`);
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError('Failed to delete workout. Please try again later.');
    }
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };

    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate('current');
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
      );
    };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>Prev</button>
          <button type="button" onClick={goToCurrent}>Today</button>
          <button type="button" onClick={goToNext}>Next</button>
        </span>
        <span className="rbc-toolbar-label">{label()}</span>
      </div>
    );
  };

  const CustomDateCellWrapper = ({ children, value }) => {
    const isSelected = selectedDate && moment(value).isSame(selectedDate, 'day');
    const child = React.Children.only(children);
    
    return React.cloneElement(child, {
      style: {
        ...child.props.style,
        backgroundColor: isSelected ? '#007bff' : undefined,
        color: isSelected ? 'white' : undefined,
        transition: 'background-color 0.3s ease',
      },
      className: `${child.props.className || ''} ${isSelected ? 'selected-day-cell' : ''} custom-date-cell`,
    });
  };

  const CustomEvent = ({ event }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSelectedEvent(event)}
        className="custom-event"
      >
        <span>{event.title}</span>
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(event.id);
            }}
            className="delete-button"
          >
            x
          </button>
        )}
      </div>
    );
  };

  const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>{event.title}</h2>
          <p>Date: {moment(event.start).format('MMMM D, YYYY')}</p>
          <pre>{event.description}</pre>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="track-container">
      <h2>Track Your Workouts</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="track-content">
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={workouts}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            selectable
            views={['month']}
            components={{
              toolbar: CustomToolbar,
              dateCellWrapper: CustomDateCellWrapper,
              event: CustomEvent,
            }}
          />
        </div>
        <div className="form-container">
          <h3>Add Workout</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Date: </label>
              <input 
                type="date" 
                value={selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''} 
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Description: </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workout (i.e&#10;Incline Dumbbell: 4x12&#10;Decline Flies: 4x12&#10;etc.)"
                required
              />
            </div>
            <button type="submit" className="add-workout-btn">Add Workout</button>
          </form>
        </div>
      </div>
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default Track;