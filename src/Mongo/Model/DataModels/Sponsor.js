import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
    name: String,
    level: String, // e.g., Platinum, Gold
    logoUrl: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.models.Sponsor || mongoose.model("Sponsor", sponsorSchema);
