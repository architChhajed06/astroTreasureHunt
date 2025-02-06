import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Plus, ChevronUp, ChevronDown, Users, Star } from "lucide-react";
import NavBar from "../components/navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import SpaceBackground from "../components/space-background";

const leaderboardData = [
  { name: "Commander Sarah", level: 5, score: 2500, questionsAnswered: 50, accuracy: 95 },
  { name: "Captain Mike", level: 4, score: 2100, questionsAnswered: 45, accuracy: 92 },
  { name: "Lieutenant Alex", level: 4, score: 1800, questionsAnswered: 40, accuracy: 88 },
  { name: "Ensign Emily", level: 3, score: 1500, questionsAnswered: 35, accuracy: 85 },
  { name: "Cadet Tom", level: 2, score: 1200, questionsAnswered: 30, accuracy: 80 },
];

const StatCard = ({ icon, title, value, color }) => (
  <Card className={`p-4 backdrop-blur-xl bg-${color}/10 border-${color}/30`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <span className={`text-2xl font-bold text-${color}-400`}>{value}</span>
    </div>
  </Card>
);

export default function AdminDashboard() {
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeaderboard, setFilteredLeaderboard] = useState(leaderboardData);

  useEffect(() => {
    const sorted = [...leaderboardData]
      .sort((a, b) => (sortOrder === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]))
      .filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredLeaderboard(sorted);
  }, [sortBy, sortOrder, searchTerm]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <>
      <SpaceBackground />
      <NavBar />

      <main className="min-h-screen pt-20 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="container mx-auto max-w-6xl">
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Cosmic Command Center</h1>
              <Link to="/admin/add-question">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Cosmic Challenge
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard icon={<Trophy className="h-6 w-6 text-yellow-400" />} title="Top Score" value="2,500" color="yellow" />
              <StatCard icon={<Users className="h-6 w-6 text-blue-400" />} title="Total Explorers" value="1,337" color="blue" />
              <StatCard icon={<Star className="h-6 w-6 text-purple-400" />} title="Avg. Accuracy" value="88%" color="purple" />
            </div>

            <div className="mb-4">
              <Input type="text" placeholder="Search space explorers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder-white/50" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-white mb-2">
                <Button variant="ghost" onClick={() => toggleSort("name")} className="text-white hover:text-purple-300">Explorer Name {sortBy === "name" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}</Button>
                <Button variant="ghost" onClick={() => toggleSort("level")} className="text-white hover:text-purple-300">Level {sortBy === "level" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}</Button>
                <Button variant="ghost" onClick={() => toggleSort("score")} className="text-white hover:text-purple-300">Score {sortBy === "score" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}</Button>
                <span>Performance</span>
              </div>
              <AnimatePresence>
                {filteredLeaderboard.map((player, index) => (
                  <motion.div key={player.name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.2 }} className={`p-4 rounded-lg ${index < 3 ? "bg-purple-500/20 border border-purple-500/50 shadow-[0_0_10px_rgba(147,51,234,0.3)]" : "bg-white/5"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-white/80">#{index + 1}</div>
                        <div>
                          <div className="text-lg font-medium text-white">{player.name}</div>
                          <div className="text-sm text-white/60">Level {player.level}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">{player.score} pts</Badge>
                      <div className="text-right">
                        <div className="text-sm text-white/60">{player.questionsAnswered} challenges completed</div>
                        <div className="text-sm text-white/60">{player.accuracy}% accuracy</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </main>
    </>
  );
}
