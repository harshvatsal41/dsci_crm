import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Sponsor", "Partner", "Exhibitor"],
      required: true,
      default: "Sponsor",
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

export default mongoose.models.CollabSubCategory || mongoose.model("CollabSubCategory", SubCategorySchema);
