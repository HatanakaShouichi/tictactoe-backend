'use strict';

import { History } from "../../domains/games/type";

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});

export interface GameDetailEntity {
    id: string;
    histories: History[];
}

/**
 * GameDetail用のmodel　
 * -> DBとのやり取りはここで行う
 */
export class GameDetailModel{
    /**
     * GameDetail情報を作成する
     */
    async createGameDetail(): Promise<void> {
        /**
         * TO DO
         * DynamoのGameDetail情報を作成する処理をかく
         */
        await dynamo.put(
            /**
             * ここにdynamoのクエリをかく
             */
        ).promise()
        
    }

    /**
     * GameDetail情報を取得する
     */
    async getGameDetail(): Promise<GameDetailEntity> {
        /**
         * TO DO
         * DynamoのGameDetail情報を取得する処理をかく
         */
        const ret: GameDetailEntity = (await dynamo.get(
            /**
             * ここにdynamoのクエリをかく
             */
        ).promise())['Item'] 
        return ret
    }

    /**
     * GameDetail情報を更新する
     */
    async updateGameDetail(): Promise<void>  {
        /**
         * TO DO
         * DynamoのGameDetail情報を更新する処理をかく
         */
        await dynamo.update(
            /**
             *　ここにDynamoのクエリをかく
             */
        ).promise()
        return
    }
}
export const gameDetailModel= new GameDetailModel()


