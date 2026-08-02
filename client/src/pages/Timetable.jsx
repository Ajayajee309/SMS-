import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    department: '', semester: 'Semester 1', dayOfWeek: 'Monday',
    startTime: '', endTime: '', courseId: '', teacherId: '', roomNumber: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
    fetchDropdowns();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/timetable');
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [crs, tch] = await Promise.all([
        axios.get('http://localhost:5000/api/courses', { params: { limit: 100 } }),
        axios.get('http://localhost:5000/api/teachers', { params: { limit: 100 } })
      ]);
      setCourses(crs.data.courses || []);
      setTeachers(tch.data.teachers || []);
    } catch(err) { console.error(err); }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveEntry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/timetable', formData);
      setIsModalOpen(false);
      fetchTimetable();
    } catch (err) {
      console.error(err);
      alert('Error saving timetable entry.');
    }
  };

  const deleteEntry = async (id) => {
    if (window.confirm('Delete this timetable entry?')) {
      try {
        await axios.delete(`http://localhost:5000/api/timetable/${id}`);
        fetchTimetable();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Timetable</h2>
        <button onClick={() => { setFormData({ department: '', semester: 'Semester 1', dayOfWeek: 'Monday', startTime: '', endTime: '', courseId: '', teacherId: '', roomNumber: '' }); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
        <div className="flex flex-wrap gap-6">
          {days.map(day => {
            const dayEntries = timetable.filter(t => t.dayOfWeek === day);
            if (dayEntries.length === 0) return null;
            return (
              <div key={day} className="w-full lg:w-[calc(50%-1.5rem)] xl:w-[calc(33.333%-1.5rem)]">
                <h3 className="font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-t-lg border border-gray-200 border-b-0">
                  {day}
                </h3>
                <div className="border border-gray-200 rounded-b-lg p-2 space-y-2">
                  {dayEntries.map(entry => (
                    <div key={entry.id} className="bg-blue-50 border border-blue-100 rounded-lg p-3 relative group">
                      <button onClick={() => deleteEntry(entry.id)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="text-sm font-bold text-blue-900">{formatTime(entry.startTime)} - {formatTime(entry.endTime)}</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{entry.Course?.name} ({entry.Course?.code})</p>
                      <p className="text-xs text-gray-600">Prof. {entry.Teacher?.name}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">Room {entry.roomNumber}</span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">{entry.department} • {entry.semester}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {timetable.length === 0 && (
            <div className="w-full text-center py-12 text-gray-500">No timetable entries found.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Add Timetable Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={saveEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select required name="department" value={formData.department} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Civil">Civil</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                  <select required name="semester" value={formData.semester} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                  </select>
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week *</label>
                  <select required name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input required type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input required type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <select required name="courseId" value={formData.courseId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher *</label>
                <select required name="teacherId" value={formData.teacherId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option value="">-- Choose Teacher --</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                  <input required name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
