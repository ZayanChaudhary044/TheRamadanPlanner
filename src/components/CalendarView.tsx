import React, { useState, useEffect } from 'react';
import { Moon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  date: string;
  title: string;
  description: string;
  completed?: boolean;
}

function CalendarView() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('ramadan-activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newActivity, setNewActivity] = useState({ title: '', description: '' });

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title) return;

    const activity = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newActivity.title,
      description: newActivity.description,
      completed: false
    };

    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    localStorage.setItem('ramadan-activities', JSON.stringify(updatedActivities));
    setNewActivity({ title: '', description: '' });
    setShowForm(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    
    // Add empty days for padding
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getActivitiesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return activities.filter(activity => activity.date === dateString);
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <div className="max-w-6xl mx-auto p-6">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-semibold">Ramadan Planner</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to Daily View
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">{monthYear}</h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-32" />;
              }

              const dateActivities = getActivitiesForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const dateString = day.toISOString().split('T')[0];

              return (
                <div
                  key={day.getTime()}
                  className={`h-32 border rounded-lg p-2 ${
                    isToday ? 'border-indigo-500' : 'border-gray-200'
                  } hover:border-indigo-500 transition-colors cursor-pointer`}
                  onClick={() => {
                    setSelectedDate(dateString);
                    setShowForm(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-indigo-600' : 'text-gray-700'
                    }`}>
                      {day.getDate()}
                    </span>
                    {dateActivities.length > 0 && (
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {dateActivities.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dateActivities.slice(0, 2).map(activity => (
                      <div
                        key={activity.id}
                        className="text-xs truncate text-gray-600"
                      >
                        {activity.title}
                      </div>
                    ))}
                    {dateActivities.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dateActivities.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <form onSubmit={addActivity}>
                <h2 className="text-xl font-semibold mb-4">
                  Add Activity for {new Date(selectedDate).toLocaleDateString()}
                </h2>
                <input
                  type="text"
                  placeholder="Activity Title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="w-full border rounded px-3 py-2 mb-3"
                />
                <textarea
                  placeholder="Description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 mb-4 h-24"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarView;