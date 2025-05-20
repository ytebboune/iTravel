"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortOrder = exports.SortField = void 0;
var SortField;
(function (SortField) {
    SortField["CREATED_AT"] = "createdAt";
    SortField["UPDATED_AT"] = "updatedAt";
    SortField["NAME"] = "name";
    SortField["PRICE"] = "price";
    SortField["RATING"] = "rating";
    SortField["SCORE"] = "score";
    SortField["DURATION"] = "duration";
    SortField["DATE"] = "date";
})(SortField || (exports.SortField = SortField = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
