import mongoose from "mongoose";
import yeaslyEvent from "./yeaslyEvent";

const speakerSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true }, // optional prefix (e.g., Dr., Prof.)
    organization: { type: String, trim: true },
    position: { type: String, required: true, trim: true },


     // Bio and Experience
     bio: { type: String, required: true },
     experience: { type: Number, min: 0 }, // in years
     expertise: [{ type: String, required: true }], // must have at least one topic

      // Profile Image
    photoUrl: { type: String, trim: true },

    // Contact Information
    phone: { type: String, required: true, trim: true },
    emailOfficial: { type: String, required: true, trim: true },
    emailPersonal: { type: String, trim: true },

    // Social Media Links
    socialLinks: {
        website: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        twitter: { type: String, trim: true },
        facebook: { type: String, trim: true }
    },

     // Additional personal and internal data
     dob: { type: Date },
     gender: { type: String, enum: ["Male", "Female", "Null"],
        default: "Null"
      },
     internalNote: { type: String },

     // Other
    awards: [{ type: String }],

    // Event and Session - Mapped to the main Event
    yeaslyEventId: { type: mongoose.Schema.Types.ObjectId, ref: "EventOutreach" },
    
    
    // SubEvent and Session in the main Event - Mapping pending
    eventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    sessionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    
    
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },


});


export default mongoose.models.Speaker || mongoose.model("Speaker", speakerSchema);