// api/server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors());

// Lấy API key từ biến môi trường
const API_KEY = process.env.CMC_API_KEY;

app.get("/crypto", async (req, res) => {
    try {
        const listRes = await axios.get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            {
                headers: { "X-CMC_PRO_API_KEY": API_KEY },
                params: { start: 1, limit: 200, convert: "USD" },
            }
        );

        const coins = listRes.data.data;

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

app.listen(PORT, () => {
    console.log(`✅ Server chạy tại http://localhost:${PORT}/crypto`);
});
