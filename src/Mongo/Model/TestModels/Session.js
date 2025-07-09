import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: String, // e.g., Panel, Workshop, Masterclass
    speakerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
    focusAreaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "FocusArea" }],
    timeSlotId: { type: mongoose.Schema.Types.ObjectId, ref: "TimeSlot" },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
