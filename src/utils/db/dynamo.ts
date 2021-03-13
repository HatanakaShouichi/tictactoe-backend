"use strict";

import { PromiseResult } from "aws-sdk/lib/request";
import { DocumentClient, Key, Integer, ConsumedCapacity } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk";
import { WarningError } from "../errors/warningError";
import { ErrorMessage } from "../../constant/errorMessage";

"use strict";

/**
 * User.user_typeの種類を定義する
 */

// eslint-disable-next-line no-restricted-syntax
export enum DynamoDBOperator {
    EQUAL, // =
    NOT_EQUAL, // !=
    LESS, // <
    EQUAL_LESS, // <=
    GREATER, // >
    EQUAL_GREATER, // >=
    BEGIN, // beginWith
    BETWEEN, // between
    CONTAIN, // contains
    NOT_CONTAIN, // !contains()
    EXIST, // exist -> keyのみの指定値の指定は必要ない
    NOT_EXIST // !exist -> keyのみの指定値の指定は必要ない
}

// eslint-disable-next-line no-restricted-syntax
export enum DynamoComparisonOperator {
    EQ = "EQ",
    NE = "NE",
    IN = "IN",
    LE = "LE",
    LT = "LT",
    GE = "GE",
    GT = "GT",
    BETWEEN = "BETWEEN",
    NOT_NULL = "NOT_NULL",
    NULL = "NULL",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    BEGINS_WITH = "BEGINS_WITH"
}

// eslint-disable-next-line no-restricted-syntax
export enum DynamoDBQuerySelect {
    ALL_ATTRIBUTES = "ALL_ATTRIBUTES",
    ALL_PROJECTED_ATTRIBUTES = "ALL_PROJECTED_ATTRIBUTES",
    SPECIFIC_ATTRIBUTES = "SPECIFIC_ATTRIBUTES",
    COUNT = "COUNT"
}


// DynamoDBに挿入できるプリミティブクラス
type dynamoColumnTypePrimitive = string | number | boolean | Date;

// DynamoDBに挿入できるプリミティブクラス
// ※ nullを含んでいる
type dynamoColumnTypePrimitiveContainNull = dynamoColumnTypePrimitive | null;

// DynamoDB Indexで利用可能な型
export type dynamoIndexType = dynamoColumnTypePrimitive;

// DynamoDB全体で利用可能な型
export type dynamoColumnType =
    | dynamoColumnTypePrimitiveContainNull
    | dynamoColumnTypePrimitiveContainNull[]
    | { [key: string]: dynamoColumnTypePrimitiveContainNull };

/**
 * Index Keyに指定する構造体
 */
export interface DynamoIndexKey {
    key: string;
    value: dynamoIndexType;
    value2?: dynamoIndexType; // betweenの時だけ使用する
}

/**
 * DynamoDBの検索で使用するfilter型
 */
interface DynamoFilter {
    ComparisonOperator: DynamoComparisonOperator;
    AttributeValueList: dynamoColumnType[];
}

/**
 * Query用のoption型
 */
export interface DynamoDBQueryOption {
    AttributesToGet?: string[];
    ConditionalOperator?: "AND" | "OR";
    ConsistentRead?: boolean;
    ExclusiveStartKey?: { [key: string]: dynamoColumnType };
    FilterExpression?: string;
    KeyConditions?: { [key: string]: DynamoFilter };
    Limit?: number;
    ProjectionExpression?: string;
    QueryFilter?: { [key: string]: DynamoFilter };
    ReturnConsumedCapacity?: "INDEXES" | "TOTAL" | "NONE";
    ScanIndexForward?: boolean;
    Select?: DynamoDBQuerySelect;
}

/**
 * Scan用のoption型
 */
export interface DynamoDBScanOption {
    AttributesToGet?: string[];
    ConditionalOperator?: "AND" | "OR";
    ConsistentRead?: boolean;
    ExclusiveStartKey?: { [key: string]: dynamoColumnType };
    ExpressionAttributeNames?: { [key: string]: string };
    ExpressionAttributeValues?: { [key: string]: dynamoColumnType };
    FilterExpression?: string;
    IndexName?: string;
    Limit?: number;
    ProjectionExpression?: string;
    ReturnConsumedCapacity?: "INDEXES" | "TOTAL" | "NONE";
    ScanFilter?: { [key: string]: DynamoFilter };
    Segment?: number;
    Select?: DynamoDBQuerySelect;
    TotalSegments?: number;
}

