"use strict";

import { AuroraModel } from "../../utils/db/aurora";

/**
 * Game Entity
 */
export interface GameEntity {
  id: string;
  first_user_id: string;
  second_user_id?: string;
  winner_user_id?: string;
  created_at: string;
}

/**
 * Game用のmodel　
 * -> DBとのやり取りはここで行う
 */
export class GameModel extends AuroraModel {

    /**
     * Gameの一覧を取得する
     */
    async listGames({userId}: {
        userId: string
    }): Promise<GameEntity[]> {
        /**
         * Gameの一覧を取得する（対戦履歴を取得する）
         * first_user_idもしくは、second_user_idにuser_idが含まれているものだけとる
         */
        const ret: GameEntity[] = await this.list(`
            SELECT * 
            FROM games 
            WHERE 
                first_user_id="${userId}"
            OR
                second_user_id="${userId}"
            ;
        `)
        return ret
    }

    /**
     * Gameを作成する
     */
    async createGame({gameId, firstUserId}: {
        gameId: string;
        firstUserId: string;
    }): Promise<void> {
        /**
         * Gameを作成する
         */
        await this.query(`
            INSERT INTO games (
                id
            ,   first_user_id
            ,   created_at
            )
            VALUES (
                "${gameId}"
            ,   "${firstUserId}"
            ,   NOW()
            )
        `)
        return
    }
    
    /**
     * Gameの取得
     */
    async getGame({gameId}: {
        gameId: string;
    }): Promise<GameEntity>{
        /**
         * Game情報を取得する
         */
        const ret: GameEntity = await this.get(`
            SELECT * 
            FROM games
            WHERE  
                id = "${gameId}"
        `)
        return ret
    }

    /**
     * Game情報の更新
     */
    async updateGame({gameId, secondUserId, winnerUserId}): Promise<void> {
        /**
         * Game情報を更新する
         */
        // update用のvalue作成
        const updateValueArray = []
        if(secondUserId != null) updateValueArray.push(`second_user_id = "${secondUserId}"`);
        if(winnerUserId != null) updateValueArray.push(`winner_user_id = "${winnerUserId}"`);

        // operationの更新
        await this.query(`
            UPDATE
                games
            SET
                ${this.generateUpdateValues(updateValueArray)}
            WHERE
                id = "${gameId}"
            ;
        `)
        return
    }
}

export const gameModel= new GameModel()