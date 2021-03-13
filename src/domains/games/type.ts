"use strict";

export type SquareValue = "X" | "O" | null;

export interface History {
  squares: SquareValue[];
  location: {
    col: number;
    row: number;
  };
}


/**
 * Clinic Request
 */
export interface ListGameInput {
    user_id: string;
}
export interface CreateGameInput {
    first_user_id: string;
}

export interface GetGameInput {
    id: string;
}

export interface UpdateGameInput {
    id: string;
    second_user_id?: string;
    winner_user_id?: string;
    histories: string;
    created_at: string;
}

/**
 * Clinic Response
 */
export interface GameListResponse {
    count: number;
    win_count: number;
    lose_count: number;
    items: GameResponse[];
 }
export interface GameResponse {
    id: string;
    first_user_id: string;
    second_user_id?: string;
    winner_user_id?: string;
    histories?: History[];
    created_at: string;
 }

  