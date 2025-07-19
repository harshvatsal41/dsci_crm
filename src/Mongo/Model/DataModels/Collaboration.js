import mongoose from "mongoose";

// Sub-schema for social media links
const SocialMediaLinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Main schema
const CollaborationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrlPath: {
      type: String,
      required: true,
      trim: true,
    },
    websiteLink: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollabSubCategory",
      required: true,
    },
    contentWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    socialMediaLinks: {
      type: [SocialMediaLinkSchema],
      default: [],
    },
    yeaslyEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventOutreach",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

export default mongoose.models.Collaboration || mongoose.model("Collaboration", CollaborationSchema);
