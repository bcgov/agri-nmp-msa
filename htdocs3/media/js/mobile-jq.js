// Start with the map page
window.location.replace(window.location.href.split("#")[0] + "#mappage");

var selectedFeature = null;

// fix height of content
function fixContentHeight() {
    var footer = $("div[data-role='footer']:visible"),
        content = $("div[data-role='content']:visible:visible"),
        viewHeight = $(window).height(),
        contentHeight = viewHeight - footer.outerHeight();

    if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
        contentHeight -= (content.outerHeight() - content.height() + 1);
        content.height(contentHeight);
    }

    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    } else {
        // initialize map
        init(

            function( response ) { 
                /*  
                **  
                ** we are setting globally here cause
                ** we don't event object to grab xy from
                ** since we are using .loadUrl calls
                **  
                */  
                popupPixel = new OpenLayers.Pixel(xPixel, yPixel);
                if (response.payload == undefined ) return;

                //var table = buildPopupTable(response); // call to tableConstructor here
                selectedData = response;
                $.mobile.changePage("#popup", "pop"); 
            }
    
        );
        initLayerList();
    }
}

// one-time initialisation of button handlers 

$("#plus").live('click', function(){
    map.zoomIn();
});

$("#minus").live('click', function(){
    map.zoomOut();
});

$("#locate").live('click',function(){
    var control = map.getControlsBy("id", "locate-control")[0];
    if (control.active) {
        control.getCurrentLocation();
    } else {
        control.activate();
    }
});

//fix the content height AFTER jQuery Mobile has rendered the map page
$('#mappage').live('pageshow',function (){
    fixContentHeight();
});
    
$(window).bind("orientationchange resize pageshow", fixContentHeight);



$('#popup').live('pageshow',function(event, ui){

    var li = "";
    
    /*
    **
    ** header records
    **
    */
    for( var i = 0; i < selectedData.header.length; i ++ ){
        if ( i == 0 ) {
            li += "<li><div style='width:25%;float:left'>Precip Group:</div><div style='width:75%;float:right'>" 
            + selectedData.header[ i ] + "</div></li>";
        }
        else if ( i == 1 ){
            li += "<li><div style='width:25%;float:left'>RunOff Risk:</div><div style='width:75%;float:right'>" 
            + selectedData.header[ i ] + "</div></li>";
        }
        else if ( i == 2 ){
            li += "<li><div style='width:25%;float:left'>Advisory Date:</div><div style='width:75%;float:right'>" 
            + selectedData.header[ i ] + "</div></li>";
        }
        else if ( i == 3 ){
            li += "<li><div style='width:25%;float:left'>NOAA URL:</div><div style='width:75%;float:right'><a href="
            + selectedData.header[ i ] + ">Weather Link</a></div></li>";
        }
    }

    /*
    **
    ** column names for forecast records
    **
    */
    /*
    if ( selectedData.payload.length > 0  ) {
        li += "<li><div style='width:25%;float:left'>Date</div>" + 
              "<div style='width:25%;float:left'>24hr Forecast (inch)</div>" + 
              "<div style='width:25%;float:left'>74hr Forecast (inch)</div>" +
              "<div style='width:25%;float:left'>Risk</div></li>"; 
    }
    */
    /*
    **
    ** forecast records
    **
    */
    /*
    for( var i = 0; i < selectedData.payload.length; i ++ ){
            li += "<li>";
            $.each( selectedData.payload[i], function( indx, rec ) {

                li += "<div style='width:10%;float:left'></div>";

            });
            li += "</li>";
    }
    */
    
    $("ul#details-list").empty().append(li).listview("refresh");
    var table = buildPopupTable( selectedData );
    $("ul#details-list").append(table).listview("refresh");

    selectedData = null;
});

/*
$('#searchpage').live('pageshow',function(event, ui){
    $('#query').bind('change', function(e){
        $('#search_results').empty();
        if ($('#query')[0].value === '') {
            return;
        }
        $.mobile.showPageLoadingMsg();

        // Prevent form send
        e.preventDefault();

        var searchUrl = 'http://ws.geonames.org/searchJSON?featureClass=P&maxRows=10';
        searchUrl += '&name_startsWith=' + $('#query')[0].value;
        $.getJSON(searchUrl, function(data) {
            $.each(data.geonames, function() {
                var place = this;
                $('<li>')
                    .hide()
                    .append($('<h2 />', {
                        text: place.name
                    }))
                    .append($('<p />', {
                        html: '<b>' + place.countryName + '</b> ' + place.fcodeName
                    }))
                    .appendTo('#search_results')
                    .click(function() {
                        $.mobile.changePage('#mappage');
                        var lonlat = new OpenLayers.LonLat(place.lng, place.lat);
                        map.setCenter(lonlat.transform(gg, sm), 10);
                    })
                    .show();
            });
            $('#search_results').listview('refresh');
            $.mobile.hidePageLoadingMsg();
        });
    });
    // only listen to the first event triggered
    $('#searchpage').die('pageshow', arguments.callee);
});

*/


function initLayerList() {
    $('#layerspage').page();
    $('<li>', {
            "data-role": "list-divider",
            text: "Base Layers"
        })
        .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        addLayerToList(this);
    });

    $('<li>', {
            "data-role": "list-divider",
            text: "Overlay Layers"
        })
        .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        addLayerToList(this);
    });
    $('#layerslist').listview('refresh');
    
    map.events.register("addlayer", this, function(e) {
        addLayerToList(e.layer);
    });
}

function addLayerToList(layer) {
    var item = $('<li>', {
            "data-icon": "check",
            "class": layer.visibility ? "checked" : ""
        })
        .append($('<a />', {
            text: layer.name
        })
            .click(function() {
                $.mobile.changePage('#mappage');
                if (layer.isBaseLayer) {
                    layer.map.setBaseLayer(layer);
                } else {
                    layer.setVisibility(!layer.getVisibility());
                }
            })
        )
        .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function() {
            $(item).toggleClass('checked');
        }
    });
}

