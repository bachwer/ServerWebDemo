import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors());

// Lấy API key từ biến môi trường
const API_KEY = process.env.CMC_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ CMC_API_KEY chưa được set trong biến môi trường!");
} else {
  console.log("🔑 API_KEY loaded:", API_KEY.slice(0, 6) + "...(hidden)");
}

// ✅ Route test root
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Coin Proxy Server</h1>
    <p>API đang chạy. Thử <a href="/crypto">/crypto</a></p>
  `);
});

// ✅ Route lấy dữ liệu coin
app.get("/crypto", async (req, res) => {
  console.log("📡 GET /crypto request received");
  try {
    const listRes = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: { "X-CMC_PRO_API_KEY": API_KEY },
        params: { start: 1, limit: 200, convert: "USD" },
      }
    );

    console.log("✅ CoinMarketCap API status:", listRes.status);

    const coins = listRes.data.data;

    const coinsWithLogo = coins.map(c => ({
      ...c,
      logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${c.id}.png`,
    }));

    res.json(coinsWithLogo);
  } catch (err) {
    console.error("❌ API error:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
