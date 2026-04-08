"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const secret = process.env.JWT_SECRET;
if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
}
exports.jwtConstants = {
    secret: secret || 'DO_NOT_USE_THIS_IN_PRODUCTION_AyuSangh_2026',
};
//# sourceMappingURL=constants.js.map