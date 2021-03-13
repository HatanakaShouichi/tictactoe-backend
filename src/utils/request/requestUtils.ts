"use strict";

import { RequestError } from "../errors/requestError";
import { ErrorMessage } from "../../constant/errorMessage";

/**
 * RequestUtil
 */
export class RequestUtils {
  /**
   * bodyが空でないかチェック
   */
  static getBodyRequest = <T>(body: string | null): T => {
    if (body === null || body === "{}") {
      throw new RequestError(ErrorMessage.errorBodyInvalid);
    }
    return JSON.parse(body) as T;
  };

  /**
   * Path Paramsから指定したkeyの存在をチェックして、存在していれば値を取り出す
   */
  static getPathParameter = (
    pathParams: { [key: string]: string } | null,
    key: string
  ): string => {
    if (pathParams === null || !(key in pathParams)) {
      throw new RequestError(ErrorMessage.errorPathParamsInvalid);
    }
    return pathParams[key];
  };

  /**
   * Query Paramsから指定したkeyの存在をチェックして、存在していれば値を取り出す
   */
  static getQueryParameter = (
    queryParams: { [key: string]: string } | null,
    key: string
  ): string | null => {
    if (queryParams === null || !(key in queryParams)) {
      return null;
    }
    return queryParams[key] as string;
  };

  /**
   * Multi Query Paramsから指定したkeyの存在をチェックして、存在していれば値を取り出す
   */
  static getMultiQueryParameters = (
    multiQueryParams: { [key: string]: string[] } | null,
    key: string
  ): string[] | null => {
    if (multiQueryParams === null || !(key in multiQueryParams)) {
      return null;
    }
    return multiQueryParams[key] as string[];
  };
}