/**
 * DynamoDB GetItemの返り値
 */
export interface DynamoDBGetOutput<T> extends DocumentClient.GetItemOutput {
    Item?: T;
    ConsumedCapacity?: ConsumedCapacity;
}

/**
 * DynamoDB Query/Scanの返り値
 */
export interface DynamoDBQueryOutput<T> extends DocumentClient.QueryOutput {
    Items: T[];
    Count?: Integer;
    ScannedCount?: Integer;
    LastEvaluatedKey?: Key;
    ConsumedCapacity?: ConsumedCapacity;
}
/**
 * Dynamoクラス
 * 接続の管理を行う
 */
export class Dynamo {
  // コネクション情報を静的メンバ変数として持つ
  private static connection: DocumentClient

  /**
   * コネクションの初期化を行う
   * 各リクエストにつき一回のみ行う
   */ 
  static async connect() {
    // コネクションの作成
    try{
        this.connection = await new DocumentClient({
            apiVersion: "2012-08-10",
            accessKeyId: process.env.aws_access_key,
            secretAccessKey: process.env.aws_secret_key
        });
    } catch(e) {
        throw new WarningError(ErrorMessage.errorFailedDynamoConnection)
    }
  }

  // コネクション情報取得用の関数
  public static getConnection() {
    if(typeof this.connection === "undefined" || this.connection === null) {
        throw new WarningError(ErrorMessage.errorFailedDynamoConnection)
    }
    return this.connection
  }
}


/**
 * DynamoDBへアクセスする関数を実装する
 */
export abstract class DynamoModel<T> {
    // dynamoで必要なもの
    protected client: DocumentClient;
    // メンバ変数は, interfaceで宣言を強制する
    tableName = "";

    /**
     * constructorでclientを取得する
     */
    constructor(public prefix: string | undefined = undefined) {
    }

    /**
     * テーブル名を取得する
     *
     */
    getTableName(): string {
        if (this.tableName === "" || this.tableName === undefined) {
            throw new Error("Model classにテーブルファイルを定義してください");
        }
        const dynamoPrefix = this.prefix === undefined ? process.env["dynamo_prefix"] : this.prefix;
        return `${dynamoPrefix}-${this.tableName}-${process.env["env"]}`;
    }

    /**
     * Operation GetItem
     * @param key
     */
    async getItem(key: { [key: string]: dynamoIndexType }): Promise<DynamoDBGetOutput<T>> {
        const params: DocumentClient.GetItemInput = {
            TableName: this.getTableName(),
            Key: key
        };
        return Dynamo.getConnection()
            .get(params)
            .promise()
            .then(data => {
                const result: DynamoDBGetOutput<T> = {
                    Item: data.Item as T,
                    ConsumedCapacity: data.ConsumedCapacity
                };
                return result;
            });
    }

    /**
     * Operation query with hashkey and rangekey and Operator
     * @param key
     * @param option
     * @param indexName
     */
    async query(
        hashKey: DynamoIndexKey,
        rangeKey: DynamoIndexKey | undefined = undefined,
        operator: DynamoDBOperator = DynamoDBOperator.EQUAL,
        indexName: string | undefined = undefined,
        option: DynamoDBQueryOption = {}
    ): Promise<DynamoDBQueryOutput<T>> {
        // その他optionが定義された時の為にここで定義する
        const params: DocumentClient.QueryInput = option as DocumentClient.QueryInput;
        params.TableName = this.getTableName();
        params.KeyConditionExpression = "#hkey = :hkey";
        params.ExpressionAttributeNames = {
            "#hkey": hashKey.key
        };
        params.ExpressionAttributeValues = {
            ":hkey": hashKey.value
        };
        if (rangeKey !== undefined) {
            // range keyの条件を指定する
            let rangeKeyExpression: string;
            if (operator === DynamoDBOperator.EQUAL) {
                rangeKeyExpression = "#rkey = :rkey";
            } else if (operator === DynamoDBOperator.BEGIN) {
                rangeKeyExpression = "begins_with(#rkey, :rkey)";
            } else if (operator === DynamoDBOperator.LESS) {
                rangeKeyExpression = "#rkey < :rkey";
            } else if (operator === DynamoDBOperator.GREATER) {
                rangeKeyExpression = "#rkey > :rkey";
            } else if (operator === DynamoDBOperator.BETWEEN) {
                rangeKeyExpression = "#rkey between :rkey and :rkeyend";
            } else {
                // TODO: 他のオペレーターは後ほど実装する
                throw new Error("実装してください。");
            }
            // 条件にセットする
            params.KeyConditionExpression += ` and ${rangeKeyExpression}`;
            params.ExpressionAttributeNames["#rkey"] = rangeKey.key;
            if (rangeKey.value !== undefined) {
                params.ExpressionAttributeValues[":rkey"] = rangeKey.value;
                if (operator === DynamoDBOperator.BETWEEN) {
                    params.ExpressionAttributeValues[":rkeyend"] = rangeKey.value2;
                }
            }
        }
        // secondary indexを使用する時はここで指定する
        if (indexName !== undefined) {
            params.IndexName = indexName;
        }
        return Dynamo.getConnection()
            .query(params)
            .promise()
            .then(data => {
                const result: DynamoDBQueryOutput<T> = {
                    Items: (data.Items === undefined ? [] : data.Items) as T[],
                    Count: data.Count,
                    ScannedCount: data.ScannedCount,
                    LastEvaluatedKey: data.LastEvaluatedKey,
                    ConsumedCapacity: data.ConsumedCapacity
                };
                return result;
            });
    }

