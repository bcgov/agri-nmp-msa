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
                  ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
                   "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
                   "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]);


              var watershed = new OpenLayers.Layer.WMS(
                   "OSS-Whatcom",
                   "/cgi-bin/mapserv?map=/srv/www/mapfiles/oss_whatcom.map", 
                   {'layers': 'OSS-Whatcom', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': false }
                
              );
	      var cgi_layer = new OpenLayers.Layer.WMS(
                   "OSS-Whatcom-CGI",
                   "/cgi-bin/mapserv_oss.cgi", 
                   {'layers': 'OSS-Whatcom', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true  }
                
              );

              //watershed.mergeNewParams( {'SLD' : 'http://li431-222.members.linode.com/whatcom_msa/media/sld/msa.xml'} );
              
                
              map.addLayers([gmap, gsat, watershed,cgi_layer]);
              map.addControl(new OpenLayers.Control.LayerSwitcher());
              // Coordinate display at bottom of map
              //map.addControl(new OpenLayers.Control.MousePosition());
              var point = new OpenLayers.LonLat(-122.44103,47.68606); 
              // Need to convert zoom point to mercator too
              point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
                        
              map.setCenter(point, 8); 

              var roundVal = function (val){
                var dec = 3;
                var result = Math.round(val*Math.pow(10,dec))/Math.pow(10,dec);
                return result;
              };

         }



