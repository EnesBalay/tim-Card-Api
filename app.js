require("dotenv").config();
require("express-async-errors");

//EXPRESS
const express = require("express");
const app = express();

//rest of the packages
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

//db
const connectDb = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const timCardRouter = require("./routes/timCardRoutes");
const timCardRecordRouter = require("./routes/timCardRecordRoutes");
const timCardPermissionRouter = require("./routes/timCardPermissionRoutes");

//middleware
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(
  cookieParser(process.env.JWT_SECRET, {
    // secure: true, // sadece HTTPS üzerinden iletim yapacak
    sameSite: "none", // "None" olarak ayarlandığında, "secure" özelliğinin de kullanılması gerekir
  })
);
app.use(express.static("./public"));
app.use(fileupload());

app.get("/api", (req, res) => {
  res.send("Home Page");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/timCard", timCardRouter);
app.use("/api/timCardRecord", timCardRecordRouter);
app.use("/api/timPermission", timCardPermissionRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {}
};

start();
