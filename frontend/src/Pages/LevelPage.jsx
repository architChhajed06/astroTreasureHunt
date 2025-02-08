// show all levels to admin and user will click the level and then questions of that level will be shown
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpaceBackground from '../components/space-background';

export default function Levels() {
    const [levels, setLevels] = useState([
        {id:1,questionCount:5},
        {id:2,questionCount:10},
        {id:3,questionCount:15},
        {id:4,questionCount:20},
        {id:5,questionCount:25},
        {id:6,questionCount:30},
        {id:7,questionCount:35},


    ]);

    useEffect(() => {
        fetchLevels();
    }, []);

    const fetchLevels = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/levels');
            const data = await response.json();
            setLevels(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-white text-2xl font-bold mb-4">Levels</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {levels.map((level) => (
                    <div 
                        key={level.id}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">Level {level.id}</h2>
                        <p className="text-gray-300 mb-4">{level.questionCount} Questions</p>
                        <Link 
                            to={`/level/${level.id}/questions`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg block text-center"
                        >
                            View Questions
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

