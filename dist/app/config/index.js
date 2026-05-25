import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
import dotenv from 'dotenv';
const path = __require("path");
dotenv.config({ path: path.join(process.cwd()) + ".env" });
export default {
    port: process.env.PORT,
};
//# sourceMappingURL=index.js.map