import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AdminDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [conventions, setConventions] = useState([]);
    const [assessmentId, setAssessmentId] = useState(null);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchData();
            }
        }
    }, [user, loading, navigate]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const results = await Promise.allSettled([
                axios.get('http://localhost:5000/api/users', config),
                axios.get('http://localhost:5000/api/meetings', config),
                axios.get('http://localhost:5000/api/conventions', config),
                axios.get('http://localhost:5000/api/tests', config)
            ]);

            if (results[0].status === 'fulfilled') setUsers(results[0].value.data);
            if (results[1].status === 'fulfilled') setMeetings(results[1].value.data);
            if (results[2].status === 'fulfilled') setConventions(results[2].value.data);
            if (results[3].status === 'fulfilled' && results[3].value.data.length > 0) {
                setAssessmentId(results[3].value.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
    };

    const handleDeleteMeeting = async (id) => {
        if (window.confirm('Are you sure you want to delete this meeting?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/meetings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMeetings(meetings.filter(m => m.id !== id));
            } catch (error) {
                alert('Failed to delete meeting');
            }
        }
    };

    const handleDeleteConvention = async (id) => {
        if (window.confirm('Are you sure you want to delete this convention?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/conventions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConventions(conventions.filter(c => c.id !== id));
            } catch (error) {
                alert('Failed to delete convention');
            }
        }
    };

    if (loading || !user || user.role !== 'admin') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Meetings Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Meetings</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Create and assign meetings.</p>
                        </div>
                        <Link to="/admin/meetings/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                            Create Meeting
                        </Link>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul role="list" className="divide-y divide-gray-200">
                            {meetings.map((m) => (
                                <li key={m.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-primary truncate">{m.title}</div>
                                            <div className="text-sm text-gray-500">{new Date(m.dateTime).toLocaleString()}</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link to={`/admin/meetings/edit/${m.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</Link>
                                            <button onClick={() => handleDeleteMeeting(m.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {meetings.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No meetings found.</li>}
                        </ul>
                    </div>
                </div>

                {/* Conventions Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Conventions</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Create upcoming conventions.</p>
                        </div>
                        <Link to="/admin/conventions/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                            Create Convention
                        </Link>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul role="list" className="divide-y divide-gray-200">
                            {conventions.map((c) => (
                                <li key={c.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-primary truncate">{c.name}</div>
                                            <div className="text-sm text-gray-500">{c.location} - {c.startDate}</div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link to={`/admin/conventions/edit/${c.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</Link>
                                            <button onClick={() => handleDeleteConvention(c.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {conventions.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No conventions found.</li>}
                        </ul>
                    </div>
                </div>

                {/* Assessments Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Assessments</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Edit the self-assessment (AUDIT).</p>
                        </div>
                        <Link to="/admin/assessments/1" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                            Edit Assessment
                        </Link>
                    </div>
                </div>

                {/* Users Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all registered users.</p>
                        </div>
                        <Link to="/admin/users/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                            Create User
                        </Link>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul role="list" className="divide-y divide-gray-200">
                            {users.map((u) => (
                                <li key={u.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
                                                {u.username[0].toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-primary truncate">{u.username}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-800' : u.role === 'volunteer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {u.role}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
