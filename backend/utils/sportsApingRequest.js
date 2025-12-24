const axios = require("axios");
const https = require("https");

/*
-- Following is the actual function commented out to get the static data as response for testing.
async function sportsApingRequest(appKey, sessionToken, operation, params) {
  const url = 'https://api.betfair.com/exchange/betting/json-rpc/v1'
  const rpcBody = [{
    jsonrpc: '2.0',
    method: `SportsAPING/v1.0/${operation}`,
    params,
    id: 1
  }]

  try {
    const response = await axios.post(url, rpcBody, {
      timeout: 1000,  // 1 second
      headers: {
        'X-Application':    appKey,
        'X-Authentication': sessionToken,
        'Accept':           'application/json',
        'Content-Type':     'application/json'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false  // disable SSL peer/host verification
      })
    })

    const data = response.data
    // if the first result has an error property, return ER101
    if (Array.isArray(data) && data[0].error) {
      return 'ER101'
    }
    return data

  } catch (err) {
    // timeout, network error, or non-2xx status
    // you could inspect err.code === 'ECONNABORTED' for timeout specifically
    return 'ER101'
  }
}*/

async function sportsApingRequest(appKey, sessionToken, operation, params) {
  return [
    {
      jsonrpc: "2.0",
      result: [
        {
          marketId: "1.243124893",
          isMarketDataDelayed: false,
          status: "OPEN",
          betDelay: 0,
          bspReconciled: false,
          complete: true,
          inplay: false,
          country: "GB",
          numberOfWinners: 1,
          numberOfRunners: 2,
          numberOfActiveRunners: 1,
          lastMatchTime: "2025-04-30T19:00:01.525Z",
          totalMatched: 5397.14,
          totalAvailable: 61716.59,
          crossMatching: true,
          runnersVoidable: false,
          version: 6607023481,
          runners: [
            {
              selectionId: 78388566,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 7.2,
              totalMatched: 536.92,
              ex: {
                availableToBack: [
                  { price: 7.2, size: 13.84 },
                  { price: 7, size: 23.42 },
                  { price: 6.8, size: 35.61 },
                ],
                availableToLay: [
                  { price: 1.80, size: 26.41 },
                  { price: 7.8, size: 16.06 },
                  { price: 8, size: 35.92 },
                ],
                tradedVolume: [],
              },
            },
            {
              selectionId: 5119970,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 7.2,
              totalMatched: 899.5,
              ex: {
                availableToBack: [
                  { price: 7.2, size: 3.56 },
                  { price: 7, size: 17.21 },
                  { price: 6.8, size: 28.98 },
                ],
                availableToLay: [
                  { price: 7.4, size: 10.42 },
                  { price: 7.6, size: 9.64 },
                  { price: 7.8, size: 13.2 },
                ],
                tradedVolume: [],
              },
            },
          ],
        },
      ],
      id: 1,
    },
  ];
}
module.exports = sportsApingRequest;
/*
      result: [
        {
          marketId: "1.243124893",
          isMarketDataDelayed: false,
          status: "OPEN",
          betDelay: 0,
          bspReconciled: false,
          complete: true,
          inplay: false,
          numberOfWinners: 1,
          numberOfRunners: 6,
          numberOfActiveRunners: 6,
          lastMatchTime: "2025-04-30T19:00:01.525Z",
          totalMatched: 5397.14,
          totalAvailable: 61716.59,
          crossMatching: true,
          runnersVoidable: false,
          version: 6607023481,
          runners: [
            {
              selectionId: 78388566,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 7.2,
              totalMatched: 536.92,
              ex: {
                availableToBack: [
                  { price: 7.2, size: 13.84 },
                  { price: 7, size: 23.42 },
                  { price: 6.8, size: 35.61 },
                ],
                availableToLay: [
                  { price: 7.6, size: 26.41 },
                  { price: 7.8, size: 16.06 },
                  { price: 8, size: 35.92 },
                ],
                tradedVolume: [],
              },
            },
            {
              selectionId: 77540932,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 10.5,
              totalMatched: 464.65,
              ex: {
                availableToBack: [
                  { price: 10.5, size: 5.78 },
                  { price: 10, size: 50.25 },
                  { price: 9.8, size: 31.36 },
                ],
                availableToLay: [
                  { price: 11, size: 24.7 },
                  { price: 11.5, size: 13.69 },
                  { price: 12, size: 16.26 },
                ],
                tradedVolume: [],
              },
            },
            {
              selectionId: 75810832,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 3.8,
              totalMatched: 1162.55,
              ex: {
                availableToBack: [
                  { price: 3.8, size: 16 },
                  { price: 3.75, size: 27.1 },
                  { price: 3.7, size: 33.82 },
                ],
                availableToLay: [
                  { price: 3.9, size: 9.86 },
                  { price: 3.95, size: 24.88 },
                  { price: 4, size: 30.68 },
                ],
                tradedVolume: [],
              },
            },
            {
              selectionId: 57746042,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 7.8,
              totalMatched: 917.02,
              ex: {
                availableToBack: [
                  { price: 7.6, size: 20.2 },
                  { price: 7.4, size: 27.54 },
                  { price: 7.2, size: 31.24 },
                ],
                availableToLay: [
                  { price: 8, size: 22.42 },
                  { price: 8.2, size: 26.99 },
                  { price: 8.4, size: 27.48 },
                ],
                tradedVolume: [],
              },
            },
            {
              selectionId: 79619743,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 4.1,
              totalMatched: 1416.47,
              ex: {
                availableToBack: [
                  { price: 4, size: 18.31 },
                  { price: 3.95, size: 40.95 },
                  { price: 3.9, size: 57.26 },
                ],
                availableToLay: [
                  { price: 4.1, size: 31.48 },
                  { price: 4.2, size: 52.56 },
                  { price: 4.3, size: 35.61 },
                ],
                tradedVolume: [],
              },
            },
            {
              selectionId: 5119970,
              handicap: 0,
              status: "ACTIVE",
              lastPriceTraded: 7.2,
              totalMatched: 899.5,
              ex: {
                availableToBack: [
                  { price: 7.2, size: 3.56 },
                  { price: 7, size: 17.21 },
                  { price: 6.8, size: 28.98 },
                ],
                availableToLay: [
                  { price: 7.4, size: 10.42 },
                  { price: 7.6, size: 9.64 },
                  { price: 7.8, size: 13.2 },
                ],
                tradedVolume: [],
              },
            },
          ],
        },
      ],
*/