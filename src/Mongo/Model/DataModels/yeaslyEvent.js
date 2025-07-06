import mongoose from "mongoose";

const EventOutreachSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    edition: { type: Number, required: true },
    websiteURL: { type: String},
    socialMediaLinks: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        youtube: { type: String },
    },
    dates: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    },
    location: {
        address: { type: String, required: true },
        latitude: { type: Number},
        longitude: { type: Number},
        googleMapsLink: { type: String, required: true },
        city: { type: String , required: true },
        state: { type: String , required: true },
        country: { type: String, required: true  },
        pincode: { type: String , required: true }
    },
    description: { type: String,},

    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export default mongoose.models.EventOutreach || mongoose.model("EventOutreach", EventOutreachSchema);