export interface Province {
  id: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  region: string;
  imageUrl?: string;
}

// Information for all 63 provinces in Vietnam
export const provinces: Province[] = [
  {
    id: "01",
    name: "Hà Nội",
    capital: "Hà Nội",
    population: 8053663,
    area: 3358.9,
    region: "Red River Delta",
    imageUrl: "/images/provinces/hanoi.jpg"
  },
  {
    id: "02",
    name: "Hồ Chí Minh",
    capital: "Hồ Chí Minh",
    population: 8993082,
    area: 2095.5,
    region: "Southeast",
    imageUrl: "/images/provinces/hochiminh.jpg"
  },
  {
    id: "03",
    name: "Hải Phòng",
    capital: "Hải Phòng",
    population: 2029407,
    area: 1561.8,
    region: "Red River Delta",
    
  },
  {
    id: "04",
    name: "Đà Nẵng",
    capital: "Đà Nẵng",
    population: 1134310,
    area: 1285.4,
    region: "South Central Coast"
  },
  {
    id: "05",
    name: "Hà Giang",
    capital: "Hà Giang",
    population: 854679,
    area: 7914.9,
    region: "Northeast"
  },
  {
    id: "06",
    name: "Cao Bằng",
    capital: "Cao Bằng",
    population: 530341,
    area: 6700.3,
    region: "Northeast"
  },
  {
    id: "07",
    name: "Lai Châu",
    capital: "Lai Châu",
    population: 460196,
    area: 9068.8,
    region: "Northwest"
  },
  {
    id: "08",
    name: "Lào Cai",
    capital: "Lào Cai",
    population: 733919,
    area: 6383.9,
    region: "Northwest"
  },
  {
    id: "09",
    name: "Tuyên Quang",
    capital: "Tuyên Quang",
    population: 786258,
    area: 5867.9,
    region: "Northeast"
  },
  {
    id: "10",
    name: "Lạng Sơn",
    capital: "Lạng Sơn",
    population: 782811,
    area: 8310.1,
    region: "Northeast"
  },
  {
    id: "11",
    name: "Trà Vinh",
    capital: "Trà Vinh",
    population: 1009168,
    area: 2358.2,
    region: "Mekong River Delta"
  },
  {
    id: "12",
    name: "Bắc Kạn",
    capital: "Bắc Kạn",
    population: 314358,
    area: 4859.4,
    region: "Northeast"
  },
  {
    id: "13",
    name: "Thái Nguyên",
    capital: "Thái Nguyên",
    population: 1286751,
    area: 3562.8,
    region: "Northeast"
  },
  {
    id: "14",
    name: "Yên Bái",
    capital: "Yên Bái",
    population: 823825,
    area: 6887.7,
    region: "Northeast"
  },
  {
    id: "15",
    name: "Sơn La",
    capital: "Sơn La",
    population: 1248415,
    area: 14174.4,
    region: "Northwest"
  },
  {
    id: "16",
    name: "Phú Thọ",
    capital: "Việt Trì",
    population: 1463123,
    area: 3534.6,
    region: "Northeast"
  },
  {
    id: "17",
    name: "Vĩnh Phúc",
    capital: "Vĩnh Yên",
    population: 1154156,
    area: 1236.5,
    region: "Red River Delta"
  },
  {
    id: "18",
    name: "Quảng Ninh",
    capital: "Hạ Long",
    population: 1320324,
    area: 6102.4,
    region: "Northeast"
  },
  {
    id: "19",
    name: "Bắc Giang",
    capital: "Bắc Giang",
    population: 1803950,
    area: 3848.9,
    region: "Northeast"
  },
  {
    id: "20",
    name: "Bắc Ninh",
    capital: "Bắc Ninh",
    population: 1368840,
    area: 822.7,
    region: "Red River Delta"
  },
  {
    id: "21",
    name: "Hải Dương",
    capital: "Hải Dương",
    population: 1892254,
    area: 1656.0,
    region: "Red River Delta"
  },
  {
    id: "22",
    name: "Hưng Yên",
    capital: "Hưng Yên",
    population: 1252731,
    area: 926.0,
    region: "Red River Delta"
  },
  {
    id: "23",
    name: "Hòa Bình",
    capital: "Hòa Bình",
    population: 854131,
    area: 4608.7,
    region: "Northwest"
  },
  {
    id: "24",
    name: "Hà Nam",
    capital: "Phủ Lý",
    population: 852888,
    area: 860.5,
    region: "Red River Delta"
  },
  {
    id: "25",
    name: "Nam Định",
    capital: "Nam Định",
    population: 1842631,
    area: 1652.6,
    region: "Red River Delta"
  },
  {
    id: "26",
    name: "Thái Bình",
    capital: "Thái Bình",
    population: 1860447,
    area: 1570.5,
    region: "Red River Delta"
  },
  {
    id: "27",
    name: "Ninh Bình",
    capital: "Ninh Bình",
    population: 983501,
    area: 1376.7,
    region: "Red River Delta"
  },
  {
    id: "28",
    name: "Thanh Hóa",
    capital: "Thanh Hóa",
    population: 3640128,
    area: 11132.2,
    region: "North Central"
  },
  {
    id: "29",
    name: "Nghệ An",
    capital: "Vinh",
    population: 3327791,
    area: 16490.9,
    region: "North Central"
  },
  {
    id: "30",
    name: "Hà Tĩnh",
    capital: "Hà Tĩnh",
    population: 1290866,
    area: 5997.8,
    region: "North Central"
  },
  {
    id: "31",
    name: "Quảng Bình",
    capital: "Đồng Hới",
    population: 896599,
    area: 8065.3,
    region: "North Central"
  },
  {
    id: "32",
    name: "Quảng Trị",
    capital: "Đông Hà",
    population: 633662,
    area: 4739.8,
    region: "North Central"
  },
  {
    id: "33",
    name: "Thừa Thiên Huế",
    capital: "Huế",
    population: 1163591,
    area: 5033.2,
    region: "North Central"
  },
  {
    id: "34",
    name: "Quảng Nam",
    capital: "Tam Kỳ",
    population: 1493252,
    area: 10574.7,
    region: "South Central Coast"
  },
  {
    id: "35",
    name: "Quảng Ngãi",
    capital: "Quảng Ngãi",
    population: 1272800,
    area: 5157.6,
    region: "South Central Coast"
  },
  {
    id: "36",
    name: "Bình Định",
    capital: "Quy Nhơn",
    population: 1529038,
    area: 6050.6,
    region: "South Central Coast"
  },
  {
    id: "37",
    name: "Phú Yên",
    capital: "Tuy Hòa",
    population: 899925,
    area: 5060.6,
    region: "South Central Coast"
  },
  {
    id: "38",
    name: "Khánh Hòa",
    capital: "Nha Trang",
    population: 1222644,
    area: 5217.7,
    region: "South Central Coast"
  },
  {
    id: "39",
    name: "Ninh Thuận",
    capital: "Phan Rang-Tháp Chàm",
    population: 590467,
    area: 3355.3,
    region: "South Central Coast"
  },
  {
    id: "40",
    name: "Bình Thuận",
    capital: "Phan Thiết",
    population: 1230408,
    area: 7812.8,
    region: "South Central Coast"
  },
  {
    id: "41",
    name: "Kon Tum",
    capital: "Kon Tum",
    population: 540438,
    area: 9689.6,
    region: "Central Highlands"
  },
  {
    id: "42",
    name: "Gia Lai",
    capital: "Pleiku",
    population: 1513847,
    area: 15536.9,
    region: "Central Highlands"
  },
  {
    id: "43",
    name: "Đắk Lắk",
    capital: "Buôn Ma Thuột",
    population: 1896623,
    area: 13125.4,
    region: "Central Highlands"
  },
  {
    id: "44",
    name: "Đắk Nông",
    capital: "Gia Nghĩa",
    population: 642487,
    area: 6515.6,
    region: "Central Highlands"
  },
  {
    id: "45",
    name: "Lâm Đồng",
    capital: "Đà Lạt",
    population: 1312919,
    area: 9764.8,
    region: "Central Highlands"
  },
  {
    id: "46",
    name: "Bình Phước",
    capital: "Đồng Xoài",
    population: 994679,
    area: 6871.5,
    region: "Southeast"
  },
  {
    id: "47",
    name: "Tây Ninh",
    capital: "Tây Ninh",
    population: 1149389,
    area: 4039.7,
    region: "Southeast"
  },
  {
    id: "48",
    name: "Bình Dương",
    capital: "Thủ Dầu Một",
    population: 2426561,
    area: 2694.4,
    region: "Southeast"
  },
  {
    id: "49",
    name: "Đồng Nai",
    capital: "Biên Hòa",
    population: 3097107,
    area: 5907.2,
    region: "Southeast"
  },
  {
    id: "50",
    name: "Bà Rịa-Vũng Tàu",
    capital: "Vũng Tàu",
    population: 1148313,
    area: 1989.5,
    region: "Southeast"
  },
  {
    id: "51",
    name: "Long An",
    capital: "Tân An",
    population: 1688547,
    area: 4494.9,
    region: "Mekong River Delta"
  },
  {
    id: "52",
    name: "Tiền Giang",
    capital: "Mỹ Tho",
    population: 1752386,
    area: 2484.2,
    region: "Mekong River Delta"
  },
  {
    id: "53",
    name: "Bến Tre",
    capital: "Bến Tre",
    population: 1288463,
    area: 2360.2,
    region: "Mekong River Delta"
  },
  {
    id: "54",
    name: "Vĩnh Long",
    capital: "Vĩnh Long",
    population: 1051799,
    area: 1475.2,
    region: "Mekong River Delta"
  },
  {
    id: "55",
    name: "Cần Thơ",
    capital: "Cần Thơ",
    population: 1282256,
    area: 1408.9,
    region: "Mekong River Delta"
  },
  {
    id: "56",
    name: "Hậu Giang",
    capital: "Vị Thanh",
    population: 769593,
    area: 1621.8,
    region: "Mekong River Delta"
  },
  {
    id: "57",
    name: "Đồng Tháp",
    capital: "Cao Lãnh",
    population: 1690300,
    area: 3377.0,
    region: "Mekong River Delta"
  },
  {
    id: "58",
    name: "An Giang",
    capital: "Long Xuyên",
    population: 1908352,
    area: 3536.8,
    region: "Mekong River Delta"
  },
  {
    id: "59",
    name: "Kiên Giang",
    capital: "Rạch Giá",
    population: 1810487,
    area: 6348.8,
    region: "Mekong River Delta"
  },
  {
    id: "60",
    name: "Sóc Trăng",
    capital: "Sóc Trăng",
    population: 1199653,
    area: 3311.6,
    region: "Mekong River Delta"
  },
  {
    id: "61",
    name: "Bạc Liêu",
    capital: "Bạc Liêu",
    population: 899485,
    area: 2584.1,
    region: "Mekong River Delta"
  },
  {
    id: "62",
    name: "Cà Mau",
    capital: "Cà Mau",
    population: 1226485,
    area: 5294.9,
    region: "Mekong River Delta"
  },
  {
    id: "63",
    name: "Điện Biên",
    capital: "Điện Biên Phủ",
    population: 598856,
    area: 9542.9,
    region: "Northwest"
  },
];

