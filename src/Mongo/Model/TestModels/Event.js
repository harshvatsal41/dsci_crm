import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    year: Number,
    edition: Number,
    dates: {
        start: Date,
        end: Date,
    },
    location: String,
    description: String,
    focusAreaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "FocusArea" }],
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" },
    sponsorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sponsor" }],
    speakerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
    mentorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }],
    subEventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubEvent" }],
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
