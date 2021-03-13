"use strict";

/**
 * Clinic Request
 */
export interface CreateUserInput {
    id: string;
    name: string;
    pass: string;
}

export interface GetUserInput {
    id: string;
}

export interface DeleteUserInput {
    id: string;
}

/**
 * Clinic Response
 */
export interface UserResponse {
    id: string;
    name: string;
 }

  