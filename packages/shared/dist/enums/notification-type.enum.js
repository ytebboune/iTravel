"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    // Système
    NotificationType["SYSTEM"] = "SYSTEM";
    // Posts
    NotificationType["POST_CREATED"] = "POST_CREATED";
    NotificationType["POST_LIKED"] = "POST_LIKED";
    NotificationType["POST_COMMENTED"] = "POST_COMMENTED";
    // Stories
    NotificationType["STORY_CREATED"] = "STORY_CREATED";
    NotificationType["STORY_VIEWED"] = "STORY_VIEWED";
    // Places
    NotificationType["PLACE_CREATED"] = "PLACE_CREATED";
    NotificationType["PLACE_LIKED"] = "PLACE_LIKED";
    NotificationType["PLACE_COMMENTED"] = "PLACE_COMMENTED";
    // Follow
    NotificationType["FOLLOW_REQUEST"] = "FOLLOW_REQUEST";
    NotificationType["FOLLOW_ACCEPTED"] = "FOLLOW_ACCEPTED";
    NotificationType["FOLLOW_REJECTED"] = "FOLLOW_REJECTED";
    // Activités
    NotificationType["ACTIVITY_CREATED"] = "ACTIVITY_CREATED";
    NotificationType["ACTIVITY_UPDATED"] = "ACTIVITY_UPDATED";
    NotificationType["ACTIVITY_DELETED"] = "ACTIVITY_DELETED";
    NotificationType["ACTIVITY_VOTE"] = "ACTIVITY_VOTE";
    // Projets
    NotificationType["PROJECT_INVITATION"] = "PROJECT_INVITATION";
    NotificationType["PROJECT_UPDATE"] = "PROJECT_UPDATE";
    NotificationType["PROJECT_JOINED"] = "PROJECT_JOINED";
    NotificationType["PROJECT_LEFT"] = "PROJECT_LEFT";
    // Commentaires
    NotificationType["COMMENT"] = "COMMENT";
    NotificationType["COMMENT_ADDED"] = "COMMENT_ADDED";
    NotificationType["COMMENT_LIKED"] = "COMMENT_LIKED";
    NotificationType["COMMENT_REPLIED"] = "COMMENT_REPLIED";
    // Votes
    NotificationType["VOTE"] = "VOTE";
    NotificationType["VOTE_ADDED"] = "VOTE_ADDED";
    NotificationType["VOTE_UPDATED"] = "VOTE_UPDATED";
    NotificationType["VOTE_REMOVED"] = "VOTE_REMOVED";
    NotificationType["VOTE_DELETED"] = "VOTE_DELETED";
    // Hébergement
    NotificationType["ACCOMMODATION_SELECTED"] = "ACCOMMODATION_SELECTED";
    NotificationType["ACCOMMODATION_UNSELECTED"] = "ACCOMMODATION_UNSELECTED";
    NotificationType["ACCOMMODATION_CREATED"] = "ACCOMMODATION_CREATED";
    NotificationType["ACCOMMODATION_VOTE"] = "ACCOMMODATION_VOTE";
    NotificationType["ACCOMMODATION_VOTE_DELETED"] = "ACCOMMODATION_VOTE_DELETED";
    // Transport
    NotificationType["TRANSPORT_SELECTED"] = "TRANSPORT_SELECTED";
    NotificationType["TRANSPORT_UNSELECTED"] = "TRANSPORT_UNSELECTED";
    // Dates
    NotificationType["DATE_SELECTED"] = "DATE_SELECTED";
    NotificationType["DATE_UNSELECTED"] = "DATE_UNSELECTED";
    NotificationType["DATE_VOTE"] = "DATE_VOTE";
    // Destinations
    NotificationType["DESTINATION_SELECTED"] = "DESTINATION_SELECTED";
    NotificationType["DESTINATION_UNSELECTED"] = "DESTINATION_UNSELECTED";
    NotificationType["DESTINATION_VOTE"] = "DESTINATION_VOTE";
    // Planning
    NotificationType["PLANNING_ACTIVITY_ADDED"] = "PLANNING_ACTIVITY_ADDED";
    NotificationType["PLANNING_ACTIVITY_UPDATED"] = "PLANNING_ACTIVITY_UPDATED";
    NotificationType["PLANNING_ACTIVITY_REMOVED"] = "PLANNING_ACTIVITY_REMOVED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