    /**
     * Operation Scan
     */
    async scan(option: DynamoDBScanOption = {}): Promise<DynamoDBQueryOutput<T>> {
        const params: DocumentClient.ScanInput = option as DocumentClient.ScanInput;
        params.TableName = this.getTableName();
        return Dynamo.getConnection()
            .scan(params)
            .promise()
            .then(data => {
                const result: DynamoDBQueryOutput<T> = {
                    Items: (data.Items === undefined ? [] : data.Items) as T[],
                    Count: data.Count,
                    ScannedCount: data.ScannedCount,
                    LastEvaluatedKey: data.LastEvaluatedKey,
                    ConsumedCapacity: data.ConsumedCapacity
                };
                return result;
            });
    }

    /**
     * Operation PutItem
     * @param item
     */
    async putItem(item: T): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
        const params: DocumentClient.PutItemInput = {
            TableName: this.getTableName(),
            Item: item
        };
        return Dynamo.getConnection().put(params).promise();
    }

    /**
     * Operation UpdateItem
     * @param keys
     *  以下の形式でHashKey, RangeKeyからレコードを一意に指定してください
     * {
     *  'key1': Record1, // HashKey
     *  'key2': Record2, // RangeKey
     * }
     * @param attr
     *  以下の形式で更新するレコードの値を指定してください
     * {
     *  'key1': value1
     * }
     */
    async updateItem(
        hashKey: DynamoIndexKey,
        rangeKey: DynamoIndexKey | undefined = undefined,
        attr: {
            [key: string]: {
                Value?: dynamoColumnType;
                Action: "PUT" | "DELETE" | "ADD";
            };
        }
    ): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
        // keys
        const keys: { [key: string]: dynamoIndexType } = {};
        if (hashKey.value === undefined) {
            throw new Error("invalid hashkey");
        }
        keys[hashKey.key] = hashKey.value;
        if (rangeKey !== undefined) {
            if (rangeKey.value === undefined) {
                throw new Error("invalid rangekey");
            }
            keys[rangeKey.key] = rangeKey.value;
        }

        // set update params
        const params: DocumentClient.UpdateItemInput = {
            TableName: this.getTableName(),
            Key: keys,
            AttributeUpdates: attr
        };
        return Dynamo.getConnection().update(params).promise();
    }

    /**
     * Operation DeleteItem
     * @param keys
     *  以下の形式でHashKey, RangeKeyからレコードを一意に指定してください
     * {
     *  'key1': Record1, // HashKey
     *  'key2': Record2, // RangeKey
     * }
     */
    async deleteItem(
        hashKey: DynamoIndexKey,
        rangeKey: DynamoIndexKey | undefined = undefined
    ): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
        // keys
        const keys: { [key: string]: dynamoIndexType } = {};
        if (hashKey.value === undefined) {
            throw new Error("invalid hashkey");
        }
        keys[hashKey.key] = hashKey.value;
        if (rangeKey !== undefined) {
            if (rangeKey.value === undefined) {
                throw new Error("invalid rangekey");
            }
            keys[rangeKey.key] = rangeKey.value;
        }
        const params: DocumentClient.DeleteItemInput = {
            TableName: this.getTableName(),
            Key: keys
        };
        return Dynamo.getConnection().delete(params).promise();
    }
}
