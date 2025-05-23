const gasPricesDiv = document.getElementById("gasPrices");
const lastUpdated = document.getElementById("lastUpdated");
const errorMessage = document.getElementById("errorMessage");
const refreshButton = document.getElementById("refresh");

// Replace with your Etherscan API key (get from https://etherscan.io/apis)
const ETHERSCAN_API_KEY = "TM3VQG3CMJHBDUMC4I2DK4QCY2N24DG8VH";

async function fetchGasPrices() {
    try {
        gasPricesDiv.innerHTML = '<div class="col-span-full text-center"><div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div></div>';
        errorMessage.classList.add("hidden");

        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
        const data = await response.json();

        if (data.status !== "1") {
            throw new Error(data.message || "Failed to fetch gas prices. Check your API key or network.");
        }

        const gasData = data.result;
        const prices = [
            { type: "Low (Safe)", gwei: gasData.SafeGasPrice, color: "bg-green-500", description: "Slower, cheaper transactions" },
            { type: "Average (Proposed)", gwei: gasData.ProposeGasPrice, color: "bg-yellow-500", description: "Balanced speed and cost" },
            { type: "High (Fast)", gwei: gasData.FastGasPrice, color: "bg-red-500", description: "Faster, more expensive transactions" }
        ];

        gasPricesDiv.innerHTML = "";
        prices.forEach(price => {
            gasPricesDiv.innerHTML += `
                <div class="bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg">
                    <h2 class="text-lg font-semibold text-gray-100">${price.type}</h2>
                    <p class="text-2xl ${price.color} text-gray-100">${price.gwei} Gwei</p>
                    <p class="text-sm text-gray-400">~$${(price.gwei * 0.000000001 * 21000 * 1800).toFixed(2)} (at $1800/ETH)</p>
                    <p class="text-xs text-gray-500 mt-1">${price.description}</p>
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
    }
}

if (refreshButton) {
    refreshButton.addEventListener("click", fetchGasPrices);
}