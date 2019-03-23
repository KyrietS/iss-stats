
let counter = 0
let records = []
let elapsedSeconds = 0;
let updaterSpeed = 5000;

setInterval( updateData, updaterSpeed );

setInterval(function (){
    elapsedSeconds++;
    document.querySelector("#elapsed").innerHTML = `${elapsedSeconds} s`
}, 1000);

setTimeout( function(){
    let info = document.querySelector(".info");
    info.parentElement.removeChild( info );
}, updaterSpeed * 2)

async function updateData () {

    const response = await fetch("http://api.open-notify.org/iss-now.json");
    const resp = await response.json();

    counter++
    records.push({
        id: counter,
        latitude: parseFloat(resp.iss_position.latitude),
        longitude: parseFloat(resp.iss_position.longitude),
        timestamp: parseInt(resp.timestamp)});

    updatePage();
    
}

function updatePage() {
    if( records.length <= 1 ) return;

    let newDistance = calculateDistance( records[0], records[ records.length-1 ]);
	
	// Liczenie średniej prędkości
    //let newSpeed = calculateSpeed(records[0],records[records.length-1]);
	
	// Liczenie aktualnej prędkości	
    let newSpeed = calculateSpeed(records[records.length-2],records[records.length-1]);

    updateDistance( newDistance );
    updateSpeed( newSpeed );
}

function updateSpeed( newSpeed ) {
    document.querySelector("#speed").innerHTML = `${newSpeed} km/h`;
}

function updateDistance( newDistance ) {
    // Zamiana na km
    newDistance = (newDistance / 1000).toFixed(1);
    document.querySelector("#distance").innerHTML = `${newDistance} km`;    
}

function calculateDistance(p1, p2) {
 
	// Stopnie na radiany
	let lat1 = p1.latitude * Math.PI / 180.0;
	let lon1 = p1.longitude * Math.PI / 180.0;
 
	let lat2 = p2.latitude * Math.PI / 180.0;
	let lon2 = p2.longitude * Math.PI / 180.0;
 
	// Promień Ziemi w metrach + ISS's altitude
	let r = 6378100 + 408*1000;
 
	// P
	let rho1 = r * Math.cos(lat1);
	let z1 = r * Math.sin(lat1);
	let x1 = rho1 * Math.cos(lon1);
	let y1 = rho1 * Math.sin(lon1);
 
	// Q
	let rho2 = r * Math.cos(lat2);
	let z2 = r * Math.sin(lat2);
	let x2 = rho2 * Math.cos(lon2);
	let y2 = rho2 * Math.sin(lon2);
 
	// Dot product
	let dot = (x1 * x2 + y1 * y2 + z1 * z2);
	let cos_theta = dot / (r * r);
 
	let theta = Math.acos(cos_theta);
 
	// Distance in Metres
    let distance = Math.round( r * theta );

	return distance;
}

function calculateSpeed(p1, p2) {
    let dist = calculateDistance( p1, p2 );
    let time_s = (p2.timestamp - p1.timestamp);

    let speed_mps = dist / time_s;
    let speed_kps = (speed_mps * 3600.0) / 1000.0;

    speed_kps = Math.round(speed_kps);
    console.log("Droga: " + (dist / 1000).toFixed(1) + " km");
    console.log("Prędkość: " + speed_kps + " km/h");

    return speed_kps;
}


