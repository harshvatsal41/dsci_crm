import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a role name"],
        unique: true,
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    description: {
        type: String,
        required: [true, "Please provide a role description"],
    },
    permissions: {
        blog:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        colab:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        colabCatagory:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        event:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        faq:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        focusArea:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        speaker:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        testimonial:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        ticket:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
        user:{
            create:{type: Boolean, default: false},
            read:{type: Boolean, default: false},
            update:{type: Boolean, default: false},
            delete:{type: Boolean, default: false},
        },
    },
    isFixed: {
        type: Boolean,
        default: false,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    deleteBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
});

const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

export default Role;
