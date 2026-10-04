import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const AdminMeetingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateTime: '',
        link: '',
        type: 'Open',
        price: 0,
        assignedUserIds: []
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch all tipplers for assignment
                const usersRes = await axios.get('http://localhost:5000/api/users?role=tippler', config);
                const tipplers = usersRes.data.filter(u => u.role === 'tippler');
                setUsers(tipplers);

                if (isEditMode) {
                    const meetingRes = await axios.get(`http://localhost:5000/api/meetings/${id}`, config);
                    const meeting = meetingRes.data;
                    const formattedDate = meeting.dateTime ? new Date(meeting.dateTime).toISOString().slice(0, 16) : '';

                    setFormData({
                        title: meeting.title || '',
                        description: meeting.description || '',
                        dateTime: formattedDate,
                        link: meeting.link || '',
                        type: meeting.type || 'Open',
                        price: meeting.price || 0,
                        assignedUserIds: meeting.Users ? meeting.Users.map(u => u.id.toString()) : []
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data for meeting form:', err);
                setError(err.response?.data?.message || 'Failed to fetch data');
                setLoading(false);
            }
        };
        fetchData();
    }, [isEditMode, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleUserSelection = (userId) => {
        const currentIds = formData.assignedUserIds;
        const newIds = currentIds.includes(userId)
            ? currentIds.filter(id => id !== userId)
            : [...currentIds, userId];
        setFormData({ ...formData, assignedUserIds: newIds });
    };

    const handleSelectAll = () => {
        const filtered = users.filter(u => 
            u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const filteredIds = filtered.map(u => u.id.toString());
        const allSelected = filteredIds.every(id => formData.assignedUserIds.includes(id));

        if (allSelected) {
            // Deselect these filtered IDs
            setFormData({
                ...formData,
                assignedUserIds: formData.assignedUserIds.filter(id => !filteredIds.includes(id))
            });
        } else {
            // Add all missing filtered IDs
            const unionIds = Array.from(new Set([...formData.assignedUserIds, ...filteredIds]));
            setFormData({
                ...formData,
                assignedUserIds: unionIds
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...formData,
                assignedUserIds: formData.assignedUserIds.map(uid => parseInt(uid, 10))
            };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/meetings/${id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/meetings', payload, config);
            }

            if (user?.role === 'volunteer') {
                alert(isEditMode ? 'Meeting updated successfully!' : 'Meeting created successfully!');
                navigate('/volunteer-dashboard');
            } else {
                alert(isEditMode ? 'Meeting updated successfully!' : 'Meeting created successfully!');
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save meeting');
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Meeting' : 'Create Meeting'}</h1>
                        <p className="text-sm text-gray-600 mt-1">Configure meeting schedule and assign Tipplers who can attend.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(user?.role === 'volunteer' ? '/volunteer-dashboard' : '/admin')}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                        ← Back
                    </button>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-100">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                            id="title"
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Morning Reflections Group"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe meeting agenda or focus..."
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateTime">Date & Time</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                                id="dateTime"
                                name="dateTime"
                                type="datetime-local"
                                required
                                value={formData.dateTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Meeting Type</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">Meeting Link (Zoom/Google Meet)</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                                id="link"
                                name="link"
                                type="text"
                                placeholder="https://meet.google.com/..."
                                value={formData.link}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price (₹)</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Multi-Select Assigned Tipplers Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-gray-700 text-sm font-bold">Assign Tipplers (Multi-Select)</label>
                            <span className="text-xs text-indigo-600 font-semibold">
                                {formData.assignedUserIds.length} Tippler(s) Assigned
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                            Only assigned Tipplers will be able to see and attend this meeting on their meetings list.
                        </p>

                        {/* Selected User Chips */}
                        {formData.assignedUserIds.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                {formData.assignedUserIds.map((uid) => {
                                    const foundUser = users.find(u => u.id.toString() === uid.toString());
                                    if (!foundUser) return null;
                                    return (
                                        <span
                                            key={uid}
                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200"
                                        >
                                            <span className="mr-1">👤</span>
                                            <span>{foundUser.username}</span>
                                            <button
                                                type="button"
                                                onClick={() => toggleUserSelection(uid.toString())}
                                                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-600 hover:bg-indigo-200 hover:text-indigo-900"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        <div className="relative">
                            <button
                                type="button"
                                className="shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center bg-white hover:border-gray-400 text-sm"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className={formData.assignedUserIds.length === 0 ? 'text-gray-400' : 'text-gray-900 font-medium'}>
                                    {formData.assignedUserIds.length === 0
                                        ? 'Click to select Tipplers...'
                                        : `${formData.assignedUserIds.length} Tippler(s) selected (Click to modify)`}
                                </span>
                                <span className={`text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}>▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-20 mt-1 w-full bg-white shadow-xl max-h-72 rounded-lg border border-gray-200 overflow-hidden flex flex-col sm:text-sm">
                                    {/* Dropdown Search & Actions Header */}
                                    <div className="p-3 border-b border-gray-200 bg-gray-50 space-y-2">
                                        <input
                                            type="text"
                                            className="w-full px-3 py-1.5 text-xs border rounded-md focus:ring-1 focus:ring-primary focus:outline-none"
                                            placeholder="Search tipplers by username or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold text-gray-600">Available Tipplers ({filteredUsers.length})</span>
                                            <div className="space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={handleSelectAll}
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, assignedUserIds: [] })}
                                                    className="text-red-500 hover:text-red-700 font-semibold"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tipplers List with Checkboxes */}
                                    <div className="overflow-y-auto max-h-48 divide-y divide-gray-100">
                                        {filteredUsers.length === 0 ? (
                                            <div className="p-4 text-center text-xs text-gray-500">
                                                {searchQuery ? `No tipplers matching "${searchQuery}"` : 'No registered Tipplers found.'}
                                            </div>
                                        ) : (
                                            filteredUsers.map((u) => {
                                                const isSelected = formData.assignedUserIds.includes(u.id.toString());
                                                return (
                                                    <div
                                                        key={u.id}
                                                        className={`cursor-pointer select-none py-2.5 px-3 hover:bg-indigo-50 flex items-center justify-between transition-colors ${
                                                            isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : ''
                                                        }`}
                                                        onClick={() => toggleUserSelection(u.id.toString())}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                                                checked={isSelected}
                                                                onChange={() => {}} // handled by parent div onClick
                                                            />
                                                            <div className="h-7 w-7 rounded-full bg-indigo-100 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                                {u.username?.[0]?.toUpperCase() || 'T'}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold text-gray-900 leading-tight">{u.username}</div>
                                                                <div className="text-xs text-gray-500">{u.email}</div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                                            tippler
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                            className="bg-primary hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded shadow transition-colors text-sm"
                            type="submit"
                        >
                            {isEditMode ? 'Update Meeting' : 'Create Meeting'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(user?.role === 'volunteer' ? '/volunteer-dashboard' : '/admin')}
                            className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMeetingForm;
