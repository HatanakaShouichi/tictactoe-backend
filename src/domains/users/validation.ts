"use strict";

import { APIGatewayEvent } from "aws-lambda";
import { apigateway } from "../../utils/decorator/requestDecorator";
import { RequestUtils } from "../../utils/request/requestUtils";
import { UserService } from "./service";
import { CreateUserInput, GetUserInput, DeleteUserInput } from "./type";

/**
 * UserInterface
 */
export class UserInterface{
    /**
     * Userの作成
     */
    @apigateway()
    static async createUser(event: APIGatewayEvent) {
        // ボディの取得 
        const body: CreateUserInput = RequestUtils.getBodyRequest(event.body)

        const data = {...body}
        const ret = await UserService.createUser(data)
        return ret
    }

    /**
     * Userの取得
     */
    @apigateway()
    static async　getUser(event: APIGatewayEvent) {
        // パスパラメータの取得
        const userId: string = RequestUtils.getPathParameter(
            event.pathParameters,
            "user_id"
        )
        const pass: string = RequestUtils.getQueryParameter(
            event.queryStringParameters,
            "pass"
        )
        const data: GetUserInput = {
            id: userId,
            pass: pass
        }
        const ret = await UserService.getUser(data)
        return ret
    }

    /**
     * migration
     */
    @apigateway()
    static async deleteUser(event) {
        // パスパラメータの取得
        const userId: string = RequestUtils.getPathParameter(
            event.pathParameters,
            "user_id"
        )
        const data: DeleteUserInput = {
            id: userId
        }
        const ret = await UserService.deleteUser(data)
        return ret
    }
}