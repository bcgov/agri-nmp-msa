        /*=========================================
        ==========================================
        ==
        == GLOBALS
        ==
        ==========================================
        ==========================================*/
        
        var map;
        var popup;
        var xPixel = null;
        var yPixel = null;

        /*
        **
        **
        ** parses our GetFeatureInfo for the precipgrp id
        **
        */
        function setHTML(response) {
            //console.log( response );
            if (popup != null) {

                map.removePopup(popup);
                popup = null;

            }

            popupPixel = new OpenLayers.Pixel(50, 50);

            }

            /*
            **
            ** calls on JS in the bc_tableConstructor.js 
            ** file to build popup table
            ** then makes popup appear at popupPixel point
            **
            */
            function setPopupHTML(response) {
                if (popup != null) {

                    map.removePopup(popup);
                    popup = null;

                }

                /*
                **
                ** we are setting globally here cause
                ** we don't event object to grab xy from
                ** since we are using .loadUrl calls
                **
                */
                popupPixel = new OpenLayers.Pixel(xPixel, yPixel);
                if (response.payload == undefined ) return;

                var table = buildPopupTable(response); // call to tableConstructor here
                //console.log( table );

                popup = new OpenLayers.Popup.FramedCloud(
                    "info", 
                    map.getLonLatFromPixel(popupPixel), 
                    new OpenLayers.Size(350, 300), 
                    table,
                    null, 
                    true
                );
                popup.panMapIfOutOfView = true;
                map.addPopup(popup);
            }


        /*=========================================
        ==========================================
        ==
        == BODY LOAD > INIT
        ==
        ==========================================
        ==========================================*/


        function init2() {
              // Map is in mercator this time
              // so over-ride the defaultoptions that assume lat/lon.
              var options = {
                  projection: new OpenLayers.Projection("EPSG:900913"),
                  displayProjection: new OpenLayers.Projection("EPSG:4326"),
                  units: "m",
                  numZoomLevels: 20,
                  maxResolution: 156543.0339,
                  maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                      20037508, 20037508.34)
              };

              // Create the map object
              map = new OpenLayers.Map('map', options);

              // Layers
	      /*
              var gmap = new OpenLayers.Layer.Google(
                  "Google Streets", // the default
                  {'sphericalMercator': true, numZoomLevels: 20}
              );
              var gsat = new OpenLayers.Layer.Google(
                      "Google Satellite",
                      {type: google.maps.MapTypeId.SATELLITE, 
                      'sphericalMercator': true, numZoomLevels: 20}
                  );
	      */
              var gmap = new OpenLayers.Layer.OSM("OpenStreetMap",
                  ["https://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                   "https://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                   "https://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]);


              var watershed = new OpenLayers.Layer.WMS(
                   "MSA-Forecast-Map",
                   "/cgi-bin/mapserv?map=/srv/www/mapfiles/bc_precip.map", 
                   {'layers': 'precipgroups_msa', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true, buffer: 0, singleTile:true}
                
              );
              var watershed_outlines = new OpenLayers.Layer.WMS(
                   "MSA-Forecast-Map-Outlines",
                   "/cgi-bin/mapserv?map=/srv/www/mapfiles/bc_precip.map", 
                   {'layers': 'precipgroups_msa_outlines', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true, buffer: 0, singleTile:true}
                
              );
              //watershed.mergeNewParams( {'SLD' : 'http://li431-222.members.linode.com/whatcom_msa/media/sld/msa.xml'} );
              
                
              map.addLayers([gmap, watershed, watershed_outlines]);
              map.addControl(new OpenLayers.Control.LayerSwitcher());
              // Coordinate display at bottom of map
              //map.addControl(new OpenLayers.Control.MousePosition());
              var point = new OpenLayers.LonLat(-122.6,48.9); 
              // Need to convert zoom point to mercator too
              point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
                        
              map.setCenter(point, 9); 

              var roundVal = function (val){
                var dec = 3;
                var result = Math.round(val*Math.pow(10,dec))/Math.pow(10,dec);
                return result;
              };

              map.events.register('click', map, function (e) {
                /*
                ** used globally to reset popup
                */
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
               
                $.getJSON("/bc_msa/myapp_bc", paramHash, setPopupHTML);
                OpenLayers.Event.stop(e);
               });

               // after load, make sure attribution is hidden
               setTimeout( function() {
                    $( "div[id^='OpenLayers.Control.Attribution_']" ).css( "display", "none" );
               }, 1000 );

         }



