import AsyncHandler from 'express-async-handler';

import  User  from '../schema/User.js'


export const CreateLed = AsyncHandler(async (req, res) => {
    // Log for debugging purposes (remove in production)
    console.log("Creating user...");

    // Destructure data from the request body
    const { Name, Address, Parent } = req.body;

    // Check if any of the required fields are missing
    if (!Name || !Address || !Parent) {
        return res.status(400).json({
            error: 'All fields (Name, Address, Parent) are required',
        });
    }
    const existingUser = await User.findOne({name:Name})

    if(existingUser){
        return res.status(400).json({
            error: 'User already existss',
        })
    }
    // Create a new user document
    const newUser = new User({
        name: Name,
        address: Address,
        parent: Parent,
    });

    // Save the new user to the database
    try {
        const savedUser = await newUser.save();  // Save the user
        // Return a success response with the saved user data
        return res.status(201).json({
            message: 'User created successfully',
            user   : savedUser,  // You can return the entire saved user object
        });
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({
            error: 'There was an error saving the user to the database',
        });
    }
});




export const getAllUsers = AsyncHandler(async (req, res) => {
    try {
        // Fetch all users with selected fields
        const users = await User.find();

        // If no users are found, return an empty array
        return res.status(200).json(users);
    } catch (error) {
        // Handle any errors that occur
        console.error('Error fetching users:', error);
        return res.status(500).json({
            message: 'There was an error retrieving the users from the database',
        });
    }
});

export const deleteUser = AsyncHandler(async(req,res)=>{

    const {name} = req.body

    try {

        const user = await User.findOne({name:name})
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }

        await user.deleteOne({name:name})

        return res.status(200).json({
            message: 'User deleted successfully',
        });
        
    } catch (error) {

        console.error('Error deleting user:', error);
        return res.status(500).json({
            message: 'There was an error deleting the user from the database',
        });
    
    }
})


// export const CreateLed = AsyncHandler(async (req, res) => {
//     // Log for debugging purposes (remove in production)
//     console.log("Creating LED");

//     // Destructure data from the request body
//     const { Name, Address, Parent } = req.body;

//     // Check if any of the required fields are missing
//     if (!Name || !Address || !Parent) {
//         return res.status(400).json({
//             error: 'All fields (Name, Address, Parent) are required'
//         });
//     }

//     // Return the data as a JSON response
//     return res.status(201).json({
//         Name,
//         Address,
//         Parent
//     });
// });
