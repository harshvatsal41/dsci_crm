import Employee from "@/Mongo/Model/AcessModels/Employee.js";
import Role from "@/Mongo/Model/AcessModels/Role.js";
import mongoose from "mongoose";

async function seedAdmin() {
  try {
    await connectDB();

    // Load admin credentials from env or defaults
    const adminCredentials = {
      username: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      contactNo: process.env.ADMIN_CONTACT || "0000000000",
      password: process.env.ADMIN_PASSWORD || "Admin@123",
    };


    let normalRole  = await Role.findOne({name:"Normal"}) 
    if(!normalRole){
        normalRole = await Role.create({
            name: "Normal",
            description: "Normal role",
            permissions: {
              blog: { create: false, read: true, update: false, delete: false },
              colab: { create: false, read: true, update: false, delete: false },
              colabCatagory: { create: false, read: true, update: false, delete: false },
              event: { create: false, read: true, update: false, delete: false },
              faq: { create: false, read: true, update: false, delete: false },
              focusArea: { create: false, read: true, update: false, delete: false },
              speaker: { create: false, read: true, update: false, delete: false },
              testimonial: { create: false, read: true, update: false, delete: false },
              ticket: { create: false, read: true, update: false, delete: false },
              user: { create: false, read: true, update: false, delete: false },
            },
            isFixed: false,
            createBy: null,
            updateBy: null,
            deleteBy: null,
            isDeleted: false,
            deletedAt: null,
          });
          console.log("✅ Normal role created.");
    }


    // Ensure Admin Role exists
    let adminRole = await Role.findOne({ name: "Admin" });
    if (!adminRole) {
      adminRole = await Role.create({
        name: "Admin",
        description: "Admin role",
        permissions: {
          blog: { create: true, read: true, update: true, delete: true },
          colab: { create: true, read: true, update: true, delete: true },
          colabCatagory: { create: true, read: true, update: true, delete: true },
          event: { create: true, read: true, update: true, delete: true },
          faq: { create: true, read: true, update: true, delete: true },
          focusArea: { create: true, read: true, update: true, delete: true },
          speaker: { create: true, read: true, update: true, delete: true },
          testimonial: { create: true, read: true, update: true, delete: true },
          ticket: { create: true, read: true, update: true, delete: true },
          user: { create: true, read: true, update: true, delete: true },
        },
        isFixed: true,
        createBy: null,
        updateBy: null,
        deleteBy: null,
        isDeleted: false,
        deletedAt: null,
      });
      console.log("✅ Admin role created.");
    }

    // Check if admin user already exists
    const existingUser = await Employee.findOne({
      $or: [
        { username: adminCredentials.username },
        { email: adminCredentials.email },
      ],
    });

    if (existingUser) {
      // Update existing admin
      existingUser.password = adminCredentials.password;
      existingUser.contactNo = adminCredentials.contactNo;
      existingUser.isVerified = true;
      existingUser.isSuperAdmin = true;
      existingUser.isDeleted = false;
      existingUser.role = adminRole._id;
      await existingUser.save();

      console.log("✅ Admin user already exists. Details updated.");
    } else {
      // Create new admin user
      await  Employee.create({
        ...adminCredentials,
        isVerified: true,
        isSuperAdmin: true,
        isDeleted: false,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
        verifyToken: null,
        verifyTokenExpiry: null,
        role: adminRole._id,
      });

      console.log("✅ Admin user seeded.");
    }
  } catch (error) {
    console.error("❌ Seeding admin failed:", error);
  }
}

export default seedAdmin;

let isConnected = false;

const connectDB = async () => {

  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
        throw new Error("Database credentials are missing in environment variables");
    }

    try {
        const db = await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 30000, // Increase socket timeout
        });
        isConnected = db.connection.readyState === 1; // 1 means connected
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}