 <html lang="en">
<head>
	 <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
    <title>Manure Spreading Advisory</title>
    <script src="/whatcom_msa/media/js/leaflet/leaflet.js" type="text/javascript"></script>
    <script src="/whatcom_msa/media/js/jquery.min.js" type="text/javascript"></script>
    <script src="/bc_msa/media/js/bc_tableConstructor.js" type="text/javascript"></script>  
    <link rel="stylesheet" href="/whatcom_msa/media/js/leaflet/leaflet.css"" />
    <style type="text/css">
        body {
            padding: 0;
            margin: 0;
        }
        html, body, #map {
            height: 100%;
            width: 100%;
        }
	      #msa_legend{
	          position:absolute; 
	          right:10px; 
	          bottom:10px; 
	          z-index:10000; 
	          width:130px; 
	          height:130px; 
	          background-color:#EFEFEF;
	      }
	      #msa_legend p {
            font-size:0.7em;
	      }
    </style>
</head>
  <body>
    <div id="map" class="map"></div> 
    <div id="popup" class="ol-popup">
    <div id="msa_legend">
			<strong>Legend</strong>
			<img src="/bc_msa/media/img/msa_legend.png" />
			<p> * Data provided by NOAA</p>      
		</div>
    <script>
    
    // get geojson data via postgres query
    <?php include 'get_bc_msa.php'; ?>

        var table ='';
        var map = L.map('map').setView([49, -123], 9); 
        // lon: -13702229.550665, lat: 5475697.4235527 
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        var osm_layer = new L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);  
        map.addLayer(osm_layer); 
        
        
        
        function getContentWhenClicked(e) {
          var paramHash =  {
            LNG : e.latlng.lng , 
            LAT : e.latlng.lat
          }; 
          var loading = '<div><h3>Loading - wait a second ...</h3><div/>'; 
          var popLocation= e.latlng;
          var popup = L.popup() 
          .setLatLng(popLocation)
          .setContent(loading)
          // popup.update();
          .openOn(map)
          $.getJSON("/bc_msa/myapp_bc", paramHash, setPopupHTML).done(function(data) {                  
          var popup = L.popup() 
          .setLatLng(popLocation)
          .setContent(table)
          // popup.update();
          .openOn(map)
          });     	

        }
        
        function createPopupContent(feature, layer) {
            //bind click
            layer.on({
                click: getContentWhenClicked
            });
        }
       
        low_style       = { weight: 0.6,  opacity: 0.7,  color: '#848484', fillOpacity: 0.3, fillColor: '#00FF00' };
        med_style       = { weight: 0.6,  opacity: 0.7,  color: '#848484', fillOpacity: 0.3, fillColor: '#E1F505' };
        med_high_style  = { weight: 0.6,  opacity: 0.7,  color: '#848484', fillOpacity: 0.3, fillColor: '#ff9900' };
        high_style      = { weight: 0.6,  opacity: 0.7,  color: '#848484', fillOpacity: 0.3, fillColor: '#FF0303' };
             

        var bc_msa_json = L.geoJSON(or_latest, {style:   function (feature) {
          switch(feature.properties.runoff_risk){
              case "Low":       return low_style;      break;
              case "Med":       return med_style;      break;
              case "Med-High":  return med_high_style; break;
              case "High":      return high_style;     break;
          }
        },onEachFeature: createPopupContent        
        }).addTo(map);

        
    var baseLayers = {
      "OSM": osm_layer
    };

    var realLayers = {
        "BC MSA": bc_msa_json
    };
    L.control.layers(baseLayers,realLayers).addTo(map);        
    
    function style(feature) {
       switch(feature.properties.RUNOFF_RIS){
           case "Low":       return low_style;      break;
           case "Med":       return med_style;      break;
           case "Med-High":  return med_high_style; break;
           case "High":      return high_style;     break;
       }
    }

    function setPopupHTML(response) {
        if (response.payload == undefined ) {
        	table = 'no data returned';
        	return;      
        }
        table = buildPopupTable(response); // call to tableConstructor here
    }
    
    </script>		
		
  </body>
  
</html>

