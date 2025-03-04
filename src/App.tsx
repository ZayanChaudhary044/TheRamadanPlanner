import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DailyView from './components/DailyView';
import CalendarView from './components/CalendarView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DailyView />} />
      <Route path="/calendar" element={<CalendarView />} />
    </Routes>
  );
}

export default App;