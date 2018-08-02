import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as errorHandler from "errorhandler";
import * as express from "express";
import * as logger from "morgan";
import {RouteConfigurator} from "./routes/index";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    public app: express.Application;

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // create expressjs application
        this.app = express();

        // configure application
        this.config();

        // add routes
        this.routes();

        // add api
        this.api();
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        // empty for now
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        // mount logger
        // athis.app.use(logger("dev"));

        // mount json form parser
        this.app.use(bodyParser.json());

        // mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));

        // mount cookie parser middleware
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        // error handling
        this.app.use(errorHandler());
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    public routes() {
        let router: express.Router;
        router = express.Router();

        // RouteConfigurator
        RouteConfigurator.create(router);

        // use router middleware
        this.app.use(router);
    }
}
