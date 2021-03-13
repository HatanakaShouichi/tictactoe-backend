"use strict";

import { BaseError } from "./baseError";

/**
 * Request Error用のエラークラスを定義する
 * status code = 400系のエラーハンドリング用
 */

export class RequestError extends BaseError {
  // エラー名
  public name = "RequestError";
  // status code = 400
  public status = 400;
}
