export function nation(nation: string): string {
    switch (nation) {
        case "USA": return ":flag_us: 美國";
        case "Germany": return ":flag_de: 德國";
        case "USSR": return ":flag_ru: 蘇聯";
        case "Britain": return ":flag_gb: 英國";
        case "Japan": return ":flag_jp: 日本";
        case "China": return ":flag_tw: 中國";
        case "Italy": return ":flag_it: 義大利";
        case "France": return ":flag_fr: 法國";
        case "Sweden": return ":flag_se: 瑞典";
        case "Israel": return ":flag_il: 以色列";
        default: return nation
    }
}

export function classes(vehicle_classes: string[]): string[] {
    return vehicle_classes.map(vehicle_class => {
        switch (vehicle_class) {
            case "PREMIUM": return "加值載具";
            // aircraft classes
            case "Fighter": return "戰鬥機";
            case "Interceptor": return "攔截機";
            case "Air Defence fighter": return "防空戰鬥機";
            case "Jet fighter": return "噴射戰鬥機";
            case "Bomber": return "轟炸機";
            case "Light bomber": return "輕型轟炸機";
            case "Dive bomber": return "俯衝轟炸機";
            case "Heavy bomber": return "重型轟炸機";
            case "Long Range bomber": return "遠程轟炸機";
            case "Frontline bomber": return "前線轟炸機";
            case "Jet bomber": return "噴射轟炸機";
            case "Strike aircraft": return "打擊機";
            case "Naval aircraft": return "艦載機";
            case "Torpedo bomber": return "魚雷轟炸機";
            case "Hydroplane": return "水上飛機";

            // ground vehicle classes
            case "Light tank": return "輕型坦克";
            case "Medium tank": return "中型坦克";
            case "Heavy tank": return "重型坦克";
            case "Tank destroyer": return "坦克殲擊車";
            case "SPAA": return "自行防空炮";
            case "ATGM vehicle": return "反坦克導彈裝甲車";

            // ship classes
            case "Boat": return "小艇";
            case "Gunboat": return "炮艇";
            case "Heavy boat": return "重型小艇";
            case "Armored gun boat": return "裝甲炮艇";
            case "Motor torpedo boat": return "機動魚雷艇";
            case "Motor gun boat": return "機動炮艇";
            case "Motor torpedo gun boat": return "機動魚雷炮艇";
            case "Barge": return "駁船";
            case "Naval ferry barge": return "武裝駁船";
            case "Anti-air ferry": return "防空渡輪";
            case "Sub-chaser": return "獵潛艦";
            case "Frigate": return "護衛艦";
            case "Destroyer": return "驅逐艦";
            case "Light cruiser": return "輕巡洋艦";
            case "Heavy cruiser": return "重巡洋艦";
            case "Battlecruiser": return "戰列巡洋艦";
            case "Battleship": return "戰列艦";

            // helicopter classes
            case "Utility helicopter": return "通用直升機";
            case "Attack helicopter": return "攻擊直升機";
            default: return vehicle_class;
        }
    })
}

export function rank(rank: string): string {
    switch (rank) {
        case "I": return ":one: I";
        case "II": return ":two: II";
        case "III": return ":three: III";
        case "IV": return ":four: IV";
        case "V": return ":five: V";
        case "VI": return ":six: VI";
        case "VII": return ":seven: VII";
        case "VIII": return ":eight: VIII";
        default: return rank;
    }
}

