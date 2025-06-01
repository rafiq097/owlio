import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  title: { type: String, },
  link: { type: String, },
  status: { type: String, },
  language: { type: String, },
  timestamp: { type: Date, },
  url: { type: String, },
});

const UserSubmissionsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  submissions: [SubmissionSchema],
});

export default mongoose.models.UserSubmissions || mongoose.model('UserSubmissions', UserSubmissionsSchema);
