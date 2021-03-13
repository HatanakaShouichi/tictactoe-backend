export interface General {
    result: string
}

export interface ErrorResponseType {
    errorCode: string;
    status: number;
    message: string;
}
/**
 * APIGateway Response
 */
export interface ApigatewayResponse {
    statusCode: number;
    headers: object;
    body: string; // json string
}

export interface ErrorResponse {
    errorCode: string;
    message: string;
}
