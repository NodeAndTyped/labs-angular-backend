import {Env, GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "ts-express-decorators";

import "ts-express-decorators/swagger";
import {Properties} from "ts-json-properties";
import {$log} from "ts-log-debug";
import Path = require("path");

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    env: process.env.NODE_ENV as Env,
    mount: {
        "/api": [`${rootDir}/controllers/**/**.js`]
    },
    componentsScan: [
        `${rootDir}/services/**/**.js`
    ],
    acceptMimes: ["application/json"],
    swagger: {
        path: "/api-docs"
    }
})
export class Server extends ServerLoader {

    constructor() {
        super();
        Properties.initialize(`${rootDir}/../properties.json`);
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void | Promise<any> {

        const cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override");

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    $onServerInitError(error): any {
        $log.error("Server encounter an error =>", error);
    }
}