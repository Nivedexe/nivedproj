import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const VolunteerDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
                    <p className="mt-2 text-gray-600">Thank you for your service, {user?.name}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
        </div>
    );
};

export default VolunteerDashboard;
