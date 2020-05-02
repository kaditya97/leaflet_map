var map = L.map('map').setView([27.25, 84.11], 5);
var scale = L.control.scale().addTo(map);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map),
  OpenTopoMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  ),
  Stamen_Watercolor = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
    {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abcd",
      minZoom: 1,
      maxZoom: 19,
      ext: "jpg",
    }
  ),
  CartoDB_DarkMatter = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  ),
    esri =  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy ESRI'
    });
    baseLayer = {
        "Open Street Map": osm,
        "Open Topo Map": OpenTopoMap,
        "Stamen Water color": Stamen_Watercolor,
        "Dark matter": CartoDB_DarkMatter,
        "Esri": esri,
      };


L.control.mousePosition().addTo(map);

var osmGeocoder = new L.Control.OSMGeocoder({
    collapsed: false, /* Whether its collapsed or not */
    position: 'topright', /* The position of the control */
    text: 'Search', /* The text of the submit button */
    placeholder: 'Search Places', /* The text of the search input placeholder */
    bounds: null, /* a L.LatLngBounds object to limit the results to */
    email: null, /* an email string with a contact to provide to Nominatim. Useful if you are doing lots of queries */
});
map.addControl(osmGeocoder);

L.control.layers(baseLayer).addTo(map);
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
     	// position: 'topright',
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
            var cord = layer.getLatLng().toString();
			layer.bindPopup(cord).openPopup();
		}
// Do whatever else you need to. (save to db; add to map etc)
map.addLayer(layer);
});


L.easyButton('fa-crosshairs fa-lg', function(){
    userLocation();
}).addTo(map);

function fullScreen() {
    let e = document,
      t = e.documentElement;
    t.requestFullscreen
      ? e.fullscreenElement
        ? e.exitFullscreen()
        : t.requestFullscreen()
      : t.mozRequestFullScreen
      ? e.mozFullScreen
        ? e.mozCancelFullScreen()
        : t.mozRequestFullScreen()
      : t.msRequestFullscreen
      ? e.msFullscreenElement
        ? e.msExitFullscreen()
        : t.msRequestFullscreen()
      : t.webkitRequestFullscreen
      ? e.webkitIsFullscreen
        ? e.webkitCancelFullscreen()
        : t.webkitRequestFullscreen()
      : console.log("Fullscreen support not detected.");
  }

    var stateChangingButton = L.easyButton({
        states: [{
                stateName: 'expand',        // name the state
                icon:      'fa fa-expand fa-lg',       // and define its properties
                title:     'Full Screen',      // like its title
                onClick: function(btn) {       // and its callback
                    fullScreen();
                    btn.state('collapse');    // change state on click!
                }
            }, {
                stateName: 'collapse',
                icon:      'fa fa-compress fa-lg',
                title:     'Minimize',
                onClick: function(btn) {
                    fullScreen();
                    btn.state('expand');
                }
        }]
    });

stateChangingButton.addTo(map);

L.control.browserPrint({
      title: "Print current Layer",
      documentTitle: "My Map",
      printModes: [
        L.control.browserPrint.mode.landscape("Tabloid VIEW", "Tabloid"),
        L.control.browserPrint.mode.landscape(),
        "PORTrait",
        L.control.browserPrint.mode.auto("Auto", "B4"),
        L.control.browserPrint.mode.custom("Selected area", "B5"),
      ],
      manualMode: !1,
      closePopupsOnPrint: !0,
    }).addTo(map);