var standards = {
    "cdn": {
        "rootUrl": ""
    },
    "flag": {
        "isMoreSocialInfo": false, // 소셜가입할때 추가정보가 필요할경우.\
        "isResponsive": false
    },
    "file": {
        "enumImageFolders": ["pet", "background"],
        "folderPet": "pet",
        "folderBackground": "background"
    },
    "common": {
        "minLength": 1,
        "maxLength": 150
    },
    "background": {
        "defaultOrderBy": "createdAt",
        "defaultIsUse": true,
        "enumTypes": ["login", "signUp", "pet", "meal", "treatment", "poo", "report", "all"],
        "defaultType": "all",
        "typeAll": "all",
        "typeLogin": "login",
        "typeSignUp": "signUp",
        "typePet": "pet",
        "typeMeal": "meal",
        "typeTreatment": "treatment",
        "typePoo": "poo",
        "typeReport": "report"
    },
    "pet": {
        "enumCatSeries": [
            "네바마스커레이드",
            "노르웨이 숲",
            "데본렉스",
            "라가머핀(밍크랙돌)",
            "라팜",
            "랙돌",
            "러시안 블루",
            "맹크스",
            "먼치킨",
            "메인쿤",
            "발리네즈",
            "뱅갈",
            "버만",
            "버미즈",
            "봄베이",
            "브리티쉬 숏헤어",
            "사바나",
            "샤트룩스",
            "샴",
            "셀커크 렉스",
            "소말리",
            "스노우슈",
            "스코티쉬 폴드",
            "스핑크스",
            "시베리아",
            "싱가퓨라",
            "아메리칸 밥테일",
            "아메리칸 숏헤어",
            "아메리칸 와이어헤어",
            "아메리칸 컬",
            "아비시니안",
            "오리엔탈 롱헤어",
            "오리엔탈 숏헤어",
            "오시캣",
            "유퍼피언 버미즈",
            "이그저틱",
            "이집션마우",
            "자바니즈",
            "제페니즈 밥테일",
            "코니시렉스",
            "코렛",
            "코리안 숏헤어",
            "터키시 반",
            "터키시앙고라 롱헤어",
            "터키시앙고라 숏헤어",
            "통기니즈",
            "페르시안",
            "하바나 브라운",
            "히말라얀",
            "기타묘종",
            "묘종모름"
        ],
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
        "defaultOrderBy": "createdAt",
        "enumTreatmentTypes": ["treatmentTypeVaccination", "treatmentTypeNoVaccination", "treatmentTypeEtc"],
        "defaultTreatmentType": "treatmentTypeEtc",
        "treatmentTypeVaccination": "treatmentTypeVaccination",
        "treatmentTypeNoVaccination": "treatmentTypeNoVaccination",
        "vaccination1": "1차 예방접종",
        "vaccination2": "2차 예방접종",
        "vaccination3": "3차 예방접종",
        "noVaccination": "접종 안함"
    },
    "meal": {
        "enumSearchFields": ["mealName"],
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "charge": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt",
        "enumSearchFields": ["chargeTitle"],
        "defaultCharge": 0
    }
};

if (!this.window && module && module.exports) {
    module.exports = standards;
} else {
    if (!window.meta) window.meta = {};
    window.meta.std = standards;
}