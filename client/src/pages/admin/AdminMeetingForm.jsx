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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch all users for assignment
                const usersRes = await axios.get('http://localhost:5000/api/users', config);
                setUsers(usersRes.data);

                if (isEditMode) {
                    const meetingRes = await axios.get(`http://localhost:5000/api/meetings/${id}`, config);
                    const meeting = meetingRes.data;
                    // Format dateTime for input type="datetime-local"
                    const formattedDate = new Date(meeting.dateTime).toISOString().slice(0, 16);

                    setFormData({
                        title: meeting.title,
                        description: meeting.description,
                        dateTime: formattedDate,
                        link: meeting.link,
                        type: meeting.type,
                        price: meeting.price,
                        assignedUserIds: meeting.Users ? meeting.Users.map(u => u.id.toString()) : []
                    });
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };
        fetchData();
    }, [isEditMode, id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Custom Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleUserSelection = (userId) => {
        const currentIds = formData.assignedUserIds;
        const newIds = currentIds.includes(userId)
            ? currentIds.filter(id => id !== userId)
            : [...currentIds, userId];
        setFormData({ ...formData, assignedUserIds: newIds });
    };

    const handleSelectAll = () => {
        if (formData.assignedUserIds.length === users.length) {
            setFormData({ ...formData, assignedUserIds: [] });
        } else {
            setFormData({ ...formData, assignedUserIds: users.map(u => u.id.toString()) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/meetings/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/meetings', formData, config);
            }
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save meeting');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEditMode ? 'Edit Meeting' : 'Create Meeting'}</h1>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="title"
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateTime">Date & Time</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="dateTime"
                                name="dateTime"
                                type="datetime-local"
                                required
                                value={formData.dateTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Type</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">Meeting Link (Zoom/Meet)</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="link"
                                name="link"
                                type="text"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price (₹)</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

                    <div className="mb-6 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Assign Users</label>
                        <div className="relative">
                            <button
                                type="button"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-left flex justify-between items-center"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>
                                    {formData.assignedUserIds.length === 0
                                        ? 'Select users...'
                                        : `${formData.assignedUserIds.length} user(s) selected`}
                                </span>
                                <span className="ml-2">▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <span className="font-semibold text-gray-700">Select Users</span>
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            {formData.assignedUserIds.length === users.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    {users.map((u) => (
                                        <div
                                            key={u.id}
                                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                            onClick={() => toggleUserSelection(u.id.toString())}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    checked={formData.assignedUserIds.includes(u.id.toString())}
                                                    readOnly
                                                />
                                                <span className="ml-3 block truncate font-normal">
                                                    {u.username} <span className="text-gray-500 text-xs">({u.email})</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {isEditMode ? 'Update Meeting' : 'Create Meeting'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="inline-block align-baseline font-bold text-sm text-primary hover:text-indigo-800"
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
