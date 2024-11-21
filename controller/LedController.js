import AsyncHandler from 'express-async-handler';

export const CreateLed = AsyncHandler(async (req, res) => {
    // Log for debugging purposes (remove in production)
    console.log("Creating LED");

    // Destructure data from the request body
    const { Name, Address, Parent } = req.body;

    // Check if any of the required fields are missing
    if (!Name || !Address || !Parent) {
        return res.status(400).json({
            error: 'All fields (Name, Address, Parent) are required'
        });
    }

    // Return the data as a JSON response
    return res.status(201).json({
        Name,
        Address,
        Parent
    });
});
