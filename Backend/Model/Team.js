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
    }
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Team', teamSchema);