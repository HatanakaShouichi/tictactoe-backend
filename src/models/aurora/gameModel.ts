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
    async listGames(): Promise<GameEntity[]> {
        /**
         * TO DO
         * Gameの一覧を取得する（対戦履歴を取得する）
         * first_user_idもしくは、second_user_idにuser_idが含まれているものだけとる
         */
        const ret: GameEntity[] = await this.list(`
            ここにSQL文を書く
        `)
        return ret
    }

    /**
     * Gameを作成する
     */
    async createGame(): Promise<void> {
        /**
         * TO　DO
         * Gameを作成する
         */
        await this.query(`
            ここにSQL文を書く
        `)
        return
    }
    
    /**
     * Gameの取得
     */
    async getGame(): Promise<GameEntity>{
        /**
         * TO DO
         * Game情報を取得する
         */
        const ret: GameEntity = await this.get(`
            ここにSQLをかく
        `)
        return ret
    }

    /**
     * Game情報の更新
     */
    async updateGame(): Promise<void> {
        /**
         * TO DO
         * Game情報を更新する
         */
        await this.query(`
            ここにSQL文を書く
        `)
        return
    }
}

export const gameModel= new GameModel()