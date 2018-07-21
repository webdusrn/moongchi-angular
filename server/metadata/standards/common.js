var standards = {
    "cdn": {
        "rootUrl": ""
    },
    "flag": {
        "isMoreSocialInfo": false, // 소셜가입할때 추가정보가 필요할경우.\
        "isResponsive": false
    },
    "file": {
        "enumImageFolders": ["pet", "diary", "background"],
        "folderPet": "pet",
        "folderDiary": "diary",
        "folderBackground": "background"
    },
    "common": {
        "minLength": 1,
        "maxLength": 190,
        "maxLongLength": 1000
    },
    "background": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt",
        "defaultIsUse": true,
        "enumTypes": ["login", "signUp", "all"],
        "defaultType": "all",
        "typeAll": "all",
        "typeLogin": "login",
        "typeSignUp": "signUp"
    },
    "pet": {
        "enumSearchFields": ["petName"],
        "enumOrderBys": ["petName", "createdAt", "updatedAt"],
        "defaultOrderBy": "petName",
        "enumDefaultImages": [
            'default-image-1.png',
            'default-image-2.png',
            'default-image-3.png',
            'default-image-4.png',
            'default-image-5.png'
        ],
        "enumPetTypes": ["고양이"],
        "defaultPetType": "고양이",
        "enumPetGenders": ["남자", "여자", "모르겠음"],
        "defaultPetGender": "모르겠음",
        "enumCatSeries": [
            "네바마스커레이드",
            "네벨룽",
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
            "요크 초콜릿",
            "유퍼피언 버미즈",
            "이그저틱",
            "이집션마우",
            "자바니즈",
            "저먼 렉스",
            "제페니즈 밥테일",
            "코니시 렉스",
            "코렛",
            "코리안 숏헤어",
            "킴릭",
            "터키시 반",
            "터키시앙고라 롱헤어",
            "터키시앙고라 숏헤어",
            "톤기니즈",
            "페르시안",
            "픽시 밥",
            "하바나 브라운",
            "히말라얀",
            "기타묘종",
            "묘종모름"
        ]
    },
    "treatmentGroup": {
        "enumOrderBys": ["createdAt", "treatmentAt"],
        "defaultOrderBy": "createdAt",
        "enumSearchFields": ["hospitalName"]
    },
    "treatment": {
        "enumTreatmentTypes": [
            "레볼루션",
            "구충제",
            "피부질환",
            "안구질환",
            "구강질환",
            "소화계질환",
            "1차 예방접종",
            "2차 예방접종",
            "3차 예방접종",
            "중성화수술",
            "기타질환",
        ],
        "defaultTreatmentType": "레볼루션",
        "treatmentTypeVaccination1": "1차 예방접종",
        "treatmentTypeVaccination2": "2차 예방접종",
        "treatmentTypeVaccination3": "3차 예방접종",
        "treatmentTypeNeuter": "중성화수술",
        "petTreatmentTypes": [
            "1차 예방접종",
            "2차 예방접종",
            "3차 예방접종",
            "중성화수술"
        ]
    },
    "petImage": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt"
    },
    "diary": {
        "enumOrderBys": ["createdAt"],
        "defaultOrderBy": "createdAt",
        "enumDiaryTypes": ["일상", "식사거부", "설사", "혈변", "변비", "구토", "기타"],
        "defaultDiaryType": "일상",
        "maxImageCount": 3
    }
};

if (!this.window && module && module.exports) {
    module.exports = standards;
} else {
    if (!window.meta) window.meta = {};
    window.meta.std = standards;
}