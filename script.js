const gasPricesDiv = document.getElementById("gasPrices");
const lastUpdated = document.getElementById("lastUpdated");
const refreshButton = document.getElementById("refresh");

// Replace with your Etherscan API key (get from https://etherscan.io/apis)
const ETHERSCAN_API_KEY = "YOUR_ETHERSCAN_API_KEY";

async function fetchGasPrices() {
    try {
        gasPricesDiv.innerHTML = '<div class="col-span-full text-center"><div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div></div>';

        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
        const data = await response.json();

        if (data.status !== "1") {
            throw new Error(data.message || "Failed to fetch gas prices");
        }

        const gasData = data.result;
        const prices = [
            { type: "Low", gwei: gasData.SafeGasPrice, color: "bg-green-500" },
            { type: "Average", gwei: gasData.ProposeGasPrice, color: "bg-yellow-500" },
            { type: "High", gwei: gasData.FastGasPrice, color: "bg-red-500" }
        ];

        gasPricesDiv.innerHTML = "";
        prices.forEach(price => {
            gasPricesDiv.innerHTML += `
                <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 class="text-lg font-semibold text-white">${price.type}</h2>
                    <p class="text-2xl ${price.color} text-white">${price.gwei} Gwei</p>
                    <p class="text-sm text-gray-400">~$${(price.gwei * 0.000000001 * 21000 * 1800).toFixed(2)} (at $1800/ETH)</p>
                </div>
            `;
        });

        const now = new Date();
        lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
    } catch (error) {
        gasPricesDiv.innerHTML = `<p class="col-span-full text-center text-red-400">Error: ${error.message}</p>`;
        lastUpdated.textContent = "";
    }
}

if (refreshButton) {
    refreshButton.addEventListener("click", fetchGasPrices);
}