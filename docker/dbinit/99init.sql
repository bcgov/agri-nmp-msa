create extension postgis;

create table page_customization (
	id serial primary key,
 	sidebar_markup text,
	arm_link varchar(255) not null default 'http://example/?24={24}&72={72}',
	enable_weather_link boolean not null default false
	);

insert into page_customization (sidebar_markup) values ('Docker environment');  

create table runlogs (
	id serial primary key,
	run_start timestamp without time zone not null,
	run_finish timestamp without time zone not null,
	groups_updated integer null,
	error_count integer null,
	remarks text null);  

create table forecast (
	precipgrp smallint not null,
	rain numeric(7,3) not null default 0,
	snow numeric(7,3) not null default 0,
	valid_for date not null,
	retrieved_at timestamp without time zone not null default now(),
	next24 numeric(7,3) null,
	next72 numeric(7,3) null,
	risk smallint null); 

create table station_points (
	gid serial,
	precipgrp smallint,
	longitude numeric,
	latitude numeric,
	userlink varchar(250),
	wdrgnd_xml varchar(250),
	geobaseid bigint,
	geom geometry(Point)
);

create table precip_groups (
	gid serial,
	precipgrp smallint,
	userlink varchar(250),
	wdrgnd_xml varchar(250),
	geom geometry(MultiPolygon));

create table archived_forecasts (
	precipgrp smallint not null,
	for_date date not null,
	archived_at timestamp without time zone not null default now(),
	next24 numeric(7,3) null,
	next72 numeric(7,3) null,
	risk smallint null); 

insert into precip_groups (precipgrp, userlink, wdrgnd_xml, geom) values (2019, 'https://www.wunderground.com/cgi-bin/findweather/hdfForecast?query=49.0901,-123.0820', 'http://api.wunderground.com/api/24966f01708b238b/forecast10day/q/Canada/pws:IBCRICHM2.xml', '0106000000010000000103000000010000001E0000004F1E3A8648BE5EC042CC57153F95484001CEE6DE68BE5EC0533813E228954840F76AB60840BF5EC07E738DC78C944840DDC6CC741CC05EC01F5C89AC88934840215BBA692BC25EC02BFA070ECD924840896C25091AC35EC00CB87651B491484043ED9253C4C35EC0C652EE68859048409BCB2A608FC45EC067AB47BED08F484060D2BF374CC55EC0F00F051B448F4840EF8F6BC2D5C55EC0B5FEC75AE48E4840DAC6FAA84BC75EC0B10689B7A38F4840AA305F5ACEC95EC0F2FF533D87914840A96E4E2CC0CB5EC0CED76ACA2493484009F2300517CD5EC00556966C39954840B596B33584CD5EC0C15BC5CF08994840E45AD39276CD5EC0DF4DC3FF899B48405264FC3FB7CF5EC0FD000058C19F484026E0764961CE5EC05698E8ADAA9E4840AF45EBF6D2CB5EC07F9036C8849D48403FA7F77B44CA5EC09A3FBF73D09B484007D5DEC27FC85EC0FFB7E9FAA19A484074E4B5ED52C75EC086EFFA65D39A4840168169C150C65EC06BAE4A3CF09A4840A95082C786C55EC0FC371653D29A4840452014E472C45EC0DD90CEFB589A4840ACFE59B022C35EC0DE2EA2F45D9948406ED2AFED69C05EC0D23FFDDD249848408DA4F70C9EBF5EC0ED964482A89748404669816904BF5EC0DDE3D521D79548404F1E3A8648BE5EC042CC57153F954840');

insert into station_points (precipgrp, latitude, longitude, geom) values (2019,  -123.147512115,  49.1885902544, '0101000000BF30007407963041E6036A6E909E2841');

