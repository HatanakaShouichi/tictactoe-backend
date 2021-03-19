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
    async createGameDetail({gameId, histories}: {
        gameId: string;
        histories: History[];
    }): Promise<void> {
        /**
         * DynamoのGameDetail情報を作成する処理をかく
         */
        await dynamo.put({
            TableName: 'hatanaka-game-details',
            Item: {
                'id': gameId,
                'histories': histories
            }
        }).promise()
        
    }

    /**
     * GameDetail情報を取得する
     */
    async getGameDetail({gameId}: {
        gameId: string;
    }): Promise<GameDetailEntity> {
        /**
         * DynamoのGameDetail情報を取得する処理をかく
         */
        const ret: GameDetailEntity = (await dynamo.get({
            TableName: 'hatanaka-game-details',
            Key:{
                 id: gameId
            }
        }).promise())['Item'] 
        return ret
    }

    /**
     * GameDetail情報を更新する
     */
    async updateGameDetail({gameId, histories}: {
        gameId: string;
        histories: History[];
    }): Promise<void>  {
        console.log(histories)
        /**
         * DynamoのGameDetail情報を更新する処理をかく
         */
         await dynamo.update({
            TableName: 'hatanaka-game-details',
            Key:{
                "id": gameId
            },
            UpdateExpression: "set histories = :histories",
            ExpressionAttributeValues:{
                ":histories": histories
            }
        }).promise()
        return
    }
}
export const gameDetailModel= new GameDetailModel()


