const axios = require('axios');

async function getLocationWithIP(ip) {
    const url = `https://ipapi.co/${ip}/json/`;
    console.log("getLocationWithIP url->",url);
    try {
        const response = await axios.get(url);
        const data = response.data;
        if (!data.error) {
            return data;
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = getLocationWithIP;
