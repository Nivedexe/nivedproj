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
    const [testResults, setTestResults] = useState([]);
    const [newsletters, setNewsletters] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

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
                axios.get('http://localhost:5000/api/tests', config),
                axios.get('http://localhost:5000/api/tests/results', config),
                axios.get('http://localhost:5000/api/newsletters', config),
                axios.get('http://localhost:5000/api/feedback', config)
            ]);

            if (results[0].status === 'fulfilled') setUsers(results[0].value.data);
            if (results[1].status === 'fulfilled') setMeetings(results[1].value.data);
            if (results[2].status === 'fulfilled') setConventions(results[2].value.data);
            if (results[3].status === 'fulfilled' && results[3].value.data.length > 0) {
                setAssessmentId(results[3].value.data[0].id);
            }
            if (results[4].status === 'fulfilled') setTestResults(results[4].value.data || []);
            if (results[5].status === 'fulfilled') setNewsletters(results[5].value.data || []);
            if (results[6].status === 'fulfilled') setFeedbacks(results[6].value.data || []);
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

    const handleEvaluateResult = async (resultId, isApproved) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const adminFeedback = prompt("Enter Optional Admin Feedback:");

            await axios.put(`http://localhost:5000/api/tests/results/${resultId}/evaluate`, {
                isApproved,
                adminFeedback
            }, config);

            // Refresh data to reflect new user status and eval state
            fetchData();
        } catch (err) {
            alert('Failed to evaluate result');
        }
    };

    const handleUpdateGroup = async (userId, groupName) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/users/${userId}/group`, { groupName }, config);
            fetchData(); // refresh user list
        } catch (err) {
            alert('Failed to update user group');
        }
    };

    const generateCSV = (usersData) => {
        const headers = ['ID,Username,Email,Role,Status,Group'];
        const rows = usersData.map(u => 
            `${u.id},"${u.username}","${u.email}",${u.role},${u.isApproved ? 'Active' : 'Pending'},"${u.groupName || 'None'}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `erehab_users_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading || !user || user.role !== 'admin') {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Test Results Evaluation Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Evaluate Test Submissions</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review Tippler test results to activate Memberships.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul role="list" className="divide-y divide-gray-200">
                            {testResults.map((r) => (
                                <li key={r.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-primary truncate">User: {r.User?.username} ({r.User?.email})</div>
                                            <div className="text-sm text-gray-500">Score: {r.score} - Band: {r.resultBand?.label}</div>
                                            <div className="text-xs text-gray-400 mt-1">Status: {r.isEvaluated ? 'Evaluated' : 'Pending Evaluation'}</div>
                                            {r.adminFeedback && <div className="text-xs italic text-gray-500">Feedback: {r.adminFeedback}</div>}
                                        </div>
                                        <div className="flex space-x-2">
                                            {!r.isEvaluated && (
                                                <>
                                                    <button onClick={() => handleEvaluateResult(r.id, true)} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold hover:bg-green-200 transition-colors">Approve</button>
                                                    <button onClick={() => handleEvaluateResult(r.id, false)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-200 transition-colors">Reject</button>
                                                </>
                                            )}
                                            {r.isEvaluated && <span className="text-green-600 font-bold text-sm">✓ Done</span>}
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {testResults.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No pending test results found.</li>}
                        </ul>
                    </div>
                </div>

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
                        <Link to={assessmentId ? `/admin/assessments/${assessmentId}` : '/admin/assessments/new'} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                            {assessmentId ? 'Edit Assessment' : 'Create Assessment'}
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
                                                {u.username && u.username.length > 0 ? u.username[0].toUpperCase() : '?'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-primary truncate">{u.username}</div>
                                                <div className="text-sm text-gray-500">{u.email}</div>
                                                <div className="text-xs text-gray-400">Membership: {u.isApproved ? 'Active' : 'Pending'}</div>
                                            </div>
                                        </div>
                                        <div className="ml-2 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                            {(u.role === 'tippler' || u.role === 'volunteer') && (
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Assign Group"
                                                        className="border-gray-300 rounded-md shadow-sm sm:text-sm px-2 py-1 w-32 focus:ring-indigo-500 focus:border-indigo-500"
                                                        defaultValue={u.groupName || ''}
                                                        onBlur={(e) => {
                                                            const newGroup = e.target.value.trim();
                                                            if (newGroup !== (u.groupName || '')) {
                                                                handleUpdateGroup(u.id, newGroup);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-800' : u.role === 'volunteer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {u.role}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* User Report Section */}
                    <div className="bg-indigo-50 border-t border-indigo-100 p-6 sm:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">User Statistics & Report</h4>
                                <p className="text-sm text-gray-600 mt-1">Real-time aggregate data and exportable CSV.</p>
                            </div>
                            <button 
                                onClick={() => generateCSV(users)}
                                className="bg-white border text-primary border-primary px-5 py-2 rounded-md shadow-sm text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Export CSV Report
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                                <p className="text-3xl font-extrabold text-indigo-600">{users.length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Total Users</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                                <p className="text-3xl font-extrabold text-green-600">{users.filter(u => u.isApproved).length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Active Members</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                                <p className="text-3xl font-extrabold text-blue-600">{users.filter(u => u.role === 'volunteer').length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Volunteers</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-center">
                                <p className="text-3xl font-extrabold text-orange-600">{users.filter(u => u.role === 'tippler').length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Tested Tipplers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletters Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Newsletter Subscribers</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all users subscribed to the mailing list.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul role="list" className="divide-y divide-gray-200">
                            {newsletters.map((sub) => (
                                <li key={sub.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-primary truncate">{sub.email}</div>
                                        <div className="text-sm text-gray-500">{new Date(sub.subscribedAt || sub.createdAt).toLocaleString()}</div>
                                    </div>
                                </li>
                            ))}
                            {newsletters.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No subscribers found.</li>}
                        </ul>
                    </div>
                </div>
                
                {/* Feedback Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8 mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-indigo-50 border-b border-indigo-100">
                        <div>
                            <h3 className="text-lg leading-6 font-bold text-gray-900">User Feedback</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-600">Feedback submitted by users from the portal homepage.</p>
                        </div>
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
                                                    {f.User ? `From: ${f.User.username} (${f.User.email})` : 'From: Anonymous User'}
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

export default AdminDashboard;
