import app from "./app.js";
import config from "./app/config/index.js";
const port = config.port || 3000;
try {
    app.listen(port, () => {
        console.log(`⭐⭐  Example app listening on port ${port} ⭐⭐`);
    });
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=server.js.map