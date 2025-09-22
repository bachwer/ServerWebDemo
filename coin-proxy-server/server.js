// coin-proxy-server/server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5050;
app.use(cors());

const API_KEY = "632e5d09-3b73-452c-859b-deb0b003a4dd";

app.get("/crypto", async (req, res) => {
    try {
        // Chỉ gọi listings/latest
        const listRes = await axios.get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            {
                headers: { "X-CMC_PRO_API_KEY": API_KEY },
                params: { start: 1, limit: 200, convert: "USD" },
            }
        );

        const coins = listRes.data.data;

        // Thêm URL logo từ CDN vào mỗi coin
        const coinsWithLogo = coins.map(c => ({
            ...c,
            logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${c.id}.png`,
        }));

        res.json(coinsWithLogo);
    } catch (err) {
        console.error("❌ API error:", err.message);
        res.status(500).json({ error: "Không lấy được dữ liệu" });
    }
});

// ✅ Đặt app.listen ngoài cùng
app.listen(PORT, () => {
    console.log(`✅ Server chạy tại http://localhost:${PORT}/crypto`);
});