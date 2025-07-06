import mongoose from "mongoose";

const subEventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    sessionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.models.SubEvent || mongoose.model("SubEvent", subEventSchema);
