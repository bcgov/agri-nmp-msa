<?php
$DB_HOST = getenv('DATABASE_HOST');
$DB_USER = getenv('POSTGRES_USER');
$DB_PASS = getenv('POSTGRES_PASSWORD');
$DB_BASE = getenv('POSTGRES_DB');
$DB_PORT = getenv('DATABASE_PORT');

// connect to the DB port 5433
$dbconn = pg_connect("host=$DB_HOST dbname=$DB_BASE user=$DB_USER password=$DB_PASS port=$DB_PORT application_name=mapserver_precipgroup_msa");

// use pg query params 
$queryresult = pg_query($dbconn, " SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ( SELECT 'Feature' As type, row_to_json((SELECT l FROM (SELECT runoff_risk, precipgrp) As l )) As properties, ST_AsGeoJSON(geom)::json As geometry FROM (select geom, runoff_risk, precipgrp from bc_msa_latest order by precipgrp asc) As lg  ) As f )  As fc;") ;

$queryvalues = pg_fetch_row($queryresult);
$x = $queryvalues[0];

$x = str_replace('f3','geometry',$x);
$x = str_replace('f1','type',$x);
$x = str_replace('f2','properties',$x);


echo 'var or_latest'.$n.' = '. is_null($x) ? '""' : $x ."; ";  

?>
