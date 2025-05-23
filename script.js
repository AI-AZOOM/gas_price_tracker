const gasPricesDiv = document.getElementById("gasPrices");
const lastUpdated = document.getElementById("lastUpdated");
const errorMessage = document.getElementById("errorMessage");
const refreshButton = document.getElementById("refresh");

// Use environment variable for API key (set in Vercel dashboard)
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "TM3VQG3CMJHBDUMC4I2DK4QCY2N24DG8VH";

async function fetchEthPrice() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        return data.ethereum.usd;
    } catch (error) {
        console.error("Error fetching ETH price:", error);
        return 1800; // Fallback
    }
}

async function fetchGasPrices() {
    try {
        gasPricesDiv.innerHTML = '<div class="loading">Loading gas prices...</div>';
        errorMessage.classList.add("hidden");

        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();

        if (data.status !== "1") {
            throw new Error(data.message || "Failed to fetch gas prices. Check your API key or network.");
        }

        const ethPrice = await fetchEthPrice();
        const gasData = data.result;
        const prices = [
            { type: "Low (Safe)", gwei: gasData.SafeGasPrice, color: "green", description: "Slower, cheaper transactions" },
            { type: "Average (Proposed)", gwei: gasData.ProposeGasPrice, color: "yellow", description: "Balanced speed and cost" },
            { type: "High (Fast)", gwei: gasData.FastGasPrice, color: "red", description: "Faster, more expensive transactions" }
        ];

        gasPricesDiv.innerHTML = "";
        prices.forEach(price => {
            gasPricesDiv.innerHTML += `
                <div>
                    <h2>${price.type}</h2>
                    <p class="${price.color}">${price.gwei} Gwei</p>
                    <p>~$${(price.gwei * 0.000000001 * 21000 * ethPrice).toFixed(2)} (at $${ethPrice}/ETH)</p>
                    <p>${price.description}</p>
                </div>
            `;
        });

        const now = new Date();
        lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
    } catch (error) {
        gasPricesDiv.innerHTML = "";
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.remove("hidden");
        lastUpdated.textContent = "";
        console.error("Fetch error:", error);
    }
}

if (refreshButton) {
    refreshButton.addEventListener("click", fetchGasPrices);
}