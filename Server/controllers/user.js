import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = {
        name,
        email,
        password: hashedPassword,
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const activationToken = jwt.sign({
        user, otp,
    }, process.env, Activation_SECRET, { expiresIn: '15m' });
    const data = {
        name, opt,
    };
    await sendMail(email, 'OTP Verification', data);
    res.status(200).json({
        message: 'Verification email sent',
        activationToken,
    });
})
export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;

    const verify = jwt.verify(activationToken, process.env.Activation_Secret);
    if (!verify)
        return res.status(400).json({
            message: "Otp Expired",
        });
    if (verify.otp !== otp)
        return res.status(400).json({
            message: "Wrong Otp",
        });
    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
    });

    res.json({
        message: "User Registered",
    });
})

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({
            message: "No User with this email",
        });
    const mathPassword = await bcrypt.compare(password, user.password);

    if (!mathPassword)
        return res.status(400).json({
            message: "wrong Password",
        });
    const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
        expiresIn: "15d",
    });
    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user,
    });


})
export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({ user });
});
