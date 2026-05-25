import express from 'express';
const app = express();
import cors from 'cors';
import router from './app/router/index.js';
app.use(express.json());
app.use(cors());
app.use(router);
app.get("/", (req, res) => {
    res.send("Diploma student management project");
});
export default app;
//# sourceMappingURL=app.js.map