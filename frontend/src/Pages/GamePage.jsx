import { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/navbar'; // Adjust the path as needed
import { Button } from '../components/ui/button'; // Adjust the path as needed
import { Input } from '../components/ui/input'; // Adjust the path as needed
import { Card } from '../components/ui/card'; // Adjust the path as needed
import { Badge } from '../components/ui/badge'; // Adjust the path as needed
import SpaceBackground from '../components/space-background'; // Adjust the path as needed

export default function GamePage() {
  const [hints, setHints] = useState([false, false, false]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

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
                <div className="text-xl font-bold text-white">Commander John</div>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Level 1
                </Badge>
              </div>
              <div className="text-2xl font-mono text-white">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Question Area */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg bg-white/5 flex items-center justify-center text-white/50">
                Question Image (if any)
              </div>
              <p className="text-lg text-white">What is the name of the galaxy shown in the image above?</p>
            </div>

            {/* Hints */}
            <div className="grid grid-cols-3 gap-4">
              {hints.map((revealed, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className={`border-purple-500/50 ${revealed ? "bg-purple-500/20" : "hover:bg-purple-500/10"}`}
                  onClick={() => {
                    const newHints = [...hints];
                    newHints[i] = true;
                    setHints(newHints);
                  }}
                >
                  {revealed ? (
                    <span className="text-purple-300">This is hint {i + 1}</span>
                  ) : (
                    <span className="text-purple-400">Reveal Hint {i + 1}</span>
                  )}
                </Button>
              ))}
            </div>

            {/* Answer Input */}
            <div className="flex gap-4">
              <Input
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter your answer..."
              />
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8">
                Submit
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </>
  );
}
