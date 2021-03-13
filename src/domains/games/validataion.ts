"use strict";

import { APIGatewayEvent } from "aws-lambda";
import { apigateway } from "../../utils/decorator/requestDecorator";
import { RequestUtils } from "../../utils/request/requestUtils";
import { GameService } from "./service";
import { CreateGameInput, GetGameInput, UpdateGameInput, GameResponse, GameListResponse, ListGameInput } from "./type";

/**
 * GameInterface
 */
export class GameInterface{
    /**
     * Gameの一覧取得
     */
     @apigateway()
     static async listGame(event: APIGatewayEvent): Promise<GameListResponse> {
         // パスパラメータの取得
        const userId: string = RequestUtils.getQueryParameter(
            event.queryStringParameters,
            "user_id"
        )
 
         const data: ListGameInput = {
             user_id: userId
         }
         const ret = await GameService.listGame(data)
         return ret
     }

    /**
     * Gameの作成
     */
    @apigateway()
    static async createGame(event: APIGatewayEvent): Promise<GameResponse> {
        // ボディの取得 
        const body: CreateGameInput= RequestUtils.getBodyRequest(event.body)

        const data = {...body}
        const ret = await GameService.createGame(data)
        return ret
    }

    /**
     * Gameの取得
     */
    @apigateway()
    static async　getGame(event: APIGatewayEvent): Promise<GameResponse> {
        // パスパラメータの取得
        const gameId: string = RequestUtils.getPathParameter(
            event.pathParameters,
            "game_id"
        )
        const data: GetGameInput = {
            id: gameId
        }
        const ret = await GameService.getGame(data)
        return ret
    }

    /**
     * migration
     */
    @apigateway()
    static async updateGame(event) {
        // ボディの取得 
        const body: UpdateGameInput= RequestUtils.getBodyRequest(event.body)
        const data = {...body}
        const ret = await GameService.updateGame(data)
        return ret
    }
}