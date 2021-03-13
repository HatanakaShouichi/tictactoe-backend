import * as mysql2 from 'mysql2/promise';
import { ErrorMessage } from '../../constant/errorMessage';
import { WarningError } from '../errors/warningError';

/**
 * Auroraクラス
 * 接続の管理を行う
 */
export class Aurora {
  // コネクション情報を静的メンバ変数として持つ
  private static connection: mysql2.Connection;

  /**
   * コネクションの初期化を行う
   * 各リクエストにつき一回のみ行う
   */ 
  static async connect() {
    // コネクションの作成
    try{
      this.connection = await mysql2.createConnection({
        host: process.env['proxy_endpoint'],
        user: process.env['username'],
        database: process.env.name,
        ssl: 'Amazon RDS',
        password: process.env['password'],
        multipleStatements: true
      });
    } catch {
      throw new WarningError(ErrorMessage.errorFailedAuroraConnection)
    }
  }

  // コネクション情報取得用の関数
  public static getConnection() {
    if(typeof this.connection === "undefined" || this.connection === null) {
      throw new WarningError(ErrorMessage.errorFailedAuroraConnection)
    }
    return this.connection
  }
}


/**
 * Aurora用のmodel
 * -> 各モデルはこれを継承して用いる
 */
export class AuroraModel {
  // トランザクションをはる
  public static async beginTransaction() {
    try {
      await Aurora.getConnection().beginTransaction();
    } catch(e) {
      console.log("Begin Transaction Error: " + e.message);
      throw new WarningError(ErrorMessage.errorAuroraNotStarted);
    }
  }

  // コミット
  public static async commit() {
    try {
      await Aurora.getConnection().commit();
    } catch(e) {
      console.log("Commit Error: " + e.message);
      throw new WarningError(ErrorMessage.errorAuroraNotCommited);
    }
  }

　// ロールバック
  public static async rollback() {
    try {
      await Aurora.getConnection().rollback();
      console.log("Aurora rollbacked successfully");
    } catch(e) {
      console.log("Rollback Error: " + e.message);
      throw new WarningError(ErrorMessage.errorAuroraNotRollbacked);
    }
  }

  // コネクションを終了する用の関数
  public static async endConnection() {
    try {
      await Aurora.getConnection().end();
    } catch(e) {
      console.log("EndConnection Error: " + e.message);
      throw new WarningError(ErrorMessage.errorAuroraNotEnded);
    }
  }

  /**
   * 一覧取得用のクエリ
   * @param sql 
   */
  public async list(sql: string) {
    const ret = JSON.parse(JSON.stringify((await Aurora.getConnection().execute(sql))[0]))
    return ret
  }

  /**
   * 取得用のクエリ
   * @param sql 
   */
  public async get(sql: string) {
    const ret = JSON.parse(JSON.stringify((await Aurora.getConnection().execute(sql))[0]))[0]
    return ret
  }

  /**
   * その他のクエリ
   * @param sql 
   */
  public async query(sql: string) {
    await Aurora.getConnection().query(sql)
  }

  /**
   * 配列からwhere句を作成する
   */
  public generateWhereValues(whereValueArray: string[]) {
    if(whereValueArray.length !== 0) {
      return 'WHERE ' + whereValueArray.join(' AND ')
    } else {
      return ''
    }
  }

  /**
   * 配列からupdate用のvalueを作成する
   */
  public generateUpdateValues(updateValueArray: string[]) {
    return updateValueArray.join(', ')
  }

  /**
   * 配列からinsert用のvalueを作成する
   */
  public generateInsertValues(insertValueArray: string[]) {
    if(insertValueArray.length !== 0) {
      return 'VALUES ' + insertValueArray.join(', ')
    } else {
      return ''
    }
  }
}
