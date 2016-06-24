var appRootUrl = 'http://localhost:3001';

module.exports = {
    app: {
        secret: '123',
        maxUploadFileSize: 100 * 1024 * 1024,
        maxUploadFileSizeMBVersion: '10mb',
        port: 3001,
        rootUrl: appRootUrl
    },
    db: {
        mongodb: 'mongodb://localhost/slogup',
        redis: 'redis://localhost:6379/slogup',
        mysql: 'mysql://localhost:3306/core',
        logging: false,
        force: false
    },
    facebook: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/facebook/callback'
    },
    twitter: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/twitter/callback'
    },
    google: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/google/callback'
    },
    aws: {
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "ap-northeast-1",
        "bucketName": 'img.test.or.kr'
    },
    sender: {
        apiStoreSMS: {
            senderName: "",
            token: "",
            from: "",
            url: ''
        },
        twillio: {
            "accountSID": "",
            "token": "",
            "from": ""
        },
        apn: {
            key: '',
            cert: '',
            gateway: "gateway.sandbox.push.apple.com",
            pass: "",
            port: 2195,
            cacheLength: 20
        },
        gcm: {
            key: '',
            retry: 20
        },
        email: {
            host: '',
            port: 587,
            from: "",
            user: "",
            pass: "",
            name: ""
        }
    }
};