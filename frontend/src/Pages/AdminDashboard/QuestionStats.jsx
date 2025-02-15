import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { X } from 'lucide-react';
import { FETCH_LEVEL_QUESTION_STATS } from '../../constants';

export default function QuestionStats({ levelId, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionStats = async () => {
      try {
        const response = await axios.get(FETCH_LEVEL_QUESTION_STATS(levelId), {
          withCredentials: true
        });
        if (response.data.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching question stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionStats();
    const interval = setInterval(fetchQuestionStats, 30000);
    return () => clearInterval(interval);
  }, [levelId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-black/80 border-white/10 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Level {stats?.levelNumber} Questions
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="space-y-4">
            {stats?.questionStats.map((question) => (
              <div 
                key={question.questionId}
                className="bg-white/5 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {question.title}
                </h3>
                <p className="text-purple-400 mb-3">
                  Currently attempting: {question.currentlyAttempting} teams
                </p>
                {question.attemptingTeams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Teams currently on this question:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {question.attemptingTeams.map((team) => (
                        <span 
                          key={team.teamId}
                          className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-sm"
                        >
                          {team.teamName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}