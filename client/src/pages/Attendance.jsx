import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    try {
      // Fetch all students (simplified for this demo, usually you'd filter by class/dept)
      const stRes = await axios.get('http://localhost:5000/api/students', { params: { limit: 100 } });
      const studentList = stRes.data.students || [];
      setStudents(studentList);

      // Fetch attendance for the selected date
      const attRes = await axios.get(`http://localhost:5000/api/attendance/${date}`);
      const records = {};
      attRes.data.forEach(r => {
        records[r.studentId] = r.status;
      });
      setAttendanceRecords(records);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    try {
      // Save each record
      for (const student of students) {
        const status = attendanceRecords[student.id] || 'Present'; // default to Present if unmarked
        await axios.post('http://localhost:5000/api/attendance', {
          studentId: student.id,
          date,
          status
        });
      }
      alert('Attendance saved successfully!');
      fetchData();
    } catch (err) {
      console.error('Error saving attendance', err);
      alert('Failed to save attendance.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Module</h2>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="outline-none bg-transparent text-sm font-medium text-gray-700"
            />
          </div>
          <button onClick={saveAttendance} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
            <Save className="w-4 h-4" /> Save Attendance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Reg No</th>
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold text-center">Present</th>
                <th className="p-4 font-semibold text-center">Absent</th>
                <th className="p-4 font-semibold text-center">Leave</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No students available.</td></tr>
              ) : (
                students.map(s => {
                  const status = attendanceRecords[s.id] || 'Present';
                  return (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 text-sm text-gray-900 font-medium">{s.regNo}</td>
                      <td className="p-4 text-sm text-gray-700">{s.name}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleStatusChange(s.id, 'Present')} className={`p-1.5 rounded-full transition-colors ${status === 'Present' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-300 hover:text-emerald-500'}`}>
                          <CheckCircle className="w-6 h-6" />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleStatusChange(s.id, 'Absent')} className={`p-1.5 rounded-full transition-colors ${status === 'Absent' ? 'bg-red-100 text-red-600' : 'text-gray-300 hover:text-red-500'}`}>
                          <XCircle className="w-6 h-6" />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleStatusChange(s.id, 'Leave')} className={`p-1.5 rounded-full transition-colors ${status === 'Leave' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-300 hover:text-yellow-500'}`}>
                          <AlertCircle className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
