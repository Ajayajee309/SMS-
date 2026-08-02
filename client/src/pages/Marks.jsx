import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Save, X, MessageCircle } from 'lucide-react';

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '', courseId: '', semester: 'Semester 1', internalMarks: 0, semesterMarks: 0
  });

  useEffect(() => {
    fetchMarks();
    fetchDropdownData();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await axios.get('https://sms-server-s2nt.onrender.com/api/marks');
      setMarks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [stRes, crRes] = await Promise.all([
        axios.get('https://sms-server-s2nt.onrender.com/api/students', { params: { limit: 100 } }),
        axios.get('https://sms-server-s2nt.onrender.com/api/courses', { params: { limit: 100 } })
      ]);
      setStudents(stRes.data.students || []);
      setCourses(crRes.data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveMark = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://sms-server-s2nt.onrender.com/api/marks', formData);
      setIsModalOpen(false);
      fetchMarks();
    } catch (err) {
      console.error(err);
      alert('Error saving marks.');
    }
  };

  const openAddModal = () => {
    setFormData({ studentId: '', courseId: '', semester: 'Semester 1', internalMarks: 0, semesterMarks: 0 });
    setIsModalOpen(true);
  };

  const getGradeColor = (grade) => {
    if (grade === 'O' || grade === 'A+') return 'text-emerald-600 bg-emerald-100';
    if (grade === 'A' || grade === 'B+') return 'text-blue-600 bg-blue-100';
    if (grade === 'B') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const sendWhatsAppMarks = (mark) => {
    const student = mark.Student;
    const course = mark.Course;
    if (!student || !student.phone) {
      alert("Student phone number is not available.");
      return;
    }
    const message = `Hello ${student.name},\nYour marks for ${course?.name} (${mark.semester}) are out.\n\n*Internal:* ${mark.internalMarks}\n*Semester Exam:* ${mark.semesterMarks}\n*Total:* ${mark.totalMarks}\n*Grade:* ${mark.grade}\n\nKeep up the good work!`;
    const url = `https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Marks Management</h2>
        <button onClick={openAddModal} className="admin-only bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
          <Plus className="w-4 h-4" /> Add Marks
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Semester</th>
                <th className="p-4 font-semibold">Internal</th>
                <th className="p-4 font-semibold">Semester Exam</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Grade</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {marks.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                marks.map(m => (
                  <tr key={m.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{m.Student?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-700">{m.Course?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-700">{m.semester}</td>
                    <td className="p-4 text-sm text-gray-700">{m.internalMarks}</td>
                    <td className="p-4 text-sm text-gray-700">{m.semesterMarks}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{m.totalMarks}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${getGradeColor(m.grade)}`}>
                        {m.grade}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => sendWhatsAppMarks(m)} className="text-gray-500 hover:text-green-600 p-1.5 rounded-md transition-colors" title="Send WhatsApp Results">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Add Marks Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="admin-only text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={saveMark} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                <select required name="studentId" value={formData.studentId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option value="">-- Choose Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.regNo})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course *</label>
                <select required name="courseId" value={formData.courseId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                <select required name="semester" value={formData.semester} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Marks</label>
                  <input type="number" step="0.1" name="internalMarks" value={formData.internalMarks} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester Marks</label>
                  <input type="number" step="0.1" name="semesterMarks" value={formData.semesterMarks} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-only px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="admin-only px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm"><Save className="w-4 h-4 inline mr-2"/>Save Marks</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
