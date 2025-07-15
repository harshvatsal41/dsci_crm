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
    focusAreaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "FocusArea" }],
    speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
    faqIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faq" }],
    testimonialIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Testimonial" }],
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    
}, { timestamps: true });

export default mongoose.models.EventOutreach || mongoose.model("EventOutreach", EventOutreachSchema);