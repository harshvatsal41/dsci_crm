import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
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
    image: {
      type: String,
      required: true,
      trim: true,
    },
    externalLink: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    contentWeight: {
      type: Number,
      required: true,
      min: 0,
    },
    yeaslyEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventOutreach",
      required: true,
    },

    // User references
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Soft delete fields
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
    timestamps: true, // Adds createdAt & updatedAt automatically
    strict: true,     // Disallow values not defined in the schema
  }
);

// Exporting the model
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
