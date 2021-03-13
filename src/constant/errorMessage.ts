"use strict";

/**
 * ErrorMessage
 */

export enum ErrorMessage {
    errorUnexpected = "Unexpected error occurred. Please contact Shouichi Hatanaka.",
    errorClinicDoesNotExist = "Clinic not found",
    errorKarteDoesNotExist = "Karte not found",
    errorBaseKarteDoesNotExist = "BaseKarte not found",
    errorBaseShamerDoesNotExist = "BaseShamer not found",
    errorShamerDoesNotExist = "Shamer not found",
    errorMachineDoesNotExist = "Machine not found",
    errorOperationDoesNotExist = "Operation not found",
    errorReservationDoesNotExist = "Reservation not found",
    errorRoomDoesNotExist = "Room not found",
    errorShiftDoesNotExist = "Shift not found",
    errorStaffDoesNotExist = "Staff not found",
    errorVisitorDoesNotExist = "Visitor not found",
    errorFileDoesNotExist = "File not found",
    errorMachineNotAvailable = "Machine is not available for operation",
    errorRoomNotAvailable = "Staff is not available for operation",
    errorStaffNotAvailable = "Room is not available for operation",
    errorNotReservable = "Cannot make reservation. Please change date",
    errorDeleteFailed = "Failed to delete resource. Please try again",
    errorReservationNotDeleted = "Failed to reactivate reservation. Reservation is not deleted",
    errorAuroraNotEnded = "Failed to finish Aurora.",
    errorAuroraNotStarted = "Failed to start Aurora.",
    errorAuroraNotCommited = "Failed to commit Aurora.",
    errorAuroraNotRollbacked = "!!!! Failed to rollback Aurora!! Please contact Shouichi Hatanaka!",
    errorTokenExpired = "Your token is expired",
    errorTokenInvalid = "Your token is invalid",
    errorNotAuthorized = "Logined user is not authorized.",
    errorPaymentDoesNotExist = "Payment not found",
    errorDailyNoteDoesNotExist = "Daily note not found.",
    errorStatusDoesNotExist = "Status not found.",
    errorColorDoesNotExist = "Color not found.",
    errorCannotDeleteVisitor = "Deleting Visitor is not allowed.",
    errorFailedToSendMail= "Failed to send email.",
    /**
     * System Errors
     */
    errorUnauthorized = "Unauthorized. Please review your request.",
    errorPathParamsInvalid = "Path Params are Invalid. Please review your request.",
    errorBodyInvalid = "Body is Invalid. Please review your request.",
    errorOptionalParamsInvalid = "Optional params are invalid. Please review your request.",
    errorRequierdParamsNotFound = "Required params are not found. Please review your request.",
    errorEnumInvalid = "Enum param is invalid. Please review your request.",
    errorTelInvalid = "Not Telephone Number format. Please review your request.",
    errorEmailInvalid = "Not email format. Please review your request.",
    errorNumberInvalid = "Not number format. Please review your request.",
    errorDateInvalid = "Not date format. Please review your request.",
    errorHeadersInvalid = "Request headers are invalid or not set. Please review your request.",
    errorAllRecordsDelete = "All records will be deleted. Please review your request.",
    errorFailedAuroraConnection = "Failed to connect to aurora.",
    errorFailedDynamoConnection = "Failed to connect to dynamo.",
    errorUploadImageFailed = "Failed to upload image.",
    errorGetSingedUrlFailed = "Failed to get signed url.",
    errorNotPermittedIp = "Not allowed ip address."
}