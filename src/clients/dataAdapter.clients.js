const axios = require('axios');
const config = require('../config/config');

async function createUser(user) {
    return axios.post(`${config.DATA_ADAPTER_URL}/users`, user);
}

module.exports = {
    createUser
};
