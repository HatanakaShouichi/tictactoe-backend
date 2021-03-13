"use strict";

import { AuroraModel } from "../../utils/db/aurora";

/**
 * User Entity
 */
export interface UserEntity {
    id: string;
    name: string;
    pass: string;
    deleted: number;
}

/**
 * User用のmodel
 * -> DBとのやり取りはここで行う
 */
export class UserModel extends AuroraModel {
    /**
     * Userを作成する
     */
    async createUser(): Promise<void> {
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
     * Userの取得
     */
    async getUser(): Promise<UserEntity>{
        /**
         * TO DO
         * User情報を取得する
         */
        const ret: UserEntity = await this.get(`
            ここにSQLをかく
        `)
        return ret
    }

    /**
     * User情報の削除(論理削除)
     */
     async deleteUser(): Promise<void> {
        /**
         * TO DO
         * User情報を削除する
         */
        await this.query(`
            ここにSQL文を書く
            DELETEは使わずに、deletedに1を入れることで、削除されたこととみなす
        `)
    }
}

export const userModel= new UserModel()