const dataAdapterClient = require('../clients/dataAdapter.clients');
const passwordUtils = require('../utils/password');

async function register({ email, name, surname, password, location }) {
    console.log(`[Registration Service] Hashing password for: ${email}`);
    const passwordHash = await passwordUtils.hash(password);

    try {
        console.log(`[Registration Service] Forwarding to Internal Data Adapter for: ${email} at ${location}`);
        await dataAdapterClient.createUser({ email, name, surname, passwordHash, location });
        console.log(`[Registration Service] User created in database: ${email}`);
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
