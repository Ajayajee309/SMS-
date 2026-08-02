import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, MessageCircle } from 'lucide-react';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  
  const [formData, setFormData] = useState({
    studentId: '', amount: '', feeType: 'Tuition', dueDate: '', status: 'Pending', paymentDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feeRes, stRes] = await Promise.all([
        axios.get('https://sms-server-s2nt.onrender.com/api/fees'),
        axios.get('https://sms-server-s2nt.onrender.com/api/students', { params: { limit: 1000 } })
      ]);
      setFees(feeRes.data);
      setStudents(stRes.data.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setCurrentFee(null);
    setFormData({ studentId: '', amount: '', feeType: 'Tuition', dueDate: '', status: 'Pending', paymentDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (fee) => {
    setCurrentFee(fee);
    setFormData({
      studentId: fee.studentId || '', amount: fee.amount || '', feeType: fee.feeType || 'Tuition',
      dueDate: fee.dueDate || '', status: fee.status || 'Pending', paymentDate: fee.paymentDate || ''
    });
    setIsModalOpen(true);
  };

  const saveFee = async (e) => {
    e.preventDefault();
    try {
      if (currentFee) {
        await axios.put(`https://sms-server-s2nt.onrender.com/api/fees/${currentFee.id}`, formData);
      } else {
        await axios.post('https://sms-server-s2nt.onrender.com/api/fees', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error saving fee.');
    }
  };

  const deleteFee = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await axios.delete(`https://sms-server-s2nt.onrender.com/api/fees/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Paid') return 'text-emerald-600 bg-emerald-100';
    if (status === 'Pending') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const sendWhatsAppReminder = (fee) => {
    const student = students.find(s => s.id === fee.studentId);
    if (!student || !student.phone) {
      alert("Student phone number is not available.");
      return;
    }
    const message = `Hello ${student.name},\nThis is a reminder regarding your ${fee.feeType} fee of $${fee.amount}.\nThe status is currently *${fee.status}* and the due date is ${fee.dueDate || 'N/A'}.\n\nPlease arrange for payment. Thank you!`;
    const url = `https://wa.me/${student.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Fees Management</h2>
        <button onClick={openAddModal} className="admin-only bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
          <Plus className="w-4 h-4" /> Add Fee Record
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Fee Type</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fees.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No records found.</td></tr>
              ) : (
                fees.map(f => (
                  <tr key={f.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{f.Student?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-700">{f.feeType}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">${f.amount}</td>
                    <td className="p-4 text-sm text-gray-700">{f.dueDate || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusColor(f.status)}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => sendWhatsAppReminder(f)} className="text-gray-500 hover:text-green-600 p-1.5 rounded-md transition-colors" title="Send WhatsApp Reminder">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(f)} className="admin-only text-gray-500 hover:text-blue-600 p-1.5 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteFee(f.id)} className="admin-only text-gray-500 hover:text-red-600 p-1.5 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
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
              <h3 className="text-xl font-bold text-gray-800">{currentFee ? 'Update Fee' : 'Add Fee Record'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="admin-only text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={saveFee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select required name="studentId" value={formData.studentId} onChange={handleInputChange} disabled={!!currentFee} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100">
                  <option value="">-- Choose Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.regNo})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <select name="feeType" value={formData.feeType} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option value="Tuition">Tuition</option>
                    <option value="Transport">Transport</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Library">Library</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} disabled={!!currentFee} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </div>
              {formData.status === 'Paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                  <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-only px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="admin-only px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">Save Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
