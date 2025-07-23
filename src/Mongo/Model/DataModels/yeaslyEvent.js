import mongoose from "mongoose";

const EventOutreachSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  edition: { type: Number, required: true },
  globalFetch: {
    type: String,
    unique: true,
    required: true,
    immutable: true, // cannot be updated once created
  },
  websiteURL: { type: String },
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
    latitude: { type: Number },
    longitude: { type: Number },
    googleMapsLink: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  description: { type: String, },
  focusAreaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "FocusArea" }],
  speakers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
  faqIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faq" }],
  testimonialIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Testimonial" }],
  ticketIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  sponsorGroups: [
    {
      subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollabSubCategory",
        required: true,
      },
      sponsors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Collaboration",
        },
      ],
    },
  ],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: { type: Date, default: Date.now },

}, { timestamps: true });


function generateGlobalFetch(title, edition, year) {
  const combined = `${title}-${edition}-${year}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')   // remove special characters
    .trim()
    .replace(/\s+/g, '-')          // replace spaces with hyphens
}

// 📌 Pre-save hook to generate globalFetch if not set
EventOutreachSchema.pre('save', function (next) {
  if (!this.globalFetch) {
    this.globalFetch = generateGlobalFetch(this.title, this.edition, this.year);
  }
  next();
});


export default mongoose.models.EventOutreach || mongoose.model("EventOutreach", EventOutreachSchema);