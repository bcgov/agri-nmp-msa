var css4Table = '<style type="text/css"> '+
'table, th, td { ' +
'border:2px solid #e5e5e5; '+
'border-collapse:collapse; '+
'font-family: arial;'+
'font-size: 90%;' + 
'color: #333333 }'+
''+
'th, td {'+
'valign: top; '+
'text-align: center; }'+
''+
'th { '+
'background-color: #aed7ff }'+
''+
'caption { '+
'border:1px solid #e5e5e5;'+
'border-collapse:collapse;'+
'font-family: arial;'+
'font-weight: bold;'+
'font-size: 90%;'+
'text-align: left;'+
'color: #333333;}'+
'</style>'
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function buildPopupTable(data){
        var $tableStart = $( "<div>" + 
        "<div class=header><p></p></div>" +
        css4Table + 
        "<table><tbody></tbody></table>" + 
	"</div>"
	);
	/*
        var $tableStart = $( "<div>" + 
        css4Table + 
        "<table><tbody></tbody></table>" + 
	"</div>"
	);
	*/

        //data = $.parseJSON(data);

        // convert date format from 	"2016-01-16" YYYY-MM-DD TO "01/16/16" mm/dd/yy
        // and get setback  
        setbackarray = [["01" ,"80"],["01" ,"80"],["02" ,"80"],["03" ,"40"],["04" ,"40"],["05" ,"40/10"],["06" ,"10"],["07" ,"10"],["08" ,"10"],["09" ,"40"],["10","80"],["11","80"],["12","80"]];
        var datearray = data.header[2].split("-");
        if (datearray.length > 1){
        	  if (datearray[0].length == 4){
        	  	 datearray[0]= datearray[0].substr(2, 2);
        	  }
            data.header[2] = datearray[1] +"/"+datearray[2] +"/"+datearray[0];
            // get setback  
            var setback = setbackarray[datearray[1][1]];
        }


        // headers
        var tRow = "<tr>";
        $.each(["Date", "24hr Prediction<br>Forcast (mm)",
                "72hr Prediction<br>Forcast (mm)", "Risk", "ARM Worksheet"],
        function(indx, header){
                tRow += "<th>" +header+ "</th>";
        });
        tRow += "</tr>";
        $tableStart.find('tbody').append($(tRow));
        //console.log("table just headers");
        //console.log($tableStart);
        
        // rows
        if (data.payload != undefined){
          if (data.header != undefined){
            $tableStart.find('.header p').append("Precipitation Group: "+data.header[0]+"</br>");
            $tableStart.find('.header p').append("Runoff Risk: "+data.header[1]+"</br>");
            $tableStart.find('.header p').append("Advisory Date: "+data.header[2]+"</br>");
            $tableStart.find('.header p').append("<a href=\""+data.header[3]+"\" target=\"_blank\">OpenWeatherMap Link</a></br>");
            $tableStart.find('.header p').append("<a href=\""+data.header[3]+"\" target=\"_blank\"> <img src=\"bc_msa/media/img/OpenWeatherMapLogo.png\" alt=\"OpenWeatherMap Logo\" height=\"50\" width=\"116\"> </a></br>");
          }	

          if(data.payload.length > 0 ){
            $.each(data.payload, function(indx, rec) {
            	  // convert date format from 	"2016-01-16" YYYY-MM-DD TO "01/16/16" mm/dd/yy
            	  var datearray = rec[0].split("-");
            	  if (datearray.length > 1){
            	  	  if (datearray[0].length == 4){
            	  	  	 datearray[0]= datearray[0].substr(2, 2);
            	  	  }
            	      rec[0] = datearray[1] +"/"+datearray[2] +"/"+datearray[0];
            	  }
            	  // replace 9999 with NA
            	  if (rec[2] == 9999 ){ rec[2] = "N/A"};
            	  
                var tRow = "<tr>";
                $.each(rec, function(indx, cell) {
                    if ( cell === 'Low' ) {
                        tRow += "<td bgcolor=#00FF00 style='opacity:0.7;'>" +cell+ "</td>";
                    } else if ( cell === 'Med' ) {
                        tRow += "<td bgcolor=#E1F505 style='opacity:0.7;'>" +cell+ "</td>";
                    } else if ( cell === 'Med-High' ) {
                        tRow += "<td bgcolor=#ff9900 style='opacity:0.7;'>" +cell+ "</td>";
                    } else if ( cell === 'High' ) {
                        tRow += "<td bgcolor=#FF0303 style='opacity:0.7;'>" +cell+ "</td>";
                    } else {
                        // test if numeric then multiply inches of rinfall to mm * 25.4
                        if (isNumeric(cell)){
                           cell_mm = Math.round(cell); // cm to mm
                           tRow += "<td>" +cell_mm+ "</td>";
                        }
                        else {
                            tRow += "<td>" +cell+ "</td>";
                        }
                    } 
                    
                });
                // create ARM Worksheet Cells BUT ONL for 3 days with link to Field Risk Assessment
                if (indx <= 2) {
                    tRow += "<td>" + "<a target='_blank' href='" + "https://arm-web-agri-nmp-prod.pathfinder.gov.bc.ca/?24=" + rec[1] + "&" + "72=" + rec[2] + "'>Field Risk Assessment</a> </td>";
                }
                else {
                    tRow += "<td>N/A</td>";    
                }
                tRow += "</tr>";
                $tableStart.find('tbody').append($(tRow));
                //console.log("table 1");
                //console.log($tableStart);
            });
          }
        }
        
        return $tableStart.html();
}


