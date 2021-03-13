"use strict";

// constant
import { ErrorMessage } from "../../constant/errorMessage";
import { ErrorResponse, ErrorResponseType } from "../../constant/response";
// import { postSlack } from "../slack/slack";

// Error
export interface ResponseError {
  errorCode: string;
  message: string;
}

/**
 * ErrorMessage関連のUtilsクラス
 */
export class ErrorMessageUtils {
  /**
   * エラーコードからエラーメッセージを取得する
   * @param errorCode AppSyncの返り値のerrorCode
   */
  static getErrorMessage(errorCode: string): string {
      const errorIndex = Number(errorCode.slice(1));
      return Object.values(ErrorMessage)[errorIndex];
  }

  /**
   * errorKeyからエラーの内容を取得する
   * @param errorKey ErrorKey
   */
  static getErrorObject(errorKey: string): ErrorResponse {
      const errorIndex = Object.keys(ErrorMessage).indexOf(errorKey);
      return {
          errorCode: `E${("000" + errorIndex).slice(-3)}`,
          message: Object.values(ErrorMessage)[errorIndex]
      };
  }

  /**
   * ErrorMessageからerrorCodeを取得する
   * Serverだけが使う
   * @param errorMessage ErrorMessage.value
   */
  static getErrorKey(errorMessage: ErrorMessage): string {
      const errorIndex = Object.values(ErrorMessage).indexOf(errorMessage);
      return Object.keys(ErrorMessage)[errorIndex];
  }
}

/**
 * BaseError
 * -> 各Errorクラスはこれを継承して利用する
 */
export class BaseError implements Error {
  // nameは、ログで使用するので必ず継承したクラスで書き換える
  public name = "BaseError";
  public status = 500;
  // エラーコード: クライアントサイドは、これを見て判断する
  public errorCode: string;
  public errorKey: string;
  public message: string;

  // constructor
  // エラーメッセージを引数にとる
  // publicにするのでsetterは不要
  constructor (eMassage: ErrorMessage) {
    const errorKey = ErrorMessageUtils.getErrorKey(eMassage);
    const errorMessage: ResponseError = ErrorMessageUtils.getErrorObject(
      errorKey
    );
    this.errorCode = errorMessage.errorCode;
    this.message = errorMessage.message;
    // postSlack("エラーが起きています。" + errorMessage.message);
    this.errorKey = (errorKey as unknown) as string;
    // エラーを吐く場合はここで定義
    if (typeof console !== undefined) {
      console.error(
        `name: ${this.name}, error_code: ${this.errorCode}, message: ${this.message}`
      );
    }
  }

  toResponseJson(): ErrorResponseType {
    // toStringを指定されたら、エラーメッセージを返却する
    return {
        errorCode: this.errorCode,
        status: this.status,
        message: this.message
    };
  }
}
