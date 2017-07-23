module.exports = {
    app: {
        port: 3001,
        uploadStore: "local"
    },
    db: {
        mysql: 'mysql://slogup:123123@localhost:3306/moongchi',
        logging: false,
        force: false
    }

};