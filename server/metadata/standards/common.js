var standards = {
    "cdn": {
        "rootUrl": ""
    },
    "flag": {
        "isMoreSocialInfo": false, // 소셜가입할때 추가정보가 필요할경우.\
        "isResponsive": false
    },
    "file": {
        "enumImageFolders": ["pet"],
        "folderPet": "pet"
    },
    "common": {
        "minLength": 1,
        "maxLength": 150
    },
    "pet": {
        "enumSearchFields": ["petName"],
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt",
        "enumPetTypes": ["petTypeCat", "petTypeDog", "petTypeEtc"],
        "defaultPetType": "petTypeCat",
        "enumPetGenders": ["petGenderM", "petGenderF"],
        "defaultPetGender": "petGenderM"
    },
    "petImage": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "poo": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt",
        "enumPooTypes": ["pooNormal", "pooSticky", "pooDiarrhea"],
        "defaultPooType": "pooNormal",
        "enumPooColors": ["pooColor1", "pooColor2", "pooColor3"]
    },
    "treatment": {
        "enumSearchFields": ["treatmentTitle", "hospitalName"],
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "meal": {
        "enumSearchFields": ["mealName"],
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "charge": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt",
        "enumSearchFields": ["chargeTitle"]
    }
};

if (!this.window && module && module.exports) {
    module.exports = standards;
} else {
    if (!window.meta) window.meta = {};
    window.meta.std = standards;
}