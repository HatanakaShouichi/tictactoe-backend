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
    async createUser({userId, name, pass}): Promise<void> {
        /**
         * Userを作成する
         */
        await this.query(`
            INSERT INTO users (
                id
            ,   name
            ,   pass
            ,   deleted
            )
            VALUES (
                "${userId}"
            ,   "${name}"
            ,   "${pass}"
            ,   0
            )
        `)
        return
    }
    
    /**
     * Userの取得
     */
    async getUser({userId}: {
        userId: string;
    }): Promise<UserEntity>{
        /**
         * User情報を取得する
         */
        const ret: UserEntity = await this.get(`
            SELECT * 
            FROM users
            WHERE 
                id = "${userId}"
            AND
                deleted = 0
        `)
        return ret
    }

    /**
     * User情報の削除(論理削除)
     */
     async deleteUser({userId}: {
         userId: string;
     }): Promise<void> {
        /**
         * User情報を削除する
         */
        await this.query(`
            UPDATE
                users
            SET
                deleted = 1
            WHERE
                id = "${userId}"
            ;
        `)
    }
}

export const userModel= new UserModel()