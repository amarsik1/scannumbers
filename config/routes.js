const address = require('../app/controllers/address');
const auth = require('../app/controllers/auth');
const authMiddleware = require('../middleware/auth');

module.exports = (app) => {
    // address
    app.get('/address', authMiddleware, address.getAll);
    app.get('/address/:id', authMiddleware, address.getOnce);
    app.post('/address', authMiddleware, address.create);
    app.put('/address/:id', authMiddleware, address.update);
    app.delete('/address/:id', authMiddleware, address.deleteOnce);

    //auth
    app.post('/singin', auth.singIn);
    app.post('/test', auth.test);
    app.get('/singin', auth.getAll);
};
