import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/navbar'; // Adjust the path as needed
import { Button } from '../components/ui/button'; // Adjust the path as needed
import { Input } from '../components/ui/input'; // Adjust the path as needed
import { Card } from '../components/ui/card'; // Adjust the path as needed
import { Badge } from '../components/ui/badge'; // Adjust the path as needed
import SpaceBackground from '../components/space-background'; // Adjust the path as needed
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FETCH_CURRENT_QUESTION, SUBMIT_CODE } from '../constants.js';

const SET_TIMER_FOR_REFRESHING_QUESTION = 60000;

export default function GamePage() {
  const [hints, setHints] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetchQuestion();
    const interval = setInterval(fetchQuestion, SET_TIMER_FOR_REFRESHING_QUESTION);

    return () => clearInterval(interval);
  }, [])

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(FETCH_CURRENT_QUESTION, {
        withCredentials: true
      });
      console.log("RESPONSE: ", response.data);
      if (response.data.success) {
        console.log("QUESTION: ", response.data.currQuestion);
        setQuestion(response.data.currQuestion);
        // Set hints from the question data
        setHints(response.data.currQuestion.hints || []);
        setAnswer('');
        setError('');
      }
    } catch (err) {
      console.error('Error fetching question:', err);
      setError(err.response?.data?.message || 'Failed to fetch question');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(SUBMIT_CODE, {
        questionCode: answer,
        questionId: question._id
      }, {
        withCredentials: true
      });


      if (response.data.success) {
        // Fetch new question after successful submission
        await fetchQuestion();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    }
  };

  useEffect(() => {
    fetchQuestion();
    // Set up an interval to refresh the question every minute
    const interval = setInterval(fetchQuestion, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SpaceBackground />
      <NavBar />

      <main className="min-h-screen pt-20 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="container mx-auto max-w-4xl"
        >
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-6 space-y-6">
            {/* Player Info & Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-white">{user.name}</div>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Level {question?.level.level}
                </Badge>
              </div>
              <div className="text-2xl font-mono text-white">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Question Area */}
            {loading ? (
              <div className="text-center text-white">Loading question...</div>
            ) : error ? (
              <div className="text-center text-red-400">{error}</div>
            ) : (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl text-white font-semibold">{question?.title}</h2>
                  <p className="text-lg text-white">{question?.description}</p>
                  {question?.image && (
                    <img src={question.image.url} alt="Question" className="rounded-lg max-w-full" />
                  )}
                </div>

                {/* Hints Section */}
                {hints.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Hints:</h3>
                    <div className="space-y-2">
                      {hints.map((hint, index) => (
                        <div
                          key={index}
                          className="bg-white/5 p-4 rounded-lg"
                        >
                          <p className="text-purple-300">
                            {`${index + 1}. ${hint}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Answer Form */}
                {user.role === 'team_leader' && (
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white"
                      placeholder="Enter your answer..."
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      Submit
                    </Button>
                  </form>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </main>
    </>
  );
}
