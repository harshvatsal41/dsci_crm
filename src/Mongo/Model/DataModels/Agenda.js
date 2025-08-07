import mongoose from "mongoose";

const AgendaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    yeaslyEventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventOutreach",
        required: true,
    },
    day: {
        type: String,
        enum: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    type: {
        type: String,
        enum: ["Keynote", "Panel", "Workshop", "Breakout", "Networking", "Special"],
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    session: [
        {
            sessionTitle: {
                type: String,
                trim: true,
            },
            sessionDescription: {
                type: String,
                trim: true,
            },
            sessionInstructions: [
                {
                    type: String,
                    trim: true,
                },
            ],
            sessionLocation: {
                type: String,
                trim: true,
            },
            sessionSpeakers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Speaker",
                },
            ],
            sessionCollaborations: [
                {
                    head: {
                        type: String,
                        trim: true,
                        default: null,
                    },
                    company: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Collaboration",
                        default: null,
                    }
                },
            ],
            tags: [
                {
                    type: String,
                    trim: true,
                    default: null,
                },
            ],
        },
    ],
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
    },
    deletedAt: {
        type: Date,
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

export default mongoose.models.Agenda || mongoose.model("Agenda", AgendaSchema);
