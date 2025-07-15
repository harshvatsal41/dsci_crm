import dbConnect from "@/Mongo/Lib/dbConnect";
import Employee from "@/Mongo/Model/AcessModels/Employee";


export async function POST(req) {
    try {
        await dbConnect();

        const { username, email, password, contactNo } = await req.json();

        if (!username || !email || !password || !contactNo) {
            return new Response(
                JSON.stringify({ error: "All fields are required." }),
                { status: 400 }
            );
        }

        const existingUser = await Employee.findOne({ email });

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "User already exists." }),
                { status: 400 }
            );
        }


        const user = await Employee.create({ username, email, password: password, contactNo });

        return new Response(
            JSON.stringify({
                message: "User registered successfully!",
                user: { id: user._id, username: user.username, email: user.email },
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error handling POST request:", error.stack);
        return new Response(
            JSON.stringify({ error: "An error occurred. Please try again." }),
            { status: 500 }
        );
    }
}