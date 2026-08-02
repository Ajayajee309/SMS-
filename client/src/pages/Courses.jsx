import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '', name: '', department: '', semester: '', credits: ''
  });

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get('https://sms-server-s2nt.onrender.com/api/courses', {
        params: { search, department: departmentFilter, page, limit }
      });
      setCourses(res.data.courses);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  }, [search, departmentFilter, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchCourses]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setCurrentCourse(null);
    setFormData({ code: '', name: '', department: '', semester: '', credits: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      code: course.code || '', name: course.name || '', department: course.department || '',
      semester: course.semester || '', credits: course.credits || ''
    });
    setIsModalOpen(true);
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      if (currentCourse) {
        await axios.put(`https://sms-server-s2nt.onrender.com/api/courses/${currentCourse.id}`, formData);
      } else {
        await axios.post('https://sms-server-s2nt.onrender.com/api/courses', formData);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert('Error saving course.');
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`https://sms-server-s2nt.onrender.com/api/courses/${id}`);
        fetchCourses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={openAddModal} className="admin-only bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-1/3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search course name or code..."
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={departmentFilter} 
            onChange={e => { setDepartmentFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 bg-white"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Electrical">Electrical</option>
            <option value="Civil">Civil</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Course Code</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Semester</th>
                <th className="p-4 font-semibold">Credits</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No courses found.</td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{c.code}</td>
                    <td className="p-4 text-sm font-medium text-blue-600">{c.name}</td>
                    <td className="p-4 text-sm text-gray-700">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">{c.department}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{c.semester}</td>
                    <td className="p-4 text-sm text-gray-700">{c.credits}</td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(c)} className="admin-only text-gray-500 hover:text-emerald-600 p-1.5 rounded-md hover:bg-emerald-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteCourse(c.id)} className="admin-only text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div>Showing page {page} of {totalPages}</div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">{currentCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="admin-only text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={saveCourse} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input required name="code" value={formData.code} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select required name="department" value={formData.department} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
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
                  <select required name="semester" value={formData.semester} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option value="">Select Semester</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input type="number" name="credits" value={formData.credits} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-only px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="admin-only px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  {currentCourse ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
