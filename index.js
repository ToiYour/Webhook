import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware để parse JSON body
app.use(bodyParser.json());

// Access Token từ Web2M (lưu trong file .env)
const ACCESS_TOKEN = process.env.WEB2M_ACCESS_TOKEN;

app.post("/webhook", (req, res) => {
  const startTime = Date.now();
  console.log(">>>>>Data", req.body);

  // Lấy Bearer token từ header Authorization
  const authHeader = req.headers["authorization"];
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (!bearerToken) {
    return res
      .status(401)
      .json({ error: "Access Token không được cung cấp hoặc không hợp lệ." });
  }

  // Kiểm tra xem bearerToken có khớp với accessToken
  if (ACCESS_TOKEN === bearerToken) {
    // Dữ liệu hợp lệ, tiếp tục xử lý
    const data = req.body;

    // Xử lý dữ liệu tại đây
    console.log("Received webhook data:", data);

    // Thực hiện các thao tác xử lý dữ liệu cần thiết
    // ...

    // Kiểm tra thời gian xử lý
    const processingTime = Date.now() - startTime;
    if (processingTime > 4500) {
      // Để lại 500ms cho network latency
      console.warn("Xử lý webhook gần vượt quá thời gian giới hạn");
    }

    res.status(200).json({
      status: true,
      msg: "OK",
    });
  } else {
    // Chữ ký không khớp, từ chối yêu cầu
    res.status(401).json({ error: "Chữ ký không hợp lệ." });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
