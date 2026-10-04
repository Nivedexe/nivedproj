import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const AdminAssessmentForm = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Hidden General Settings (Defaults)
    const [formData, setFormData] = useState({
        title: 'Clinical Substance Use Risk Assessment',
        description: 'A clinically inspired 10-question assessment to evaluate substance use patterns and associated risks.',
        criteria: 'Answer all 10 questions honestly to receive a clinically inspired substance-use risk evaluation.',
        scoringLogic: JSON.stringify({
            calculation: "total / 3.6",
            thresholds: [
                { maxScore: 2, message: "Low Risk" },
                { maxScore: 4, message: "Mild Risk" },
                { maxScore: 6, message: "Moderate Risk" },
                { maxScore: 8, message: "High Risk" },
                { maxScore: 10, message: "Severe Risk (Immediate Professional Attention Recommended)" }
            ]
        }, null, 2)
    });

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(getEmptyQuestion());
    const [editingIndex, setEditingIndex] = useState(-1);
    const [error, setError] = useState('');

    function getEmptyQuestion() {
        return {
            id: Date.now(),
            text: '',
            helpText: '',
            type: 'single-choice',
            options: [{ text: '', score: 0 }],
            weight: 1,
            locale: 'en',
            active: true
        };
    }

    useEffect(() => {
        if (isEditMode) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`http://localhost:5000/api/tests/${id}`, config);
                    setFormData({
                        title: res.data.title,
                        description: res.data.description,
                        criteria: res.data.criteria,
                        scoringLogic: JSON.stringify(res.data.scoringLogic, null, 2)
                    });
                    setQuestions(res.data.questions || []);
                } catch (err) {
                    setError('Failed to fetch test data');
                }
            };
            fetchData();
        }
    }, [isEditMode, id]);

    const handleQuestionChange = (field, value) => {
        setCurrentQuestion({ ...currentQuestion, [field]: value });
    };

    const handleOptionChange = (idx, field, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[idx][field] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const addOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { text: '', score: 0 }]
        });
    };

    const removeOption = (idx) => {
        const newOptions = [...currentQuestion.options];
        newOptions.splice(idx, 1);
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const deleteQuestion = (index) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
            if (editingIndex === index) {
                setEditingIndex(-1);
                setCurrentQuestion(getEmptyQuestion());
            }
        }
    };

    const saveQuestion = () => {
        let questionToSave = { ...currentQuestion };

        if (questionToSave.type === 'single-choice') {
            questionToSave.options = questionToSave.options.map(opt => ({
                ...opt,
                score: Number(opt.score)
            }));
        }

        if (editingIndex >= 0) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = questionToSave;
            setQuestions(updatedQuestions);
            setEditingIndex(-1);
        } else {
            setQuestions([...questions, questionToSave]);
        }
        setCurrentQuestion(getEmptyQuestion());
    };

    const editQuestion = (index) => {
        setCurrentQuestion({ ...questions[index] });
        setEditingIndex(index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...formData,
                questions: questions,
                scoringLogic: JSON.parse(formData.scoringLogic)
            };

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/tests/${id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/tests', payload, config);
            }

            if (user?.role === 'volunteer') {
                alert('Assessment edits saved! Your proposed changes have been submitted to the Administrator for approval.');
                navigate('/volunteer-dashboard');
            } else {
                alert('Assessment updated and published live!');
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save test.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Assessment
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Configure questions, answer weights, and screening evaluation.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate(user?.role === 'volunteer' ? '/volunteer-dashboard' : '/admin')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded shadow-sm transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transition-transform transform hover:scale-105 text-sm"
                        >
                            {user?.role === 'volunteer' ? 'Submit Edits for Approval' : 'Save & Publish Assessment'}
                        </button>
                    </div>
                </div>

                {user?.role === 'volunteer' && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0 text-xl">⏳</div>
                            <div className="ml-3">
                                <h3 className="text-sm font-bold text-amber-900">Volunteer Assessment Moderation Notice</h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    As a volunteer, your edits to questions and scoring will be saved as draft changes awaiting administrator review. 
                                    Tipplers taking the assessment will continue to see the current active version until your edits are reviewed and approved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Question Editor */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden sticky top-24">
                            <div className="bg-primary px-6 py-4">
                                <h2 className="text-xl font-bold text-white">
                                    {editingIndex >= 0 ? 'Edit Question' : 'Add New Question'}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                                    <textarea
                                        className="w-full border rounded p-2 focus:ring-primary focus:border-primary"
                                        rows="3"
                                        value={currentQuestion.text}
                                        onChange={(e) => handleQuestionChange('text', e.target.value)}
                                        placeholder="e.g., How often do you drink?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Help Text (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded p-2 focus:ring-primary focus:border-primary"
                                        value={currentQuestion.helpText}
                                        onChange={(e) => handleQuestionChange('helpText', e.target.value)}
                                        placeholder="Hint for the user"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full border rounded p-2 focus:ring-primary focus:border-primary"
                                        value={currentQuestion.type}
                                        onChange={(e) => handleQuestionChange('type', e.target.value)}
                                    >
                                        <option value="single-choice">Single Choice</option>
                                        <option value="paragraph">Paragraph</option>
                                    </select>
                                </div>

                                {/* Dynamic Options / Settings based on Type */}
                                {currentQuestion.type === 'single-choice' && (
                                    <div className="bg-gray-50 p-3 rounded border">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Options & Scores</label>
                                        {currentQuestion.options.map((opt, idx) => (
                                            <div key={idx} className="flex space-x-2 mb-2 items-center">
                                                <input
                                                    type="text"
                                                    className="flex-grow border rounded p-1 text-sm"
                                                    placeholder="Label"
                                                    value={opt.text}
                                                    onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    className="w-20 border rounded p-1 text-sm"
                                                    placeholder="Score"
                                                    max="10"
                                                    value={opt.score}
                                                    onChange={(e) => {
                                                        let val = parseInt(e.target.value) || 0;
                                                        if (val > 10) val = 10;
                                                        handleOptionChange(idx, 'score', val);
                                                    }}
                                                />
                                                <button onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-700">×</button>
                                            </div>
                                        ))}
                                        <button onClick={addOption} className="text-xs text-primary font-bold uppercase tracking-wide mt-1">+ Add Option</button>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        onClick={saveQuestion}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded shadow transition-colors"
                                    >
                                        {editingIndex >= 0 ? 'Update Question' : 'Add to Assessment'}
                                    </button>
                                    {editingIndex >= 0 && (
                                        <button
                                            onClick={() => {
                                                setEditingIndex(-1);
                                                setCurrentQuestion(getEmptyQuestion());
                                            }}
                                            className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Questions Grid */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Questions ({questions.length})</h2>
                                <span className="text-sm text-gray-500">Click a question to edit</span>
                            </div>

                            {questions.length === 0 ? (
                                <div className="p-10 text-center text-gray-500">
                                    No questions added yet. Use the form on the left to add one.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 p-6">
                                    {questions.map((q, index) => (
                                        <div
                                            key={index}
                                            onClick={() => editQuestion(index)}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${editingIndex === index ? 'ring-2 ring-primary border-transparent bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start space-x-3">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{q.text}</h3>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                                {q.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteQuestion(index);
                                                    }}
                                                    className="text-gray-400 hover:text-red-600 p-1"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAssessmentForm;
