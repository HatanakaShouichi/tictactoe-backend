"use strict";

import { BaseError } from "./baseError";

/**
 * Warning Error用のエラークラスを定義する
 * status code = 2xx系のエラーハンドリング用
 * 種類が多く複雑になりがちなので、複数エラーもここにまとめる
 */

export class WarningError extends BaseError {
  // エラー名
  public name = "WarningError";
  // status code = 412
  public status = 412;
}
