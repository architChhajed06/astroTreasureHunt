import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { FETCH_LEVEL_STATS } from '../../constants';
import QuestionStats from './QuestionStats';

export function LevelStats() {
  const [levelStats, setLevelStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get(FETCH_LEVEL_STATS, {
        withCredentials: true
      });
      if (response.data.success) {
        setLevelStats(response.data.levelStats);
      }
    } catch (error) {
      console.error('Error fetching level stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Level Statistics</h2>
      
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelStats.map((level) => (
            <Card 
              key={level.levelId}
              className="bg-black/30 border-white/10 p-6 hover:bg-black/40 transition-colors cursor-pointer"
              onClick={() => setSelectedLevel(level.levelId)}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Level {level.levelNumber}
              </h3>
              <div className="space-y-2">
                <p className="text-purple-400">
                  Teams in level: {level.totalTeams}
                </p>
                <p className="text-gray-400">
                  Total questions: {level.totalQuestions}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedLevel && (
        <QuestionStats 
          levelId={selectedLevel} 
          onClose={() => setSelectedLevel(null)} 
        />
      )}
    </div>
  );
}
