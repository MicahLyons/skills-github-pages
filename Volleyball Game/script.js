//Dark mode:
    //Land: #323366
    //BG:rgb(0, 0, 71)

const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')
const grid = cvs.width / 64

let rect = cvs.getBoundingClientRect(); //Depixelate
cvs.width = rect.width * devicePixelRatio;
cvs.height = rect.height * devicePixelRatio;
ctx.scale((devicePixelRatio),(devicePixelRatio));
cvs.style.width = '2400px';
cvs.style.height = '1500px';

const map_svg = document.getElementById('map'); //map
const plane_png = document.getElementById('plane'); //red plane
const boat1_svg = document.getElementById('boat1'); //cargo ship

let settings = {
    cityNames: true,
    cityMarkers: true,
    speed: 2,
    clouds: true,
    vehicles: true,
    volume: 1,
}
// let cursor = {
//     x: 0,
//     y: 0,
// }
// document.addEventListener('mousemove',function(e) {
//     cursor.x = Math.floor(e.clientX - map.x - 33);
//     cursor.y = Math.floor(e.clientY - map.y);
// });


let map = { //map data
    width: 4378.13,
    height: 2434.94,
    draw: function() { 
        this.x = -1 * plane.x + cvs.width / 2;
        this.y = -1 * plane.y + cvs.width / 2;

        for (var i = 0; 50*i - 50 < this.width + cvs.width/2; i++) { //Grid Vertical
            ctx.beginPath();
            ctx.moveTo(50*i + this.x, this.y);
            ctx.lineTo(50*i + this.x, this.y + 2450 + cvs.height/2);
            ctx.strokeStyle = '#FFFFFF30'
            ctx.lineWidth = 1
            ctx.stroke()
        }
        for (var i = 0; 50*i - 50 < this.height + cvs.height/2; i++) { //Grid horizontal
            ctx.beginPath();
            ctx.moveTo(this.x, 50*i + this.y);
            ctx.lineTo(this.x + 4400 + cvs.width/2, 50*i + this.y);
            ctx.strokeStyle = '#FFFFFF30'
            ctx.stroke()
        }

        ctx.drawImage(map_svg, cvs.width/2 + this.x, cvs.height/2 + this.y, this.width, this.height);    
    },
}
let plane = { //plane data
    angle: 0,
    speed: 2,
    x: 200,
    y: 500,
    left: false,
    right: false,
    trail: [],
    draw: function() {
        if (this.left) {
            this.angle -= .015
        } if (this.right) {
            this.angle += .015
        }

        ctx.beginPath(); //pickup range
        ctx.strokeStyle = '#efefef70';
        ctx.lineWidth = 5
        ctx.arc(cvs.width/2, cvs.height/2, 30, 0, 2*Math.PI)
        ctx.stroke()

        for (var i = 0; i < this.trail.length; i++) {
            this.trail[i].draw()
        }

        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        if (this.x > map.width + cvs.width/2) {
            this.x = 0;
        } if (this.x < 0) {
            this.x = map.width + cvs.width/2;
        } if (this.y < 0 + cvs.height/2 || this.y > map.height + cvs.height) {
            this.angle += Math.PI / 10
        }
        ctx.save();
        //ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.translate(cvs.width/2, cvs.height/2);
        ctx.rotate(this.angle);
        ctx.translate(-(cvs.width/2), -(cvs.height/2));
        ctx.drawImage(plane_png, cvs.width/2 - plane_png.width/2, cvs.height/2 - plane_png.height/2, plane_png.width, plane_png.height);
        ctx.restore();
    },
}
function particleTrail() { //contrail
    this.x = plane.x - 20 * Math.cos(plane.angle)
    this.y = plane.y - 20 * Math.sin(plane.angle)
    this.opacity = 1
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,'+this.opacity+')';
        ctx.arc(this.x+map.x,this.y+map.y-343.5,2,0,2*Math.PI); //adjust coords
        ctx.fill();
        this.opacity -= .02;
        if (this.opacity <= 0) {
            plane.trail.splice(this,1)
        }
    }
}

