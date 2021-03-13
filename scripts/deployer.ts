"use strict";

import * as execa from "execa";
import * as fs from "fs-extra";

/**
 * serverless.ymlを指定のStackのものに入れ替える
 * @param stack
 */
const replaceServerlessYaml = (stack: string): void => {
    console.log(`./serverless_yaml/serverless-${stack}.yml`);
    fs.copyFileSync(
        `./serverless_yaml/serverless-${stack}.yml`,
        "./serverless.yml"
    );
}

/**
 * アプリケーションのデプロイを実行する
 */
(async (): Promise<void> => {
    // 環境の選択
    const env = "dev"

    // スタックの選択
    const stack = "lambda"

    // デプロイを実行する
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    console.log(`======================= [ENV: ${env}] ${stack}Stack =======================`);

    // デプロイ処理
    replaceServerlessYaml(stack);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await execa("serverless", ["deploy", "-v", "--stage", env], {
        stdio: "inherit"
    });
})();
