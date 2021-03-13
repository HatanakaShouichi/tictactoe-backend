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
        const games = await gameModel.listGames(
            /**
             * 引数で渡す
             * userが含まれているものだけとってくる
             */
        )
        const items = await Promise.all(games.map(async(game) => {
            const gameDetail = await gameDetailModel.getGameDetail(
                /**
                 * 引数で指定
                 */
            )
            const item = {...game, histories: gameDetail.histories}
            return item
        }))

        /**
         * TO DO
         * 勝利数などをカウント
         */
        const winGames = games.filter(game => "ここを埋める")
        const loseGames = games.filter(game => "ここを埋める")
        const ret: GameListResponse = {
            count: items.length,
            win_count: winGames.length,
            lose_count: loseGames.length,
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
        await gameModel.createGame(
            /** 
             * 引数で渡す
            */
        )
        await gameDetailModel.createGameDetail(
            /** 
             * 引数で渡す
            */
        )
        const game: GameEntity = await gameModel.getGame(
            /**
             * 引数で渡す
             */
        )

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
        const game: GameEntity = await gameModel.getGame(
            /**
             * 引数で渡す
             */
        )

        const gameDetail: GameDetailEntity = await gameDetailModel.getGameDetail(
            /**
             * 引数で渡す
             */
        )
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
        await gameModel.updateGame(
            /**
             * 引数で渡す
             */
        )
        await gameDetailModel.updateGameDetail(
            /** 
             * 引数で渡す
            */
        )
        // update結果を再取得して返す
        return this.getGame({
            id: data.id
        })
    };
}

