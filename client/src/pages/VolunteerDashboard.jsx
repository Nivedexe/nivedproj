import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VolunteerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [groupUsers, setGroupUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const results = await Promise.allSettled([
                    axios.get('http://localhost:5000/api/feedback', config),
                    axios.get('http://localhost:5000/api/meetings', config),
                    axios.get('http://localhost:5000/api/conventions/registrations', config),
                    user?.groupName ? axios.get(`http://localhost:5000/api/users/group/${user.groupName}`, config) : Promise.resolve(null)
                ]);
                
                if (results[0].status === 'fulfilled') setFeedbacks(results[0].value.data);
                if (results[1].status === 'fulfilled') setMeetings(results[1].value.data);
                if (results[2].status === 'fulfilled') setRegistrations(results[2].value.data);
                if (results[3].status === 'fulfilled' && results[3].value !== null) setGroupUsers(results[3].value.data);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
                        <p className="mt-2 text-gray-600">Thank you for your service, {user?.name || user?.username}.</p>
                    </div>
                    {user?.groupName && (
                        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md font-medium">
                            Group: {user.groupName}
                        </div>
                    )}
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Assigned Meetings */}
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border-l-4 border-indigo-500">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                    <span className="text-2xl">🤝</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Facilitation</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">My Assigned Meetings</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link to="/meetings" className="font-medium text-indigo-700 hover:text-indigo-900">Manage your meetings &rarr;</Link>
                            </div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border-l-4 border-green-500">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <span className="text-2xl">📚</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Training & Tools</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">Volunteer Resources</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className="text-gray-500 italic">Coming soon...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Group Members Section */}
                {user?.groupName && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                My Group Members ({user.groupName})
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Users assigned to your group to check in on.
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-0">
                            {loading ? (
                                <div className="text-center p-6 text-gray-500">Loading members...</div>
                            ) : groupUsers.length === 0 ? (
                                <div className="text-center p-6 text-gray-500">No members currently assigned to this group.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sobriety Date</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {groupUsers.map((member) => (
                                                <tr key={member.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 mt-1">
                                                                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <div className="ml-4 flex flex-col justify-center">
                                                                <div className="text-sm font-medium text-gray-900 leading-tight">{member.username}</div>
                                                                <div className="text-sm text-gray-500 leading-tight">{member.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {member.isApproved ? 'Approved Member' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {member.sobrietyDate ? new Date(member.sobrietyDate).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {member.phone || 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Meetings Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8 mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Meetings</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Create, edit, and assign upcoming meetings.</p>
                        </div>
                        <Link to="/admin/meetings/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                            Create Meeting
                        </Link>
                    </div>
                    <div className="border-t border-gray-200 bg-white">
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

                {/* Convention Registrations */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Convention Registrations</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">View upcoming attendees and ticketing information.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 bg-white">
                        <ul role="list" className="divide-y divide-gray-200">
                            {registrations.map((reg) => (
                                <li key={reg.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-gray-900 truncate">{reg.Convention?.name}</div>
                                            <div className="text-sm font-medium text-primary mt-1">
                                                Attendee: {reg.User?.username} ({reg.User?.email})
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Registered on {new Date(reg.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:mt-0 sm:ml-6 flex flex-col items-end">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Paid: ${reg.totalAmount}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                Tickets: {reg.memberCount} | {reg.roomType}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {registrations.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No registrations found.</li>}
                        </ul>
                    </div>
                </div>
                
                {/* Feedback Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden mt-8 mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-indigo-100 bg-indigo-50">
                        <h3 className="text-lg leading-6 font-bold text-gray-900">
                            Community Feedback
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-600">
                            Recent feedback and suggestions submitted by users across the platform.
                        </p>
                    </div>
                    <div className="border-t border-gray-200 bg-white">
                        <ul role="list" className="divide-y divide-gray-200">
                            {feedbacks.map((f) => (
                                <li key={f.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div className="flex-1 w-full max-w-2xl">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Rating: {f.rating}/5
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {f.User ? `From: ${f.User.username}` : 'From: Anonymous User'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm leading-relaxed">
                                                "{f.message}"
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                                            <p className="text-xs text-gray-500 font-medium">Submitted on {new Date(f.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {feedbacks.length === 0 && <li className="px-6 py-8 text-center text-sm font-medium text-gray-500">No feedback submitted yet.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
