var map = L.map('map').setView([27.25, 84.11], 5);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.mousePosition().addTo(map);

var osmGeocoder = new L.Control.OSMGeocoder({
    collapsed: false, /* Whether its collapsed or not */
    position: 'topright', /* The position of the control */
    text: 'Search', /* The text of the submit button */
    placeholder: 'Search any Place', /* The text of the search input placeholder */
    bounds: null, /* a L.LatLngBounds object to limit the results to */
    email: null, /* an email string with a contact to provide to Nominatim. Useful if you are doing lots of queries */
});
map.addControl(osmGeocoder);


// User Location script
function userLocation() {
    if (navigator.geolocation) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(displayLocationInfo);
            }
            function displayLocationInfo(position) {
            const lng = position.coords.longitude;
            const lat = position.coords.latitude;

            console.log(`longitude: ${ lng } | latitude: ${ lat }`);
            L.circle([lat, lng], {
                radius: 1000,
                opacity: 1,
                weight:1,
                fillopactity: 1,
                fillColor: 'blue'
            }).addTo(map);
            map.setView([lat,lng],10);
        }
    } else {
        console.log('You dont have geolocation');
    }
};


// DrawItems control script
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
     	position: 'topright',
		draw: {
		    polygon: {
		     shapeOptions: {
		      color: 'purple'
		     },
		     allowIntersection: false,
		     drawError: {
		      color: 'orange',
		      timeout: 1000
		     },
		    },
		    polyline: {
		     shapeOptions: {
		      color: 'red'
		     },
		    },
		    rect: {
		     shapeOptions: {
		      color: 'green'
		     },
		    },
		    circle: {
		     shapeOptions: {
		      color: 'steelblue'
		     },
		    },
		   },
        edit: {
             featureGroup: drawnItems
         }
     });
map.addControl(drawControl);
map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
            drawnItems.addLayer(layer);
        });
map.on(L.Draw.Event.CREATED, function (e) {
		var type = e.layerType,
			layer = e.layer;
		if (type === 'marker') {
			console.log(layer.getLatLng());
		}
// Do whatever else you need to. (save to db; add to map etc)
map.addLayer(layer);
});
    
// Distance measuremetn script
var point1=0;
var distance1=0;
var marker = null;
var line = L.polyline([]).addTo(map);
function measure(){
        map.on('click', function(e){
            var point = {lat: e.latlng.lat, lng: e.latlng.lng};
            if(!marker) {
                marker = L.marker(point).addTo(map);
                point1 = point;
            }
        line.addLatLng(point);

        var from = turf.point([point1.lat,point1.lng]);
        var to = turf.point([point.lat,point.lng]);
        var options = {units: 'kilometers'};
        var distance = turf.distance(from, to, options);
        console.log(distance1+distance + ' kilometers');
        distance1 = distance1 + distance;
        point1=point;
 
        });
         
    }

// Sidebar js script
var sidebar = L.control.sidebar({ container: 'sidebar' })
            .addTo(map)
            .open('home');
        // add panels dynamically to the sidebar
        sidebar
            .addPanel({
                id:   'js-api',
                tab:  '<i class="fa fa-gear"></i>',
                title: 'JS API',
                pane: '<p>The Javascript API allows to dynamically create or modify the panel state.<p/><p><button onclick="sidebar.enablePanel(\'mail\')">enable mails panel</button><button onclick="sidebar.disablePanel(\'mail\')">disable mails panel</button></p><p><button onclick="addUser()">add user</button></p><p><button onclick="userLocation()">Get Location</button></p>',
            })
            // add a tab with a click callback, initially disabled
            .addPanel({
                id:   'mail',
                tab:  '<i class="fa fa-envelope"></i>',
                title: 'Messages',
                button: function() { alert('opened via JS callback') },
                disabled: true,
            })

        // be notified when a panel is opened
        sidebar.on('content', function (ev) {
            switch (ev.id) {
                case 'autopan':
                sidebar.options.autopan = true;
                break;
                default:
                sidebar.options.autopan = false;
            }
        });

        var userid = 0
        function addUser() {
            sidebar.addPanel({
                id:   'user' + userid++,
                tab:  '<i class="fa fa-user"></i>',
                title: 'User Profile ' + userid,
                pane: '<p>user ipsum dolor sit amet</p>',
            });
        }