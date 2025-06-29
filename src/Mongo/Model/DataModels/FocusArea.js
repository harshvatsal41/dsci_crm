import mongoose from "mongoose";

const focusAreaSchema = new mongoose.Schema({
    name: String,
    description: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
});

export default mongoose.models.FocusArea || mongoose.model("FocusArea", focusAreaSchema);
