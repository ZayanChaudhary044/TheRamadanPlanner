import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Plus, Check, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  date: string;
  title: string;
  description: string;
  completed?: boolean;
}

function DailyView() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('ramadan-activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', description: '' });

  useEffect(() => {
    localStorage.setItem('ramadan-activities', JSON.stringify(activities));
  }, [activities]);

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

    setActivities([...activities, activity]);
    setNewActivity({ title: '', description: '' });
    setShowForm(false);
  };

  const toggleComplete = (id: string) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredActivities = activities.filter(activity => activity.date === selectedDate);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-semibold">Ramadan Planner</h1>
          </div>
          <p className="text-gray-600">Be Ready For Ramadan</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-auto">
              <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 w-full"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="flex items-center justify-center gap-2 bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex-1 sm:flex-initial"
              >
                <Calendar className="w-4 h-4" />
                <span>View Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <form onSubmit={addActivity}>
                <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
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

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              className={`bg-white rounded-lg shadow-sm p-4 transition-colors ${
                activity.completed ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={activity.completed ? 'opacity-50' : ''}>
                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                  <p className="text-gray-400 text-sm mb-1">{formatDate(activity.date)}</p>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
                <button
                  onClick={() => toggleComplete(activity.id)}
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  {activity.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {filteredActivities.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No activities planned for this day
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyView;