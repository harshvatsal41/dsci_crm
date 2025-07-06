import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    name: String,
    title: String,
    organization: String,
    areasOfInterest: [String],
    photoUrl: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.models.Mentor || mongoose.model("Mentor", mentorSchema);
