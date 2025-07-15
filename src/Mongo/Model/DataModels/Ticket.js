const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Ticket name is required"],
        trim: true,
    },
    subHeading: {
        type: String,
        trim: true,
    },

    // Price details
    priceReference: [{
        price: {
            type: Number,
            trim: true,
            min: [0, "Price must be non-negative"],
        },
        eligibility: {
            type: String,
            trim: true,
        },
    }
    ],

    price: {
        type: Number,
        required: [true, "Ticket price is required"],
        min: [0, "Price must be non-negative"],
    },
    originalPrice: {
        type: Number,
        min: [0, "Original price must be non-negative"],
    },
    discountPercentage: {
        type: Number,
        min: [0, "Discount must be 0 or greater"],
        max: [100, "Discount cannot exceed 100%"],
    },

    // Status fields
    availableStatus: {
        type: String,
        enum: ["active", "inactive", "soldOut"],
        default: "active",
    },

    isComplimentary: {
        type: Boolean,
        default: false,
    },

    // Access details
    accessIncludes: {
        type: [String],
        default: [],
    },

    // Validity information
    validityPeriod: {
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        }
    },
    applicableDate: {
        type: Date,
    },

    // Ticket type
    passType: {
        type: String,
        required: [true, "Ticket type is required"],
        trim: true,
    },

    venue: {
        type: String,
        trim: true,
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

    // Event references
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },



}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    versionKey: false,
    strict: true,
});

export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

