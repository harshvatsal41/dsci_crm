import mongoose from "mongoose";

const speakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: String,
    organization: String,
    bio: String,
    photoUrl: String,
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    website: { type: String, trim: true },
    expertise: [{ type: String }], // e.g., ["AI", "Data Science"]
    awards: [{ type: String }],
    eventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    sessionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }
});

speakerSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Speaker || mongoose.model("Speaker", speakerSchema);