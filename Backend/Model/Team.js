import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      rollNo: {
        type: String,
        required: true
      }
    }],
    currentLevel: {
      type: Number,
      default: 1
    },
    score: {
      type: Number,
      default: 0
    },
    currentQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    levelStartTime: {
      type: Date
    },
    hintsUnlocked: [{
      hintNumber: Number,
      unlockedAt: Date
    }],
    completedQuestions: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      completedAt: Date,
      timeTaken: Number,
      hintsUsed: [Number]
    }],
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active'
    },
    //To determine weather the team is blocked or not
    blocked: {
      type: Boolean,
      default: false
    },
    //To uniquely identify a team through a code and allow users to join an existing team
    team_code: {
      type: String,
      default: '',
      unique: true
    }
  }, {
    timestamps: true
  });

export default mongoose.model('Team', teamSchema);