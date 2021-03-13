"use strict";

import { APIGatewayEvent } from "aws-lambda";
import { General } from "../constant/response";
import { GameListResponse, GameResponse } from "./games/type";
import { GameInterface } from "./games/validataion";
import { UserResponse } from "./users/type";
import { UserInterface } from "./users/validation";

/**
 * @post /users
 */
 const createUser = async (event: APIGatewayEvent): Promise<UserResponse> => {
    return await UserInterface.createUser(event);
};

/**
 * @get /users/{user_id}
 */
const getUser = async (event: APIGatewayEvent): Promise<UserResponse> => {
    return await UserInterface.getUser(event);
};

/**
 * @delete /users/{user_id}
 */
 const deleteUser = async (event: APIGatewayEvent): Promise<General> => {
    return await UserInterface.deleteUser(event);
};

/**
 * @get /games
 */
 const listGame= async (event: APIGatewayEvent): Promise<GameListResponse> => {
    return await GameInterface.listGame(event);
};

/**
 * @post /games
 */
const createGame= async (event: APIGatewayEvent): Promise<GameResponse> => {
    return await GameInterface.createGame(event);
};

/**
 * @get /games/{game_id}
 */
 const getGame = async (event: APIGatewayEvent): Promise<GameResponse> => {
    return await GameInterface.getGame(event);
};

/**
 * @put /games/{game_id}
 */
 const updateGame = async (event: APIGatewayEvent): Promise<GameResponse> => {
    return await GameInterface.updateGame(event);
};

export { 
    createUser, 
    getUser, 
    deleteUser, 
    listGame,
    createGame,
    getGame,
    updateGame
};
