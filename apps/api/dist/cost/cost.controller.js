"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostController = void 0;
const common_1 = require("@nestjs/common");
const cost_service_1 = require("./cost.service");
let CostController = class CostController {
    costService;
    constructor(costService) {
        this.costService = costService;
    }
    getCosts() {
        return this.costService.getAll();
    }
};
exports.CostController = CostController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CostController.prototype, "getCosts", null);
exports.CostController = CostController = __decorate([
    (0, common_1.Controller)('costs'),
    __metadata("design:paramtypes", [cost_service_1.CostService])
], CostController);
//# sourceMappingURL=cost.controller.js.map