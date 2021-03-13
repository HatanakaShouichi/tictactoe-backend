"use strict";

import {
    CreateUserInput, 
    GetUserInput,
    DeleteUserInput,
    UserResponse
} from "./type";
import { General } from "../../constant/response";
import { UserEntity, userModel } from "../../models/aurora/userModel";




/**
 * User Service
 */
export class UserService {
    
    /**
     * create User
     */
    static async createUser(
        data: CreateUserInput
    ): Promise<UserResponse> {
        /**
         * Userを作成するmodelにデータをわたす
         */
        await userModel.createUser({
            userId: data.id,
            name: data.name,
            pass: data.pass
        })
        const user: UserEntity = await userModel.getUser({
            userId: data.id
        })

        // DBにもらった値を形成し直して返却
        const ret: UserResponse = {
            id: user.id,
            name: user.name
        }
        return ret
    };

    /**
     * get User
     */
    static async getUser(
        data: GetUserInput
    ): Promise<UserResponse> {
        const user: UserEntity = await userModel.getUser({
            userId: data.id
        })
        if (data.pass !== user.pass) return;

        // DBにもらった値を形成し直して返却
        const ret: UserResponse = {
            id: user.id,
            name: user.name
        }
        return ret
    };

    /**
     * deleteUser
     */
    static async deleteUser(
        data: DeleteUserInput
    ): Promise<General> {
        await userModel.deleteUser({
            userId: data.id
        })
        // エラーが出なければ削除できたということを伝える
        return {result: "ok"} as General
    };
}