// Map province ID to colors for the map
export const provinceColors: Record<string, string> = {
  "01": "#FF5733", // Hà Nội
  "02": "#33A8FF", // Hồ Chí Minh
  "03": "#33FF57", // Hải Phòng
  "04": "#FF33A8", // Đà Nẵng
  "05": "#A833FF", // Hà Giang
  "06": "#FF8C33", // Cao Bằng
  "07": "#33FFC1", // Lai Châu
  "08": "#FF3333", // Lào Cai
  "09": "#8CFF33", // Tuyên Quang
  "10": "#337DFF", // Lạng Sơn
  "11": "#FFC133", // Trà Vinh
  "12": "#33FFEC", // Bắc Kạn
  "13": "#FF33EC", // Thái Nguyên
  "14": "#337DFF", // Yên Bái
  "15": "#33FF8C", // Sơn La
  "16": "#FF6B33", // Phú Thọ
  "17": "#9E33FF", // Vĩnh Phúc
  "18": "#33C1FF", // Quảng Ninh
  "19": "#FFD433", // Bắc Giang
  "20": "#33FFA8", // Bắc Ninh
  "21": "#FF4F33", // Hải Dương
  "22": "#33FFCB", // Hưng Yên
  "23": "#8F33FF", // Hòa Bình
  "24": "#33C9FF", // Hà Nam
  "25": "#FF9E33", // Nam Định
  "26": "#33FF9E", // Thái Bình
  "27": "#FF338F", // Ninh Bình
  "28": "#3384FF", // Thanh Hóa
  "29": "#FF3384", // Nghệ An
  "30": "#33FFA8", // Hà Tĩnh
  "31": "#A833FF", // Quảng Bình
  "32": "#FFD633", // Quảng Trị
  "33": "#33FFE7", // Thừa Thiên Huế
  "34": "#A833FF", // Quảng Nam
  "35": "#FFB733", // Quảng Ngãi
  "36": "#33C4FF", // Bình Định
  "37": "#FF4F33", // Phú Yên
  "38": "#33FFCB", // Khánh Hòa
  "39": "#FF338F", // Ninh Thuận
  "40": "#33C9FF", // Bình Thuận
  "41": "#FF9E33", // Kon Tum
  "42": "#33FF9E", // Gia Lai
  "43": "#FF338F", // Đắk Lắk
  "44": "#3384FF", // Đắk Nông
  "45": "#FF3384", // Lâm Đồng
  "46": "#33FFA8", // Bình Phước
  "47": "#A833FF", // Tây Ninh
  "48": "#FFD633", // Bình Dương
  "49": "#33FFE7", // Đồng Nai
  "50": "#8333FF", // Bà Rịa-Vũng Tàu
  "51": "#FFB733", // Long An
  "52": "#33C4FF", // Tiền Giang
  "53": "#FF4F33", // Bến Tre
  "54": "#33FFCB", // Vĩnh Long
  "55": "#FF338F", // Cần Thơ
  "56": "#33C9FF", // Hậu Giang
  "57": "#FF9E33", // Đồng Tháp
  "58": "#33FF9E", // An Giang
  "59": "#FF338F", // Kiên Giang
  "60": "#3384FF", // Sóc Trăng
  "61": "#FF3384", // Bạc Liêu
  "62": "#33FFA8", // Cà Mau
  "63": "#A833FF", // Điện Biên
};

// Get a province by ID
export const getProvinceById = (id: string): Province | undefined => {
  return provinces.find(province => province.id === id);
};