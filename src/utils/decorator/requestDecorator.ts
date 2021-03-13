"use strict";

// Error群
import { BaseError } from "../errors/baseError";
// exception
import { InternalServerError } from "../errors/internalSeverError";
import { ErrorMessage } from "../../constant/errorMessage";
import { APIGatewayEvent } from "aws-lambda";
import { ApigatewayResponse, ErrorResponseType } from "../../constant/response";
import { Aurora, AuroraModel } from "../db/aurora";
import { RequestError } from "../errors/requestError";
import { Dynamo } from "../db/dynamo";
const util = require('util');


/**
 * レスポンスの形成
 */
const ResponseJson = (ret: object, status: number): ApigatewayResponse => {
  return {
      statusCode: status,
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,DELETE,PUT,POST,GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Expose-Headers": "Content-Type, Authorization, clinic_id"
      },
      body: JSON.stringify(ret)
  };
};

/**
 * API Gateway用のレスポンスを作成する
 */
export const getApiGatewayResponse = (ret: object): ApigatewayResponse => {
  // エラーなら、エラー用のレスポンスを作成
  if (ret instanceof BaseError) {
      const err: ErrorResponseType = ret.toResponseJson();
      return ResponseJson(
          {
              error: err.errorCode,
              message: err.message
          },
          err.status
      );
  }
  // 正常時のレスポンス
  return ResponseJson(ret, 200);
};

/**
 * API Gatewayを利用するServiceメソッドに付与する
 */
export const apigateway = () => {
  return (
    target: object,
    propKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const original: Function = descriptor.value;
    descriptor.value = async (...args: APIGatewayEvent[]): Promise<object> => {
      let ret;
      // DBに接続
      try {
        try {
          // Dynamoに接続
          await Dynamo.connect()
          await Aurora.connect(process.env.name);
          // トランザクションを貼る
          await AuroraModel.beginTransaction();
          // 処理を行う
          const result = await original.apply(target, args);
          // エラーがでなければ、commit
          await AuroraModel.commit();
          ret = getApiGatewayResponse(result);
        } catch (err) {
          console.log(util.inspect(err, false, null));
          console.log("error is: " + err.message);
          // エラーが起きた場合は、DBへの処理を全てロールバック
          await AuroraModel.rollback();
          if (err instanceof BaseError) {
            // BaseErrorを継承していれば、これらの関数を利用できる
            ret = getApiGatewayResponse(err);
          } else {
            ret = getApiGatewayResponse(new InternalServerError(ErrorMessage.errorUnexpected));
          }
        } finally {
          await AuroraModel.endConnection();
        }
      } catch (err){
        console.log(util.inspect(err, false, null));
        console.log("error is: " + err.message);
        return getApiGatewayResponse(new RequestError(ErrorMessage.errorFailedAuroraConnection));
      }
      return ret
    };
    return descriptor;
  };
};