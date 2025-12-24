const dataAdapterClient = require('../clients/dataAdapter.clients');
const passwordUtils = require('../utils/password');

async function register({ email, name, surname, password }) {
    const passwordHash = await passwordUtils.hash(password);

    try {
        await dataAdapterClient.createUser({ email, name, surname, passwordHash });
    } catch (err) {
        if (err.response && err.response.status === 409) {
            throw new Error('USER_EXISTS');
        }
        throw err;
    }
}

module.exports = {
    register
};
