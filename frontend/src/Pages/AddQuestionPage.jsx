import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import SpaceBackground from "../components/space-background";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Upload } from "lucide-react";

export default function AddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [hints, setHints] = useState(["", "", ""]);
  const [level, setLevel] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ questionText, correctAnswer, hints, level, image });
    setQuestionText("");
    setCorrectAnswer("");
    setHints(["", "", ""]);
    setLevel("");
    setImage(null);
  };

  return (
    <>
      <SpaceBackground />
      <NavBar />
      <main className="min-h-screen pt-20 p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="container mx-auto max-w-2xl">
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Add New Question</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Question Image</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  {image ? (
                    <img src={image} alt="Uploaded question" className="max-h-48 mx-auto" />
                  ) : (
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-white/50 mx-auto mb-2" />
                      <span className="text-white/50">Click to upload image</span>
                    </Label>
                  )}
                  <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question-text" className="text-white">Question Text</Label>
                <Textarea id="question-text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Enter your question..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correct-answer" className="text-white">Correct Answer</Label>
                <Input id="correct-answer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="bg-white/10 border-white/20 text-white" placeholder="Enter the correct answer..." required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {hints.map((hint, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`hint-${index + 1}`} className="text-white">Hint {index + 1}</Label>
                    <Input id={`hint-${index + 1}`} value={hint} onChange={(e) => {
                      const newHints = [...hints];
                      newHints[index] = e.target.value;
                      setHints(newHints);
                    }} className="bg-white/10 border-white/20 text-white" placeholder={`Enter hint ${index + 1}...`} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-white">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level" className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <SelectItem key={lvl} value={lvl.toString()}>Level {lvl}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Submit Question
              </Button>
            </form>
          </Card>
        </motion.div>
      </main>
    </>
  );
}
