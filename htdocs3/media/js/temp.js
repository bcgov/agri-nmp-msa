                  maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                      20037508, 20037508.34)
              };

              // Create the map object
              map = new OpenLayers.Map('map', options);

              // Layers
              var gmap = new OpenLayers.Layer.Google(
                  "Google Streets", // the default
                  {'sphericalMercator': true, numZoomLevels: 20}
              );
              var gsat = new OpenLayers.Layer.Google(
                      "Google Satellite",
                      {type: google.maps.MapTypeId.SATELLITE,
                      'sphericalMercator': true, numZoomLevels: 20}
                  );

              var watershed = new OpenLayers.Layer.WMS(
                   "MSA-Forecast-Map",
                   "http://50.116.5.222/cgi-bin/mapserv?map=/srv/www/mapfiles/oregon_precip.map",
                   {'layers': 'precipgroups_msa', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true  }

              );
              var watershed_outlines = new OpenLayers.Layer.WMS(
                   "MSA-Forecast-Map-Outlines",
                   "http://50.116.5.222/cgi-bin/mapserv?map=/srv/www/mapfiles/oregon_precip.map",
                   {'layers': 'precipgroups_msa_outlines', 'format':'image/png', 'transparent':'true'},
                   {'opacity': 1.0, 'isBaseLayer': false, 'visibility': true  }

              );
              //watershed.mergeNewParams( {'SLD' : 'http://li431-222.members.linode.com/whatcom_msa/media/sld/msa.xml'} );


              map.addLayers([gmap, gsat, watershed, watershed_outlines]);
              map.addControl(new OpenLayers.Control.LayerSwitcher());
              // Coordinate display at bottom of map
              //map.addControl(new OpenLayers.Control.MousePosition());
              var point = new OpenLayers.LonLat(-123.0892223359,44.066231736);
              // Need to convert zoom point to mercator too
              point.transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());

