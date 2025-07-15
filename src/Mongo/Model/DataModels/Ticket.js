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

    paymentUrl: {
        type: String,
        trim: true,
        required: [true, "Payment URL is required"],
        index: true,
        unique: true,
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
        required: [true, "Original price is required"],
        min: [0, "Original price must be non-negative"],
    },
    discountPercentage: {
        type: Number,
        required: [true, "Discount percentage is required"],
        min: [0, "Discount must be 0 or greater"],
        max: [100, "Discount cannot exceed 100%"],
    },

    // Status fields
    availableStatus: {
        type: String,
        enum: ["active", "inactive", "soldOut"],
        default: "active",
    },

    accessIncludes: {
        type: [
          {
            label: {
              type: String,
              trim: true,
              required: true,
            },
            isComplimentary: {
              type: Boolean,
              default: false,
            },
          }
        ],
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

