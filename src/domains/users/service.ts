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
        await userModel.createUser(
            /** 
             * 引数で渡す
            */
        )
        const user: UserEntity = await userModel.getUser(
            /**
             * 引数で渡す
             */
        )

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
        const user: UserEntity = await userModel.getUser(
            /**
             * 引数で渡す
             */
        )

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
        await userModel.deleteUser(
            /**
             * 引数で渡す
             */
        )
        // エラーが出なければ削除できたということを伝える
        return {result: "ok"} as General
    };
}

