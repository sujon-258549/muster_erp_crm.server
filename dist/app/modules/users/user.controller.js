import { UserServices } from "./user.servises.js";
const createUser = async (req, res) => {
    try {
        const payload = req.body;
        const result = await UserServices.createUserIntoDB(payload);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    }
    catch (err) {
        console.log(err);
    }
};
export const UserController = {
    createUser,
};
//# sourceMappingURL=user.controller.js.map