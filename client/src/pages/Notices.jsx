import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X, Bell, MessageCircle } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', targetAudience: 'All' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('https://sms-server-s2nt.onrender.com/api/notices');
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveNotice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://sms-server-s2nt.onrender.com/api/notices', formData);
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      console.error(err);
      alert('Error adding notice.');
    }
  };

  const deleteNotice = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`https://sms-server-s2nt.onrender.com/api/notices/${id}`);
        fetchNotices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const shareNoticeWhatsApp = (notice) => {
    const message = `*${notice.title}*\n\n${notice.content}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notice Board</h2>
        <button onClick={() => { setFormData({ title: '', content: '', targetAudience: 'All' }); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm">
          <Plus className="w-4 h-4" /> Create Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
            No notices available right now.
          </div>
        ) : (
          notices.map(n => (
            <div key={n.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Bell className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{n.targetAudience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => shareNoticeWhatsApp(n)} className="text-gray-400 hover:text-green-600 transition-colors" title="Share via WhatsApp">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteNotice(n.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{n.title}</h3>
              <p className="text-gray-600 text-sm flex-1 whitespace-pre-wrap">{n.content}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                Posted on: {new Date(n.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Create New Notice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={saveNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option value="All">All</option>
                  <option value="Students">Students Only</option>
                  <option value="Teachers">Teachers Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea required name="content" rows="4" value={formData.content} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">Post Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
