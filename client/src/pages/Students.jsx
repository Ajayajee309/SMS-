import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, Download, X, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    regNo: '', rollNumber: '', name: '', department: '', year: '', 
    email: '', phone: '', parentName: '', address: '', dob: '', gender: 'Male'
  });

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get('https://sms-server-s2nt.onrender.com/api/students', {
        params: { search, department: departmentFilter, year: yearFilter, page, limit }
      });
      setStudents(res.data.students);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  }, [search, departmentFilter, yearFilter, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchStudents]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setCurrentStudent(null);
    setFormData({
      regNo: '', rollNumber: '', name: '', department: '', year: '', 
      email: '', phone: '', parentName: '', address: '', dob: '', gender: 'Male'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({
      regNo: student.regNo || '', rollNumber: student.rollNumber || '', name: student.name || '', 
      department: student.department || '', year: student.year || '', email: student.email || '', 
      phone: student.phone || '', parentName: student.parentName || '', address: student.address || '', 
      dob: student.dob || '', gender: student.gender || 'Male'
    });
    setIsModalOpen(true);
  };

  const openViewModal = (student) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const saveStudent = async (e) => {
    e.preventDefault();
    try {
      if (currentStudent) {
        await axios.put(`https://sms-server-s2nt.onrender.com/api/students/${currentStudent.id}`, formData);
      } else {
        await axios.post('https://sms-server-s2nt.onrender.com/api/students', formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Error saving student. Please check inputs.');
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://sms-server-s2nt.onrender.com/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const exportToExcel = async () => {
    try {
      // Fetch all without limit for export
      const res = await axios.get('https://sms-server-s2nt.onrender.com/api/students', {
        params: { search, department: departmentFilter, year: yearFilter, limit: 10000 }
      });
      const data = res.data.students.map(s => ({
        'Registration No': s.regNo, 'Roll No': s.rollNumber, 'Name': s.name,
        'Department': s.department, 'Year': s.year, 'Email': s.email, 'Phone': s.phone
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Students");
      XLSX.writeFile(wb, "Student_Report.xlsx");
    } catch(e) { console.error(e); }
  };

  const exportToPDF = async () => {
    try {
      const res = await axios.get('https://sms-server-s2nt.onrender.com/api/students', {
        params: { search, department: departmentFilter, year: yearFilter, limit: 10000 }
      });
      const data = res.data.students;
      const doc = new jsPDF();
      doc.text("Student Report", 14, 15);
      doc.autoTable({
        head: [['Reg No', 'Roll No', 'Name', 'Dept', 'Year', 'Phone']],
        body: data.map(s => [s.regNo, s.rollNumber, s.name, s.department, s.year, s.phone]),
        startY: 20
      });
      doc.save("Student_Report.pdf");
    } catch(e) { console.error(e); }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={openAddModal} className="admin-only bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-1/3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search name, reg no..."
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
          <select 
            value={yearFilter} 
            onChange={e => { setYearFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 bg-white"
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Reg No / Roll No</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-sm">
                      <div className="font-medium text-gray-900">{s.regNo}</div>
                      <div className="text-xs text-gray-500">{s.rollNumber || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-blue-600">{s.name}</td>
                    <td className="p-4 text-sm text-gray-700">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                        {s.department}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{s.year}</td>
                    <td className="p-4 text-sm">
                      <div className="text-gray-900">{s.phone || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{s.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(s)} className="text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(s)} className="admin-only text-gray-500 hover:text-emerald-600 p-1.5 rounded-md hover:bg-emerald-50 transition-colors" title="Edit Student">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteStudent(s.id)} className="admin-only text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors" title="Delete Student">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {currentStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="admin-only text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={saveStudent} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration No *</label>
                  <input required name="regNo" value={formData.regNo} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select required name="year" value={formData.year} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                  <input name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                  <textarea name="address" rows="3" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-only px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="admin-only px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  {currentStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isViewModalOpen && currentStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{currentStudent.name}</h3>
                <p className="text-blue-100 mt-1">{currentStudent.department} • {currentStudent.year}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-white hover:text-blue-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Registration Number</p>
                <p className="text-gray-900 font-medium">{currentStudent.regNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Roll Number</p>
                <p className="text-gray-900 font-medium">{currentStudent.rollNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-gray-900 font-medium">{currentStudent.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                <p className="text-gray-900 font-medium">{currentStudent.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Gender</p>
                <p className="text-gray-900 font-medium">{currentStudent.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Date of Birth</p>
                <p className="text-gray-900 font-medium">{currentStudent.dob || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Parent Name</p>
                <p className="text-gray-900 font-medium">{currentStudent.parentName || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                <p className="text-gray-900 font-medium">{currentStudent.address || 'N/A'}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(currentStudent);
                }} 
                className="admin-only px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
