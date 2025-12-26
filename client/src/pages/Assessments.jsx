import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Assessments = () => {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState('landing'); // landing, quiz, results
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [resultBand, setResultBand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/tests', config);

                if (res.data.length > 0) {
                    // Filter out inactive questions
                    const activeTest = {
                        ...res.data[0],
                        questions: res.data[0].questions.filter(q => q.active !== false)
                    };
                    setTestData(activeTest);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load assessment.');
                setLoading(false);
            }
        };
        fetchTest();
    }, []);

    const handleStart = () => {
        setView('quiz');
    };

    const handleAnswer = (value, scoreValue = 0) => {
        setAnswers({
            ...answers,
            [currentQuestionIndex]: { value, score: scoreValue }
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < testData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResults();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const calculateResults = () => {
        let totalScore = 0;
        let maxPossibleScore = 0;

        testData.questions.forEach((q, index) => {
            const ans = answers[index];
            if (ans) {
                totalScore += ans.score;
            }

            // Calculate max possible score for normalization
            if (q.type === 'single-choice') {
                const maxOptionScore = Math.max(...q.options.map(o => o.score || 0));
                maxPossibleScore += maxOptionScore;
            } else if (q.type === 'numeric') {
                maxPossibleScore += (q.max || 0);
            }
        });

        // Normalize score to 0-10 scale
        let normalizedScore = 0;
        if (maxPossibleScore > 0) {
            normalizedScore = (totalScore / maxPossibleScore) * 10;
        }

        // Round to 1 decimal place
        normalizedScore = Math.round(normalizedScore * 10) / 10;

        setScore(normalizedScore);

        const bands = testData.scoringLogic.bands;
        const band = bands.find(b => normalizedScore >= b.min && normalizedScore <= b.max);
        setResultBand(band || { label: 'Unknown', advice: 'Please consult a professional.' });
        setView('results');
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
    if (!testData) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">No Assessment Available</h2>
                    <p className="text-gray-600 mt-2">Please ask an administrator to create the assessment.</p>
                </div>
            </div>
        </div>
    );

    const currentQuestion = testData.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">

                {/* Landing View */}
                {view === 'landing' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
                        {user && user.role === 'admin' && (
                            <Link
                                to={`/admin/assessments/${testData.id}`}
                                className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium"
                            >
                                Edit Assessment
                            </Link>
                        )}
                        <div className="px-6 py-8 sm:p-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{testData.title}</h1>
                            <p className="text-lg text-gray-600 mb-6">{testData.description}</p>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            <strong>Confidentiality Note:</strong> Your responses are private and for your personal self-reflection only.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary hover:bg-indigo-700 md:text-xl transition-colors"
                            >
                                Start Assessment
                            </button>
                        </div>
                    </div>
                )}

                {/* Quiz View */}
                {view === 'quiz' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-8 sm:p-10">
                            <div className="mb-6">
                                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                                    <span>Question {currentQuestionIndex + 1} of {testData.questions.length}</span>
                                    <span>{Math.round(((currentQuestionIndex + 1) / testData.questions.length) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / testData.questions.length) * 100}%` }}></div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.text}</h2>
                            {currentQuestion.helpText && <p className="text-gray-500 mb-8 italic">{currentQuestion.helpText}</p>}

                            <div className="space-y-4 mb-8">
                                {/* Single Choice */}
                                {currentQuestion.type === 'single-choice' && currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option.text, option.score)}
                                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${currentAnswer?.value === option.text
                                            ? 'border-primary bg-indigo-50 text-primary font-semibold'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {option.text}
                                    </button>
                                ))}

                                {/* Numeric Input */}
                                {currentQuestion.type === 'numeric' && (
                                    <div>
                                        <input
                                            type="number"
                                            min={currentQuestion.min}
                                            max={currentQuestion.max}
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                                            placeholder={`Enter a number between ${currentQuestion.min} and ${currentQuestion.max}`}
                                            value={currentAnswer?.value || ''}
                                            onChange={(e) => handleAnswer(e.target.value, parseFloat(e.target.value) || 0)} // Simple scoring: value = score for numeric
                                        />
                                    </div>
                                )}

                                {/* Paragraph Input */}
                                {currentQuestion.type === 'paragraph' && (
                                    <div>
                                        <textarea
                                            rows="4"
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Type your answer here..."
                                            value={currentAnswer?.value || ''}
                                            onChange={(e) => handleAnswer(e.target.value, 0)} // No score for paragraph
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={handleBack}
                                    disabled={currentQuestionIndex === 0}
                                    className={`px-6 py-2 rounded-md font-medium ${currentQuestionIndex === 0
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!currentAnswer}
                                    className={`px-8 py-2 rounded-md font-medium text-white transition-colors ${!currentAnswer
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-primary hover:bg-indigo-700'
                                        }`}
                                >
                                    {currentQuestionIndex === testData.questions.length - 1 ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results View */}
                {view === 'results' && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="px-6 py-8 sm:p-10 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Result</h2>

                            <div className="my-8">
                                <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold mb-4 ${score < 4 ? 'bg-green-100 text-green-800' :
                                    score < 7 ? 'bg-yellow-100 text-yellow-800' :
                                        score < 9 ? 'bg-orange-100 text-orange-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {resultBand.label}
                                </div>
                                <div className="text-6xl font-extrabold text-gray-900 mb-2">{score} <span className="text-2xl text-gray-400">/ 10</span></div>
                                <p className="text-gray-500">Normalized Score</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">What does this mean?</h3>
                                <p className="text-gray-700">{resultBand.advice}</p>
                            </div>

                            <div className="flex flex-col items-center space-y-4">
                                {score >= 9 && (
                                    <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-left">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700 font-bold">
                                                    Your score indicates a high risk. We strongly recommend joining a meeting or convention immediately.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center space-x-4 w-full">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                                    >
                                        Retake Assessment
                                    </button>

                                    {score >= 9 ? (
                                        <div className="flex space-x-4">
                                            <a
                                                href="/meetings"
                                                className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 animate-pulse"
                                            >
                                                Join a Meeting Now
                                            </a>
                                            <a
                                                href="/conventions"
                                                className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 animate-pulse border-2 border-red-800 shadow-lg"
                                            >
                                                Book a Convention
                                            </a>
                                        </div>
                                    ) : (
                                        <a
                                            href="/meetings"
                                            className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-indigo-700"
                                        >
                                            Find a Meeting
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Safety Footer */}
                <div className="mt-12 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-500 mb-2">
                        Disclaimer: This self-assessment is for educational purposes only and does not constitute a medical diagnosis.
                    </p>
                    <p className="text-sm font-bold text-red-600">
                        If you are in immediate danger or experiencing a medical emergency, please call 112 or your local emergency number immediately.
                    </p>
                    <div className="mt-4 text-sm text-gray-600">
                        Crisis Hotline: <a href="tel:988" className="text-primary hover:underline">14416</a> (Suicide & Crisis Lifeline)
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Assessments;
