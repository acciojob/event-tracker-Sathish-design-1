import React, { useState } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Popup from 'react-popup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/App.css';

const localizer = BigCalendar.momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('ALL');

  // Logic to handle clicking an empty date slot to create an event
  const handleSelectSlot = ({ start }) => {
    Popup.create({
      title: 'Create Event',
      content: (
        <div>
          <input id="event-title" className="mm-popup__input" placeholder="Event Title" />
          <input id="event-location" className="mm-popup__input" placeholder="Event Location" />
        </div>
      ),
      buttons: {
        left: ['cancel'],
        right: [{
          text: 'Save',
          className: 'mm-popup__btn mm-popup__btn--success',
          action: () => {
            const title = document.getElementById('event-title').value;
            const location = document.getElementById('event-location').value;
            if (title) {
              const newEvent = {
                id: Math.random(),
                title,
                location,
                start,
                end: start,
              };
              setEvents([...events, newEvent]);
              Popup.close();
            }
          }
        }]
      }
    });
  };

  // Logic to handle clicking an existing event for Edit/Delete
  const handleSelectEvent = (event) => {
    Popup.create({
      title: event.title,
      content: (
        <div>
          <p>Date: {moment(event.start).format('MMMM DD, YYYY')}</p>
          <p>Location: {event.location}</p>
        </div>
      ),
      buttons: {
        left: [{
          text: 'Edit',
          className: 'mm-popup__btn--info',
          action: () => {
            Popup.close();
            // Optional: Re-open a popup with input fields to update the event title
          }
        }],
        right: [{
          text: 'Delete',
          className: 'mm-popup__btn--danger',
          action: () => {
            setEvents(events.filter(e => e.id !== event.id));
            Popup.close();
          }
        }]
      }
    });
  };

  // Filter implementation: All, Past, and Upcoming
  const filteredEvents = events.filter(event => {
    const isPast = moment(event.start).isBefore(moment(), 'day');
    if (filter === 'PAST') return isPast;
    if (filter === 'UPCOMING') return !isPast;
    return true;
  });

  // Dynamic styling: Pink for past, Green for upcoming
  const eventStyleGetter = (event) => {
    const isPast = moment(event.start).isBefore(moment(), 'day');
    return {
      style: {
        backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
        color: 'white',
        border: 'none'
      }
    };
  };

  return (
    <div className="App">
      <Popup />
      <header className="header">
        <h1>March 2023</h1>
        <div className="filter-buttons">
          <button className="btn" onClick={() => setFilter('ALL')}>All</button>
          <button className="btn" onClick={() => setFilter('PAST')}>Past</button>
          <button className="btn" onClick={() => setFilter('UPCOMING')}>Upcoming</button>
        </div>
      </header>
      
      <div style={{ height: '500px' }}>
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default App;