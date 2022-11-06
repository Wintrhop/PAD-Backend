"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    advice: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Advice",
        required: false,
    },
    tradLib: {
        type: String,
        required: true,
    },
    mayorExtension: {
        type: String,
        required: false,
    },
    escritura: {
        type: String,
        required: true,
    },
    regPropHorizontal: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Study", studySchema);
