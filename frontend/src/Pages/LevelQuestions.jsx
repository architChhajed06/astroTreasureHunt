import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SpaceBackground from '../components/space-background';

export default function LevelQuestions() {
    const { levelId } = useParams();
    console.log("levelId",levelId);
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([
        { 
            id: 1, 
            title: "JavaScript Basics",
            description: "Write a function to check if a number is prime",
            correctCode: "function isPrime(num) { ... }",
            hints: ["Check until square root", "Handle edge cases"]
        },
        { 
            id: 2, 
            title: "Array Methods",
            description: "Implement a custom map function",
            correctCode: "Array.prototype.myMap = function() { ... }",
            hints: ["Use this keyword", "Return new array"]
        },
        { 
            id: 3, 
            title: "DOM Manipulation",
            description: "Create a toggle button functionality",
            correctCode: "document.getElementById('btn').addEventListener...",
            hints: ["Use event listeners", "Toggle class"]
        }
    ]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/questions/${levelId}`);
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [levelId]);

    const handleModify = (question) => {
        console.log("Question being passed:", question); // Debug log
        
        navigate(`/modifyQuestion/${levelId}/${question.id}`, {  // Changed questionId to id
            state: { questionData: question }
        });
    };

    const handleDelete = (questionId) => {
        console.log('Delete question:', questionId);
    };

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0">
                <SpaceBackground />
            </div>
            <div className="relative z-10 container mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <Link 
                        to="/admin" 
                        className="text-white hover:text-gray-300"
                    >
                        ← Back to Levels
                    </Link>
                    <Link 
                        to={`/admin/addQuestion/${levelId}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        Add Question
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-white mb-6">Level {levelId} Questions</h1>

                <div className="space-y-4">
                    {questions.map((question) => (
                        <div 
                            key={question.id}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">{question.title}</h2>
                                    <p className="text-gray-300 mb-4">{question.description}</p>
                                    <div className="text-sm text-gray-400">
                                        <p>Hints: {question.hints.join(", ")}</p>
                                        <p className="mt-2">Correct Code: <span className="font-mono">{question.correctCode}</span></p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                        onClick={() => handleModify(question)}
                                    >
                                        Modify
                                    </button>
                                    <button 
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                        onClick={() => handleDelete(question.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}