let vehicles = []
function Vehicle(type, image, path) {
    this.image = image;
    this.path = path;
    if (type == 'boat') {this.speed = .5}
    else {this.speed = 1}
    this.time = 0;

    this.move = function() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.path == 0) { //path 0 (ship)
            if (this.time < 0) {
                this.x = 8196
                this.y = 8196
            }
            if (this.time == 0) {
                this.x = 0
                this.y = 2000
                this.angle = .1
            }
            else if (3000 < this.time && this.time < 3300) {
                this.angle += .003
            }
            else if (3500 < this.time && this.time < 4000) {
                this.angle -= .003
            }
            else if (5000 < this.time && this.time < 5450) {
                this.angle -= .003
            }
            else if (6200 < this.time && this.time < 6450) {
                this.angle -= .003
            }
            else if (6800 < this.time && this.time < 7000) {
                this.angle -= .001
                this.speed -= .001
            }
            else if (7500 < this.time && this.time < 8000) {
                this.speed = .2
                this.angle -= .003
            }
            else if (8300 < this.time && this.time < 8500) {
                this.angle += .0035
                this.speed += .001
            }
            else if (9500 < this.time && this.time < 10000) {
                this.speed = .5
                this.angle += .003
            }
            else if (11000 < this.time && this.time < 11100) {
                this.angle -= .003
            }
            else if (13400 < this.time) {
                this.time = Math.floor(Math.random() * -1500)
            }
            
        }
        else if (this.path == 1) { //path 1 (ship)
            if (this.time < 0) {
                this.x = 8196
                this.y = 8196
            }
            if (this.time == 0) {
                this.x = 4379 + cvs.width/2
                this.y = 1500
                this.angle = 2
            }
            else if (400 < this.time && this.time < 500) {
                this.angle += .003
            }
            else if (1800 < this.time && this.time < 2125) {
                this.angle += .003
            }
            else if (4800 < this.time && this.time < 5000) {
                this.angle += .003
            }
            else if (6700 < this.time && this.time < 7000) {
                this.angle += .003
            }
            else if (8000 < this.time && this.time < 8350) {
                this.angle += .003
            }
            else if (9200 < this.time && this.time < 9300) {
                this.angle += .003
            }
            else if (13900 < this.time) {
                this.time = Math.floor(Math.random() * -1500 - 1500)
            }
        }
        else if (this.path == 2) { //path 1 (ship)
            if (this.time < 0) {
                this.x = 8196
                this.y = 8196
            }
            if (this.time == 0) {
                this.x = 200
                this.y = 0
                this.angle = .3
            }
            else if (1400 < this.time && this.time < 1500) {
                this.angle -= .003
            }
            else if (8600 < this.time && this.time < 9000) {
                this.angle += .0014
            }
            else if (9650 < this.time && this.time < 9975) {
                this.angle += .003
            }
            else if (11000 < this.time && this.time < 11600) {
                this.angle += .003
            }
            else if (11800 < this.time && this.time < 12800) {
                this.angle -= .003
            }
            else if (13700 < this.time) {
                this.time = Math.floor(Math.random() * -1500 - 3000)
            }
        }
        this.time += 1
    }
    this.draw = function() {
        this.move()
        ctx.save();
        ctx.translate(this.x + map.x, this.y + map.y) + 33;
        ctx.rotate(this.angle);
        ctx.translate(-(this.x + map.x), -(this.y + map.y + 33));
        ctx.drawImage(this.image, this.x + map.x, this.y + map.y, plane_png.width * 1.25, plane_png.height * 1.25);
        ctx.restore();
        // ctx.beginPath()
        // ctx.fillStyle = 'red'
        // ctx.arc(this.x + map.x,this.y + map.y,30,0,2*Math.PI);
        // ctx.fill();
    }
}

document.addEventListener('keydown',function(e) { //inputs
    if (e.which == 65) {
        plane.left = true;
    } if (e.which == 68) {
        plane.right = true;
    } if (e.which == 87) {
        plane.speed = 1;
    }
});
document.addEventListener('keyup',function(e) {
    if (e.which == 65) {
        plane.left = false;
    } if (e.which == 68) {
        plane.right = false;
    } if (e.which == 87) {
        plane.speed = 0;
    }
});

