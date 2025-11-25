import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Meetings from './pages/Meetings';
import Conventions from './pages/Conventions';
import Assessments from './pages/Assessments';
import ProtectedRoute from './components/ProtectedRoute';
import AdminMeetingForm from './pages/admin/AdminMeetingForm';
import AdminConventionForm from './pages/admin/AdminConventionForm';
import AdminAssessmentForm from './pages/admin/AdminAssessmentForm';
import AdminUserForm from './pages/admin/AdminUserForm';
import TipplerDashboard from './pages/TipplerDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';

const Home = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>
                        <div className="pt-10 sm:pt-12 lg:pt-14"></div>
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Recovery is a journey</span>{' '}
                                    <span className="block text-primary xl:inline">you don't take alone.</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    E-REHAB connects you with a supportive community, online meetings, and resources to help you achieve and maintain sobriety from the comfort of your home.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        {useContext(AuthContext).user ? (
                                            <a href="/assessments" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                                Start Assessment
                                            </a>
                                        ) : (
                                            <a href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                                Join the Fellowship
                                            </a>
                                        )}
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a href="/meetings" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                                            Find a Meeting
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-50">
                    <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center text-indigo-200">
                        <div className="text-9xl">🤝</div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            A Better Way to Recover
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Comprehensive tools designed to support your recovery journey every step of the way.
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {[
                                {
                                    name: 'Online Meetings',
                                    description: 'Access support groups and meetings from anywhere, anytime. No transportation needed.',
                                    icon: '🎥'
                                },
                                {
                                    name: 'Conventions',
                                    description: 'Register for recovery conventions, book rooms, and connect with the wider community.',
                                    icon: '🏨'
                                },
                                {
                                    name: 'Self-Assessment',
                                    description: 'Take private assessments to track your progress and receive personalized feedback.',
                                    icon: '📝'
                                },
                                {
                                    name: 'Community Support',
                                    description: 'Connect with Volunteers and other Tipplers who share your experience, strength, and hope.',
                                    icon: '❤️'
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white text-2xl">
                                            {feature.icon}
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        {feature.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </main>
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">E-REHAB</h3>
                        <p className="text-gray-400 text-sm">
                            Empowering recovery through technology and community.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/meetings" className="hover:text-white">Meetings</a></li>
                            <li><a href="/conventions" className="hover:text-white">Conventions</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    &copy; E-REHAB.
                </div>
            </div>
        </footer>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <TipplerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/volunteer-dashboard" element={
                    <ProtectedRoute>
                        <VolunteerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/meetings/new" element={
                    <ProtectedRoute>
                        <AdminMeetingForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/meetings/edit/:id" element={
                    <ProtectedRoute>
                        <AdminMeetingForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/conventions/new" element={
                    <ProtectedRoute>
                        <AdminConventionForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/conventions/edit/:id" element={
                    <ProtectedRoute>
                        <AdminConventionForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/assessments/new" element={
                    <ProtectedRoute>
                        <AdminAssessmentForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/assessments/:id" element={
                    <ProtectedRoute>
                        <AdminAssessmentForm />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users/new" element={
                    <ProtectedRoute>
                        <AdminUserForm />
                    </ProtectedRoute>
                } />
                <Route path="/meetings" element={
                    <ProtectedRoute>
                        <Meetings />
                    </ProtectedRoute>
                } />
                <Route path="/conventions" element={
                    <ProtectedRoute>
                        <Conventions />
                    </ProtectedRoute>
                } />
                <Route path="/assessments" element={
                    <ProtectedRoute>
                        <Assessments />
                    </ProtectedRoute>
                } />
            </Routes>
        </AuthProvider>
    );
}

export default App;
