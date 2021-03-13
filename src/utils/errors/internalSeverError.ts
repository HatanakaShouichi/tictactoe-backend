"use strict";

import { BaseError } from "./baseError";

/**
 * Auth Error用のエラークラスを定義する
 * status code = 401系のエラーハンドリング用
 */

export class InternalServerError extends BaseError {
  // エラー名
  public name = "InternalServerError";
  // status code = 500
  public status = 500;
}