function loop() { //animate game
    ctx.clearRect(0,0,cvs.width,cvs.height)
    map.draw();
    if (settings.cityMarkers) {
        for (var i = 0; i < cities.length; i++) {
            cities[i].draw()
        }
    }
    plane.trail.push(new particleTrail())
    plane.draw();

    for (var i = 0; i < vehicles.length; i++) {
        vehicles[i].draw()
    }
    document.getElementById('coords').innerHTML = '(' + vehicles[2].time + ')'
    requestAnimationFrame(loop)
}

let cities = []
function City(name,country,x,y,isCapital) {
    this.name = name;
    this.country = country
    this.x = x;
    this.y = y;
    this.isCapital = isCapital;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x + map.x, this.y + map.y, 5, 0, 2*Math.PI)
        ctx.fill()

        if (this.isCapital) {
            ctx.beginPath();
            ctx.fillStyle = 'gold';
            ctx.arc(this.x + map.x, this.y + map.y, 5, 0, 2*Math.PI)
            ctx.fill()
        }
        
        if (settings.cityNames) {
            ctx.font = "9px Tahoma";
            ctx.textAlign = "center";
            ctx.fillStyle = 'white';
            ctx.fillText(this.name, this.x + map.x, this.y + map.y + 12);
        }
    }
}
function makeCities() {//Missing: Puerto Rico, Small Caribbean Islands, Part of Balkans, Microstates, Israel, Palestine, Oceania, ROC
    cities.push(new City('London', 'United Kingdom', 2715, 765, true));
    cities.push(new City('Dublin', 'Ireland', 2632, 747, true));
    cities.push(new City('Madrid', 'Spain', 2672, 930, true));
    cities.push(new City('Rome', 'Italy', 2860, 905, true));
    cities.push(new City('Paris', 'France', 2743, 806, true));
    cities.push(new City('Berlin', 'Germany', 2867, 750, true));
    cities.push(new City('Zurich', 'Switzerland', 2821, 835, true));
    cities.push(new City('Washington', 'United States', 1784, 947, true));
    cities.push(new City('Ottawa', 'Canada', 1800, 850, true));
    cities.push(new City('Mexico City', 'Mexico', 1522, 1226, true));
    cities.push(new City('Guatemala City', 'Guatemala', 1619, 1287, true));
    cities.push(new City('Tegucigalpa', 'Honduras', 1675, 1297, true));
    cities.push(new City('San Salvador', 'El Salvador', 1640, 1311, true));
    cities.push(new City('Managua', 'Nicaragua', 1676, 1333, true));
    cities.push(new City('San Jose', 'Costa Rica', 1705, 1362, true));
    cities.push(new City('Panama City', 'Panama', 1758, 1375, true));
    cities.push(new City('Bogota', 'Colombia', 1818, 1445, true));
    cities.push(new City('Caracas', 'Venezuela', 1913, 1356, true));
    cities.push(new City('Georgetown', 'Guyana', 2010,1411, true));
    cities.push(new City('Paramaribo', 'Suriname', 2044, 1423, true));
    cities.push(new City('Quito', 'Ecuador', 1765, 1500, true));
    cities.push(new City('Lima', 'Peru', 1785, 1673, true));
    cities.push(new City('La Paz', 'Bolivia', 1896, 1746, true));
    cities.push(new City('Sucre', 'Bolivia', 1951, 1788, true));
    cities.push(new City('Santiago', 'Chile', 1860, 1994, true));
    cities.push(new City('Buenos Aires', 'Argentina', 2008, 2015, true));
    cities.push(new City('Montevideo', 'Uruguay', 2039, 2006, true));
    cities.push(new City('Asuncion', 'Paraguay', 2022, 1875, true));
    cities.push(new City('Brasilia', 'Brazil', 2130, 1743, true));
    cities.push(new City('Havana', 'Cuba', 1728, 1175, true));
    cities.push(new City('Nassau', 'The Bahamas', 1780, 1149, true));
    cities.push(new City('Port-au-Prince', 'Haiti', 1840, 1236, true));
    cities.push(new City('Santo Domingo', 'Dominican Republic', 1875, 1243, true));
    cities.push(new City('Kingston', 'Jamaica', 1790, 1248, true));
    cities.push(new City('Brussels', 'Belgium', 2765, 777, true));
    cities.push(new City('Amsterdam', 'Netherlands', 2773, 755, true));
    cities.push(new City('Prague', 'Czechia', 2881, 791, true));
    cities.push(new City('Vienna', 'Austria', 2903, 820, true));
    cities.push(new City('Zagreb', 'Croatia', 2902, 849, true));
    cities.push(new City('Sarajevo', 'Bosnia and Herzegovina', 2922, 877, true));
    cities.push(new City('Belgrade', 'Serbia', 2937, 855, true));
    cities.push(new City('Andorra', 'Andorra', 2727, 890, true));
    cities.push(new City('Monaco', 'Monaco', 2805, 876, true));
    cities.push(new City('Athens', 'Greece', 2994, 960, true));
    cities.push(new City('Skopje', 'North Macedonia', 2961, 902, true));
    cities.push(new City('Sofia', 'Bulgaria', 2986, 895, true));
    cities.push(new City('Bucharest', 'Romania', 3013, 881, true));
    cities.push(new City('Budapest', 'Hungary', 2937, 825, true));
    cities.push(new City('Warsaw', 'Poland', 2957, 756, true));
    cities.push(new City('Copenhagen', 'Denmark', 2856, 710, true));
    cities.push(new City('Stockholm', 'Sweden', 2924, 651, true));
    cities.push(new City('Oslo', 'Norway', 2838, 643, true));
    cities.push(new City('Helsinki', 'Finland', 3001, 638, true));
    cities.push(new City('Riga', 'Latvia', 2995, 689, true));
    cities.push(new City('Talinn', 'Estonia', 3006, 656, true));
    cities.push(new City('Vilnius', 'Lithuania', 3010, 719, true));
    cities.push(new City('Minsk', 'Belarus', 3036, 732, true));
    cities.push(new City('Kyiv', 'Ukraine', 3077, 780, true));
    cities.push(new City('Chisinau', 'Moldova', 3060, 841, true));
    cities.push(new City('Ankara', 'Turkiye', 3109, 929, true));
    cities.push(new City('Tirana', 'Albania', 2951, 920, true));
    cities.push(new City('Nicosia', 'Cyprus', 3111, 1002, true));
    cities.push(new City('Damascus', 'Syria', 3151, 1022, true));
    cities.push(new City('Yerevan', 'Armenia', 3244, 927, true));
    cities.push(new City('Baku', 'Azerbaijan', 3308, 926, true));
    cities.push(new City('Tbilisi', 'Georgia', 3250, 903, true));
    cities.push(new City('Moscow', 'Russia', 3165, 714, true));
    cities.push(new City('Astana', 'Kazakhstan', 3563, 782, true));
    cities.push(new City('Tashkent', 'Uzbekistan', 3530, 909, true));
    cities.push(new City('Bishkek', 'Kyrgyzstan', 3614, 891, true));
    cities.push(new City('Dushanube', 'Tajikistan', 3526, 968, true));
    cities.push(new City('Ashgabat', 'Turkmenistan', 3410, 971, true));
    cities.push(new City('Kabul', 'Afghanistan', 3532, 1021, true));
    cities.push(new City('Reykjavik', 'Iceland', 2450, 583, true));
    cities.push(new City('Tehran', 'Iran', 3335, 995, true));
    cities.push(new City('Baghdad', 'Iraq', 3254, 1026, true));
    cities.push(new City('Kuwait City', 'Kuwait', 3286, 1085, true));
    cities.push(new City('Doha', 'Qatar', 3330, 1147, true));
    cities.push(new City('Manama', 'Bahrain', 3315, 1128, true));
    cities.push(new City('Riyadh', 'Saudi Arabia', 3273, 1162, true));
    cities.push(new City('Abu Dhabi', 'United Arab Emirates', 3363, 1156, true));
    cities.push(new City("Sana'a", 'Yemen', 3240, 1307, true));
    cities.push(new City('Djibouti', 'Djibouti', 3228, 1341, true));
    cities.push(new City('Muscat', 'Oman', 3409, 1168, true));
    cities.push(new City('Islamabad', 'Pakistan', 3575, 1051, true));
    cities.push(new City('New Delhi', 'India', 3633, 1108, true));
    cities.push(new City('Kathmandu', 'Nepal', 3734, 1111, true));
    cities.push(new City('Dhaka', 'Bangladesh', 3789, 1159, true));
    cities.push(new City('Thimphu', 'Bhutan', 3779, 1119, true));
    cities.push(new City('Naypyidaw', 'Myanmar', 3863, 1222, true));
    cities.push(new City('Bangkok', 'Thailand', 3920, 1311, true));
    cities.push(new City('Phnom Penh', 'Cambodia', 3969, 1338, true));
    cities.push(new City('Vientiane', 'Laos', 3946, 1251, true));
    cities.push(new City('Hanoi', 'Vietnam', 3980, 1198, true));
    cities.push(new City('Singapore', 'Singapore', 3954, 1487, true));
    cities.push(new City('Kuala Lumpur', 'Malaysia', 3928, 1464, true));
    cities.push(new City('Taipei', 'Taiwan', 4168, 1148, true));
    cities.push(new City('Beijing', 'China', 4118, 941, true));
    cities.push(new City('Pyongyang', 'North Korea', 4221, 943, true));
    cities.push(new City('Seoul', 'South Korea', 4238, 971, true));
    cities.push(new City('Tokyo', 'Japan', 4389, 995, true));
    cities.push(new City('Ulaanbaatar', 'Mongolia', 3980, 829, true));
    cities.push(new City('Amman', 'Jordan', 3140, 1041, true));
    cities.push(new City('Manila', 'Philippines', 4164, 1296, true));
    cities.push(new City('Bandar Seri Begawan', 'Brunei', 4091, 1436, true));
    cities.push(new City('Colombo', 'Sri Lanka', 3671, 1408, true));
    cities.push(new City('Jakarta', 'Indonesia', 4000, 1600, true));
    cities.push(new City('Dili', 'Timor-Leste', 4219, 1633, true));
    cities.push(new City('Port Moresby', 'Papua New Guinea', 4476, 1645, true));
    cities.push(new City('Canberra', 'Australia', 4501, 2027, true));
    cities.push(new City('Wellington', 'New Zealand', 4813, 2101, true));
    cities.push(new City('Suva', 'Fiji', 4852, 1766, true));
    cities.push(new City('Danipei', 'Micronesia', 4610, 1405, true));
    cities.push(new City('Male', 'Maldives', 3588, 1435, true));
    cities.push(new City('Victoria', 'Seychelles', 3376, 1600, true));
    cities.push(new City('Moroni', 'Comoros', 3230, 1678, true));
    cities.push(new City('Port Louis', 'Mauritius', 3400, 1800, true));
    cities.push(new City('Antananarivo', 'Madagascar', 3282, 1767, true));
    cities.push(new City('Cairo', 'Egypt', 3083, 1074, true));
    cities.push(new City('Tripoli', 'Libya', 2876, 1036, true));
    cities.push(new City('Tunis', 'Tunisia', 2834, 978, true));
    cities.push(new City('Algiers', 'Algeria', 2750, 978, true));
    cities.push(new City('Rabat', 'Morocco', 2634, 1018, true));
    cities.push(new City('Nouakchott', 'Mauritania', 2520, 1248, true));
    cities.push(new City('Dakar', 'Senegal', 2504, 1294, true));
    cities.push(new City('Banjul', 'The Gambia', 2512, 1314, true));
    cities.push(new City('Bissau', 'Guinea-Bissau', 2522, 1339, true));
    cities.push(new City('Conakry', 'Guinea', 2549, 1370, true));
    cities.push(new City('Monrovia', 'Liberia', 2582, 1415, true));
    cities.push(new City('Bamako', 'Mali', 2620, 1324, true));
    cities.push(new City('Yamoussoukro', "Cote d'Ivoire", 2652, 1408, true));
    cities.push(new City('Accra', 'Ghana', 2711, 1421, true));
    cities.push(new City('Lome', 'Togo', 2731, 1414, true));
    cities.push(new City('Porto-Novo', 'Benin', 2758, 1409, true));
    cities.push(new City('Abuja', 'Nigeria', 2795, 1379, true));
    cities.push(new City('Praia', 'Cape Verde', 2427, 1291, true));
    cities.push(new City('Ougadougou', 'Burkina Faso', 2687, 1334, true));
    cities.push(new City('Niamey', 'Niger', 2754, 1310, true));
    cities.push(new City("N'Djamena", 'Chad', 2888, 1336, true));
    cities.push(new City('Yaounde', 'Cameroon', 2857, 1449, true));
    cities.push(new City('Malabo', 'Equatorial Guinea', 2815, 1454, true));
    cities.push(new City('Freetown', 'Sierra Leone', 2556, 1390, true));
    cities.push(new City('Bangui', 'Central African Republic', 2944, 1442, true));
    cities.push(new City('Khartoum', 'Sudan', 3104, 1285, true));
    cities.push(new City('Asmara', 'Eritrea', 3183, 1287, true));
    cities.push(new City('Addis Ababa', 'Ethiopia', 3182, 1369, true));
    cities.push(new City('Mogadishu', 'Somalia', 3247, 1484, true));
    cities.push(new City('Juba', 'South Sudan', 3088, 1438, true));
    cities.push(new City('Kampala', 'Uganda', 3100, 1500, true));
    cities.push(new City('Nairobi', 'Kenya', 3156, 1527, true));
    cities.push(new City('Kigali', 'Rwanda', 3073, 1539, true));
    cities.push(new City('Bujumbura', 'Burundi', 3070, 1560, true));
    cities.push(new City('Dodoma', 'Tanzania', 3126, 1592, true));
    cities.push(new City('Libreville', 'Gabon', 2827, 1509, true));
    cities.push(new City('Sao Tome', 'Sao Tome and Principe', 2792, 1504, true));
    cities.push(new City('Kinshasa', 'Democratic Republic of the Congo', 2898, 1571, true));
    cities.push(new City('Luanda', 'Angola', 2870, 1636, true));
    cities.push(new City('Lusaka', 'Zambia', 3043, 1726, true));
    cities.push(new City('Windhoek', 'Namibia', 2919, 1829, true));
    cities.push(new City('Lilongwe', 'Malawi', 3111, 1707, true));
    cities.push(new City('Harare', 'Zimbabwe', 3089, 1758, true));
    cities.push(new City('Maputo', 'Mozambique', 3109, 1869, true));
    cities.push(new City('Mbabane', 'Eswatini', 3086, 1878, true));
    cities.push(new City('Maseru', 'Lesotho', 3039, 1927, true));
    cities.push(new City('Gaborone', 'Botswana', 3010, 1844, true));
    cities.push(new City('Pretoria', 'South Africa', 3046, 1866, true));
    cities.push(new City('Bloemfontein', 'South Africa', 3011, 1917, true));
    cities.push(new City('Cape Town', 'South Africa', 2934, 1999, true));
    cities.push(new City('Port of Spain', 'Trinidad and Tobago', 1973, 1358, true));
    cities.push(new City('Bridgetown', 'Barbados', 1999, 1319, true));
    cities.push(new City('Roseau', 'Dominica', 1975, 1284, true));
    cities.push(new City('Tarawa', 'Kiribati', 4759, 1500, true));
    cities.push(new City('Lisbon', 'Portugal', 2600, 950, true));
    cities.push(new City('Aden', 'Yemen', 3248, 1325, true));
    cities.push(new City('San Marino', 'San Marino', 2859, 877, true));
    cities.push(new City('Belmopan', 'Belize', 1644, 1258, true));

    cities.push(new City('Dar es Salaam', 'Tanzania', 3185, 1609, false));
    cities.push(new City('Kilwa', 'Tanzania', 3186, 1640, false));
    cities.push(new City('Jeddah', 'Saudi Arabia', 3181, 1198, false));
    cities.push(new City('Banana', 'Kiribati', 823, 1481, false));
    cities.push(new City('Mumbai', 'India', 3585, 1234, false));
    cities.push(new City('Bangalore', 'India', 3641, 1319, false));
    cities.push(new City('Hong Kong', 'China', 4076, 1183, false));
    cities.push(new City('Shanghai', 'China', 4164, 1066, false));
    cities.push(new City('Vancouver', 'Canada', 1232, 794, false));
    cities.push(new City('Toronto', 'Canada', 1720, 900, false));
    cities.push(new City('Calgary', 'Canada', 1333, 770, false));
    cities.push(new City('Anchorage', 'United States', 908, 626, false));
    cities.push(new City('Los Angeles', 'United States', 1288, 1019, false));
    cities.push(new City('Honolulu', 'United States', 817, 1203, false));
    cities.push(new City('Dallas', 'United States', 1530, 1029, false));
    cities.push(new City('Chicago', 'United States', 1659, 905, false));
    cities.push(new City('New York City', 'United States', 1825, 919, false));
    cities.push(new City('Orlando', 'United States', 1730, 1093, false));
    cities.push(new City('Salt Lake City', 'United States', 1370, 924, false));
    cities.push(new City('Nuuk', 'Denmark', 2098, 584, false));
    cities.push(new City('Benghazi', 'Libya', 2954, 1056, false));
    cities.push(new City('Timbuktu', 'Mali', 2669, 1280, false));
    cities.push(new City('Benguela', 'Angola', 2867, 1692, false));
    cities.push(new City('Villa Las Estrellas', 'Chile', 2000, 2405, false));
    cities.push(new City('Novosibirsk', 'Russia', 3710, 710, false));
    cities.push(new City('St. Petersburg', 'Russia', 3072, 642, false));
    cities.push(new City('Yekaterinburg', 'Russia', 3459, 654, false));
    cities.push(new City('Irkutsk', 'Russia', 3964, 754, false));
    cities.push(new City('Edinburgh', 'United Kingdom', 2672, 704, false));
    cities.push(new City('Manchester', 'United Kingdom', 2682, 736, false));
    cities.push(new City('Gibraltar', 'United Kingdom', 2647, 988, false));
    cities.push(new City('Sevastopol', 'Ukraine', 3113, 868, false));
    cities.push(new City('Lviv', 'Ukraine', 2998, 754, false));
    cities.push(new City('Osaka', 'Japan', 4337, 1010, false));
    cities.push(new City('Fukuoka', 'Japan', 4278, 1022, false));
    cities.push(new City('Sapporo', 'Japan', 4407, 889, false));
    cities.push(new City('Valencia', 'Spain', 2707, 940, false));
    cities.push(new City('Bordeaux', 'France', 2700, 863, false));
    cities.push(new City('Lyon', 'France', 2763, 852, false));
    cities.push(new City('Dubai', 'United Arab Emirates', 3376, 1140, false));
    cities.push(new City('Oulo', 'Finland', 3017, 573, false));
    cities.push(new City('Munich', 'Germany', 2853, 813, false));
    cities.push(new City('Naples', 'Italy', 2883, 921, false));
    cities.push(new City('Rio de Janiero', 'Brazil', 2193, 1835, false));
    cities.push(new City('Sao Paulo', 'Brazil', 2152, 1850, false));
    cities.push(new City('Manaus', 'Brazil', 1975, 1573, false));
    cities.push(new City('Cusco', 'Peru', 1847, 1698, false));
    cities.push(new City('Maracaibo', 'Venezuela', 1850, 1356, false));
    cities.push(new City('Tijuana', 'Mexico', 1313, 1050, false));
    cities.push(new City('Monterrey', 'Mexico', 1506, 1142, false));
    cities.push(new City('Cancun', 'Mexico', 1671, 1203, false));
    cities.push(new City('Medan', 'Indonesia', 3890, 1450, false));
    cities.push(new City('Sydney', 'Australia', 4518, 2007, false));
    cities.push(new City('Perth', 'Australia', 4098, 1972, false));
    cities.push(new City('Melbourne', 'Australia', 4449, 2054, false));
    cities.push(new City('Brisbane', 'Australia', 4548, 1901, false));
    cities.push(new City('Auckland', 'New Zealand', 4808, 2037, false));
    cities.push(new City('Abidjan', "Cote d'Ivoire", 2661, 1431, false));
    cities.push(new City('Cordoba', 'Argentina', 1943, 1959, false));
    cities.push(new City('Durban', 'South Africa', 3080, 1942, false));
    cities.push(new City('Keetmanshoop', 'Namibia', 2927, 1878, false));
    cities.push(new City('Toliara', 'Madagascar', 3238, 1846, false));
}

plane_png.onload = function() {
    makeCities();
    requestAnimationFrame(loop);
    requestAnimationFrame(loop);
    requestAnimationFrame(loop);
    requestAnimationFrame(loop);
    requestAnimationFrame(loop);
    requestAnimationFrame(loop);
    vehicles.push(new Vehicle('boat', boat1_svg, 0));
    vehicles.push(new Vehicle('boat', boat1_svg, 1));
    vehicles.push(new Vehicle('boat', boat1_svg, 2));
}