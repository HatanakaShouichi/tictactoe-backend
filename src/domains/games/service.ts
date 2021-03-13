"use strict";

import {
    GetGameInput, 
    UpdateGameInput,
    CreateGameInput,
    GameResponse,
    ListGameInput,
    GameListResponse
} from "./type";
import { v4 as uuidv4 } from 'uuid';
import { GameEntity, gameModel } from "../../models/aurora/gameModel";
import { GameDetailEntity, gameDetailModel } from "../../models/dynamo/gameDetail";




/**
 * Game Service
 */
export class GameService {

    /**
     * list Game
     */
     static async listGame(
        data: ListGameInput
    ): Promise<GameListResponse> {
        const games: GameEntity[] = await gameModel.listGames({
            userId: data.user_id
        })
        const items = await Promise.all(games.map(async(game) => {
            const gameDetail = await gameDetailModel.getGameDetail({
                gameId: game.id
            })
            const histories = gameDetail.histories == null ? null : gameDetail.histories
            const item = {...game, histories: histories}
            return item
        }))

        const winGames = games.filter(game => game.winner_user_id === data.user_id);
        const loseGames = games.filter(game => game.winner_user_id != null && game.winner_user_id !== data.user_id)
        /**
         * 勝利数などをカウント
         */
        const winCount = winGames.length
        const loseCount = loseGames.length
        const ret: GameListResponse = {
            count: items.length,
            win_count: winCount,
            lose_count: loseCount,
            items: items
        }
        return ret
    };
    
    /**
     * create Game
     */
    static async createGame(
        data: CreateGameInput
    ): Promise<GameResponse> {
        // ユニークなidを作成
        const gameId = uuidv4();
        
        /**
         * Userを作成するmodelにデータをわたす
         */
        await gameModel.createGame({
            gameId: gameId,
            firstUserId: data.first_user_id
        })
        await gameDetailModel.createGameDetail({
            gameId: gameId
        })
        const game: GameEntity = await gameModel.getGame({
            gameId: gameId
        })

        // DBにもらった値を形成し直して返却
        const ret: GameResponse= {
            id: game.id,
            first_user_id: game.first_user_id,
            created_at: game.created_at
        }
        return ret
    };

    /**
     * get Game
     */
    static async getGame(
        data: GetGameInput
    ): Promise<GameResponse> {
        const game: GameEntity = await gameModel.getGame({
            gameId: data.id
        })

        const gameDetail: GameDetailEntity = await gameDetailModel.getGameDetail({
            gameId: data.id
        })
        // DBにもらった値を形成し直して返却
        const ret: GameResponse = {
            id: game.id,
            first_user_id: game.first_user_id,
            second_user_id: game.second_user_id,
            winner_user_id: game.winner_user_id,
            histories: gameDetail.histories ?? null,
            created_at: game.created_at
        }
        return ret
    };

    /**
     * update Game
     */
    static async updateGame(
        data: UpdateGameInput
    ): Promise<GameResponse> {
        await gameModel.updateGame({
            gameId: data.id,
            secondUserId: data.second_user_id,
            winnerUserId: data.winner_user_id
        })
        await gameDetailModel.updateGameDetail({
            gameId: data.id,
            histories: data.histories
        })
        // update結果を再取得して返す
        return this.getGame({
            id: data.id
        })
    };
}

