import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const TipplerDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                    <p className="mt-2 text-gray-600">Your recovery journey continues here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Find a Meeting */}
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <span className="text-2xl">🎥</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Support Groups</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">My Meetings</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link to="/meetings" className="font-medium text-indigo-700 hover:text-indigo-900">View your assigned meetings &rarr;</Link>
                            </div>
                        </div>
                    </div>

                    {/* Self Assessment */}
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Check-in</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">Self-Assessment</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link to="/assessments" className="font-medium text-indigo-700 hover:text-indigo-900">Take the Self-Assessment &rarr;</Link>
                            </div>
                        </div>
                    </div>

                    {/* Conventions */}
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                    <span className="text-2xl">🏨</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Events</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">Conventions</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link to="/conventions" className="font-medium text-indigo-700 hover:text-indigo-900">Browse upcoming events &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity or Quote Section could go here */}
                <div className="mt-10 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-900">Daily Reflection</h3>
                    <p className="mt-2 text-indigo-700 italic">"Recovery is not a race. You don't have to do it all at once. You just have to do it."</p>
                </div>
            </div>
        </div>
    );
};

export default TipplerDashboard;
