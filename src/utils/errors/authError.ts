"use strict";

import { BaseError } from "./baseError";

/**
 * Auth Error用のエラークラスを定義する
 * status code = 401系のエラーハンドリング用
 */

export class AuthError extends BaseError {
  // エラー名
  public name = "AuthError";
  // status code = 401
  public status = 401;
}
