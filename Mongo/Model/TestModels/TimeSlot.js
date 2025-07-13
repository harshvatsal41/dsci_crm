import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    startTime: String,
    endTime: String,
    location: String,
    sessionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
});

export default mongoose.models.TimeSlot || mongoose.model("TimeSlot", timeSlotSchema);
