import mongoose from "mongoose";

const focusAreaSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
        trim:true,
        index:true,
    },
    description: String,
    imageUrlPath: String,
    yeaslyEventId: { type: mongoose.Schema.Types.ObjectId, ref: "EventOutreach" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

focusAreaSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

focusAreaSchema.pre("updateOne", function(next) {
    this.updatedAt = Date.now();
    next();
});

focusAreaSchema.pre("deleteOne", function(next) {
    this.deletedAt = Date.now();
    next();
});

export default mongoose.models.FocusArea || mongoose.model("FocusArea", focusAreaSchema);
