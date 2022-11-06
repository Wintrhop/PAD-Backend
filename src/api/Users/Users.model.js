"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        match: [emailRegex, "You must enter a valid email example@example.com"],
        required: [true, "Please Enter an Email"],
    },
    password: {
        type: String,
        required: [true, "you should enter a password."],
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ["admin", "advicer", "client"],
            message: "Invalid rol",
        },
    },
    profileImg: {
        type: String,
        required: false,
    },
    studies: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Study" }],
        required: false,
    },
    studiesAssignment: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Study" }],
        required: false,
    },
    advices: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Advice" }],
        required: false,
    },
    approved: {
        type: Boolean,
        required: false,
    },
    advicerPetition: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AdPet",
        required: false,
    },
    advicersApproved: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "AdPet" }],
        required: false,
    }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("User", userSchema);
