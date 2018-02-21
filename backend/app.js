const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const minimist = require("minimist");
const path = require("path");
const redis = require("redis");

const args = minimist(process.argv.slice(2));
if (!args.port) {
    args.port = process.env.PORT || 3000;
}

function main(opts) {
    const redisClient = redis.createClient({
        host: opts["redis-host"],
        port: opts["redis-port"] || 6379,
        password: opts["redis-password"],
        socket_keepalive: true,
        retry_strategy: function(opts) {
            console.error("ERR: Lost redis connection! Will reconnect after 5 seconds.");
            console.error(`ERR: Reason: ${opts.error}`);
            return 5000;
        },
    });

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.get("/data", (req, res, next) => {
        redisClient.keys("*", (err, reply) => {
            if (err) {
                next(err);
                return;
            }

            res.status(200).json({
                keys: reply,
            }).end();
        });
    });

    app.get("/data/:key", (req, res, next) => {
        redisClient.get(req.params["key"], (err, reply) => {
            if (err) {
                next(err);
                return;
            }

            if (!reply) {
                res.status(404).end();
                return;
            }

            res.status(200).json(JSON.parse(reply)).end();
        });
    });

    app.put("/data/:key", (req, res, next) => {
        const body = JSON.stringify(req.body);
        redisClient.set(req.params["key"], body, (err, reply) => {
            if (err) {
                next(err);
                return;
            }

            res.status(200).json({
                status: reply,
            }).end();
        });
    });

    app.delete("/data/:key", (req, res, next) => {
        redisClient.del(req.params["key"], (err, reply) => {
            if (err) {
                next(err);
                return;
            }

            res.status(200).json({
                deleted: reply !== 0,
            }).end();
        });
    });

    app.listen(opts.port, () => console.log(`Listening on port ${opts.port}`));
}

main(args);
