import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VolunteerDashboard = () => {
    const { user, refreshUser, logout } = useContext(AuthContext);
    const [groupUsers, setGroupUsers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [conventions, setConventions] = useState([]);
    const [assessment, setAssessment] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const results = await Promise.allSettled([
                axios.get('http://localhost:5000/api/feedback', config),
                axios.get('http://localhost:5000/api/meetings', config),
                axios.get('http://localhost:5000/api/conventions/registrations', config),
                user?.groupName ? axios.get(`http://localhost:5000/api/users/group/${user.groupName}`, config) : Promise.resolve(null),
                axios.get('http://localhost:5000/api/conventions', config),
                axios.get('http://localhost:5000/api/tests', config)
            ]);
            
            if (results[0].status === 'fulfilled') setFeedbacks(results[0].value.data || []);
            if (results[1].status === 'fulfilled') setMeetings(results[1].value.data || []);
            if (results[2].status === 'fulfilled') setRegistrations(results[2].value.data || []);
            if (results[3].status === 'fulfilled' && results[3].value !== null) setGroupUsers(results[3].value.data || []);
            if (results[4].status === 'fulfilled') setConventions(results[4].value.data || []);
            if (results[5].status === 'fulfilled' && results[5].value.data?.length > 0) {
                setAssessment(results[5].value.data[0]);
            }
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const handleCheckApproval = async () => {
        setCheckingStatus(true);
        setStatusMessage('');
        try {
            const updated = await refreshUser();
            if (updated?.isApproved) {
                setStatusMessage('Congratulations! Your account has been approved.');
            } else {
                setStatusMessage('Your account is still pending administrator review. Please check back shortly.');
            }
        } catch (err) {
            setStatusMessage('Could not verify status at this moment.');
        } finally {
            setCheckingStatus(false);
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

    // 1. BIG INDICATION FOR NEW UNAPPROVED VOLUNTEERS
    if (!user?.isApproved) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-16 w-full flex-grow flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-8 sm:p-12 text-center w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>
                        
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 text-amber-600 mb-6 shadow-inner text-5xl">
                            ⏳
                        </div>

                        <div className="inline-block mb-3">
                            <span className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-300">
                                Waiting for Administrator Approval
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
                            Welcome, {user?.name || user?.username}!
                        </h1>

                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
                            Your volunteer account has been registered and is currently in the approval queue. An administrator will review your account to verify your permissions.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 max-w-xl mx-auto text-left mb-8">
                            <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center">
                                <span className="mr-2">ℹ️</span> What happens after approval?
                            </h4>
                            <ul className="text-sm text-amber-800 space-y-1.5 list-disc list-inside">
                                <li>Access to create and host fellowship meetings</li>
                                <li>Permission to submit conventions for admin moderation</li>
                                <li>Ability to edit and propose updates to Clinical Substance Use assessments</li>
                                <li>Interaction with your assigned fellowship recovery group</li>
                            </ul>
                        </div>

                        {statusMessage && (
                            <div className="mb-6 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm font-medium">
                                {statusMessage}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleCheckApproval}
                                disabled={checkingStatus}
                                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {checkingStatus ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Checking Status...
                                    </>
                                ) : (
                                    '🔄 Check Approval Status'
                                )}
                            </button>
                            <button
                                onClick={logout}
                                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. FULL DASHBOARD FOR APPROVED VOLUNTEERS
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
                                ✓ Verified Volunteer
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600">Thank you for your service to the fellowship, {user?.name || user?.username}.</p>
                    </div>
                    {user?.groupName && (
                        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md font-medium border border-indigo-200 shadow-sm">
                            Assigned Group: <span className="font-bold">{user.groupName}</span>
                        </div>
                    )}
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Facilitation */}
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

                    {/* Volunteer Tools */}
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border-l-4 border-green-500">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Platform Moderation</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">Conventions & Assessments</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Approval-enabled workflows active</span>
                            <span className="text-green-600 font-bold">● Active</span>
                        </div>
                    </div>
                </div>

                {/* Group Members Section */}
                {user?.groupName && (
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                My Group Members ({user.groupName})
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Tipplers assigned to your fellowship group to check in on and support.
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
                
                {/* Meetings Section (unchanged permission as requested) */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Meetings</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Create, edit, and assign upcoming meetings.</p>
                        </div>
                        <Link to="/admin/meetings/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium">
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
                                        <div className="flex space-x-3">
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

                {/* Manage Conventions Section for Volunteer */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Conventions</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Create conventions. New submissions are marked as <strong>Waiting for Approval</strong> until confirmed by an Admin.
                            </p>
                        </div>
                        <Link to="/admin/conventions/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium">
                            Create Convention
                        </Link>
                    </div>
                    <div className="border-t border-gray-200 bg-white">
                        <ul role="list" className="divide-y divide-gray-200">
                            {conventions.map((c) => (
                                <li key={c.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-gray-900 truncate">{c.name}</span>
                                                {c.isApproved ? (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                        ✓ Approved & Live
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300 animate-pulse">
                                                        ⏳ Waiting for Approval
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {c.location} | {c.startDate} to {c.endDate}
                                                {(c.coordinatorName || c.coordinatorPhone) && (
                                                    <span className="block text-xs text-indigo-700 font-semibold mt-0.5">
                                                        👤 Coordinator: {c.coordinatorName || 'N/A'} {c.coordinatorPhone ? `| 📞 ${c.coordinatorPhone}` : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 flex items-center space-x-2 flex-wrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                                    👥 {c.registeredUsersCount || 0} User{(c.registeredUsersCount || 0) === 1 ? '' : 's'} Registered
                                                </span>
                                                <span className="text-xs text-gray-600 font-medium">
                                                    ({c.registeredAttendeesCount || c.registeredCount || 0} Total Members / {c.maxCapacity} Max Capacity)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {c.isApproved ? (
                                                <>
                                                    <Link to={`/admin/conventions/edit/${c.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</Link>
                                                    <button onClick={() => handleDeleteConvention(c.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                                                </>
                                            ) : (
                                                <span className="text-xs italic text-amber-700 font-medium bg-amber-50 px-3 py-1 rounded border border-amber-200">
                                                    Pending Admin Review (Editable after approval)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {conventions.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No conventions found. Create one using the button above.</li>}
                        </ul>
                    </div>
                </div>

                {/* Manage Assessments Section for Volunteer */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Assessments</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Edit the self-assessment. Changes require Admin approval before going live to Tipplers.
                            </p>
                        </div>
                        <Link 
                            to={assessment ? `/admin/assessments/${assessment.id}` : '/admin/assessments/new'} 
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                        >
                            Edit Assessment
                        </Link>
                    </div>
                    <div className="p-6 bg-white">
                        {assessment ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 gap-4">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-bold text-gray-900">{assessment.title}</h4>
                                        {assessment.hasPendingReview ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                                                ⏳ Edits Waiting for Admin Approval
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                ✓ Active Assessment
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 max-w-xl">
                                        {assessment.description || 'Clinical Substance Use Risk screening test for dependence and recovery evaluation.'}
                                    </p>
                                    {assessment.hasPendingReview && (
                                        <p className="text-xs text-amber-700 mt-2 font-medium">
                                            Notice: Recent draft edits are waiting for administrator review. Tipplers will continue taking the live version until approved.
                                        </p>
                                    )}
                                </div>
                                <Link 
                                    to={`/admin/assessments/${assessment.id}`}
                                    className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-md text-sm font-semibold whitespace-nowrap shadow-sm"
                                >
                                    Modify Questions
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No active assessments found.</p>
                        )}
                    </div>
                </div>

                {/* Convention Registrations */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Convention Registrations</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">View upcoming attendees and ticketing information.</p>
                        </div>
                        {registrations.length > 0 && (
                            <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-900 flex items-center gap-2">
                                <span>👥 <strong>{new Set(registrations.map(r => r.UserId || r.User?.id)).size}</strong> Registered Users</span>
                                <span className="text-indigo-300">|</span>
                                <span>🎟️ <strong>{registrations.reduce((s, r) => s + (Number(r.memberCount) || 1), 0)}</strong> Total Attendees</span>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-gray-200 bg-white">
                        <ul role="list" className="divide-y divide-gray-200">
                            {registrations.map((reg) => (
                                <li key={reg.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-gray-900 truncate">{reg.Convention?.name}</div>
                                            <div className="text-sm font-medium text-primary mt-1">
                                                Attendee: <span className="font-bold text-gray-900">{reg.attendeeName || reg.User?.username}</span>
                                                {(reg.attendeePhone || reg.User?.phone) && (
                                                    <span className="text-gray-700 ml-2 font-normal">
                                                        📞 {reg.attendeePhone || reg.User?.phone}
                                                    </span>
                                                )}
                                                {reg.User?.email && (
                                                    <span className="text-gray-500 text-xs ml-2">({reg.User.email})</span>
                                                )}
                                            </div>
                                            {reg.Convention?.coordinatorName && (
                                                <div className="text-xs text-indigo-800 font-medium mt-0.5">
                                                    Coordinator: {reg.Convention.coordinatorName} {reg.Convention.coordinatorPhone ? `(${reg.Convention.coordinatorPhone})` : ''}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">
                                                Registered on {new Date(reg.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:mt-0 sm:ml-6 flex flex-col items-end">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Status: Confirmed
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
