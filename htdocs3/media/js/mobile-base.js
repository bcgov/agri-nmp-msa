// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");
var center_point = new OpenLayers.LonLat(-122.6,48.9);
var xPixel = null;
var yPixel = null;
var selectedData = null;
     
var init = function (onSelectFeatureFunction) {

    var watershed_outline = new OpenLayers.Layer.WMS(
       "MSA Risk Polygons",
       "/cgi-bin/mapserv?map=/srv/www/mapfiles/bc_precip.map",
                   {'layers': 'precipgroups_msa_outlines', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true, buffer: 0, singleTile:true  }


    ); 

    var watershed = new OpenLayers.Layer.WMS(
       "MSA Risk Outlines",
       "/cgi-bin/mapserv?map=/srv/www/mapfiles/bc_precip.map", 
                   {'layers': 'precipgroups_msa', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true, buffer: 0, singleTile:true  }
    ); 

    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });
    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: sm,
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            geolocate,
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Road",
                // custom metadata parameter to request the new map style - only useful
                // before May 1st, 2011
                metadataParams: {
                    mapVersion: "v1"
                },
                name: "Bing Road",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Aerial",
                name: "Bing Aerial",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "AerialWithLabels",
                name: "Bing Aerial + Labels",
                transitionEffect: 'resize'
            }),
            watershed,
            watershed_outline
        ],
        center: center_point.transform( new OpenLayers.Projection("EPSG:4326"), sm ),
        zoom: 9
    });

    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };

    geolocate.events.register("locationupdated", this, function(e) {
        return
    });

    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },
        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, 
                this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, 
                arguments
            );
            this.handler = new OpenLayers.Handler.Click(
                this, 
                { 'click': this.trigger }, 
                this.handlerOptions
            );
        }
    });

    var clickHandler = new OpenLayers.Control.Click( { trigger: function( e ) {

        xPixel = e.xy.x;
        yPixel = e.xy.y;

        var ll = new OpenLayers.Pixel(e.xy.x, e.xy.y);
        var min_ll = map.getLonLatFromPixel(ll);
        min_ll.transform(
                map.getProjectionObject(),
                new OpenLayers.Projection("EPSG:4326")
        );  


        var paramHash =  {
          LNG : min_ll.lon , 
          LAT : min_ll.lat
        };  

        $.getJSON("/bc_msa/myapp_bc", paramHash, onSelectFeatureFunction );
        OpenLayers.Event.stop(e);


    }});
    map.addControl(clickHandler);
    clickHandler.activate();


    /*
    map.events.register('click', map, function (e) {
        xPixel = e.xy.x;
        yPixel = e.xy.y;

        var ll = new OpenLayers.Pixel(e.xy.x, e.xy.y);
        var min_ll = map.getLonLatFromPixel(ll);
        min_ll.transform(
                map.getProjectionObject(),
                new OpenLayers.Projection("EPSG:4326")
        );  


        var paramHash =  {
          LNG : min_ll.lon , 
          LAT : min_ll.lat
        };  

        $.getJSON("/bc_msa/myapp_bc", paramHash, onSelectFeatureFunction );
        OpenLayers.Event.stop(e);
    }); 
    */

};

