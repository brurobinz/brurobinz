
import mongoose from "mongoose";
const helpRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  helpType: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

export default HelpRequest
