import "dotenv/config";
import { webSocketServer } from "./websocket-server";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

webSocketServer.listen(port);
