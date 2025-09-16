import app from "./app.js";
import { config } from "./config/index.js";

const APP_PORT = config.APP_PORT;

app.listen(APP_PORT, () => {
  console.log(`Core Service is running on http://localhost:${APP_PORT}`);
});
