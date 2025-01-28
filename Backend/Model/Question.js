const questionSchema = new mongoose.Schema({
    level: {
      type: Number,
      required: [true, 'Level is required'],
      min: 1
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    image: {
      url: String,
      alt: String,
      public_id: String
    },
    hints: [{
      text: {
        type: String,
        required: true
      },
      unlockTime: {
        type: Number,
        required: true // 5, 10, or 15 minutes
      }
    }],
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Question', questionSchema);