"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStep = exports.AccommodationType = exports.TransportType = exports.ProjectStatus = void 0;
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["PLANNING"] = "PLANNING";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["CANCELLED"] = "CANCELLED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var TransportType;
(function (TransportType) {
    TransportType["PLANE"] = "PLANE";
    TransportType["TRAIN"] = "TRAIN";
    TransportType["BUS"] = "BUS";
    TransportType["CAR"] = "CAR";
    TransportType["BOAT"] = "BOAT";
    TransportType["OTHER"] = "OTHER";
})(TransportType || (exports.TransportType = TransportType = {}));
var AccommodationType;
(function (AccommodationType) {
    AccommodationType["HOTEL"] = "HOTEL";
    AccommodationType["HOSTEL"] = "HOSTEL";
    AccommodationType["APARTMENT"] = "APARTMENT";
    AccommodationType["HOUSE"] = "HOUSE";
    AccommodationType["CAMPING"] = "CAMPING";
    AccommodationType["OTHER"] = "OTHER";
})(AccommodationType || (exports.AccommodationType = AccommodationType = {}));
var ProjectStep;
(function (ProjectStep) {
    ProjectStep["DATE_SELECTION"] = "DATE_SELECTION";
    ProjectStep["TRANSPORT"] = "TRANSPORT";
    ProjectStep["ACCOMMODATION"] = "ACCOMMODATION";
    ProjectStep["ACTIVITIES"] = "ACTIVITIES";
})(ProjectStep || (exports.ProjectStep = ProjectStep = {}));
