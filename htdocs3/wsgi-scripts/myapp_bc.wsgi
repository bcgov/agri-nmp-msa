import psycopg2
from decimal import *
import string, os, sys
import httplib, urllib2, re, socket
from cgi import parse_qs
import urlparse
from pprint import pformat
import json
import traceback, datetime

'''
      Column       |            Type             | Modifiers 
-------------------+-----------------------------+-----------
 precipgrp         | smallint                    | 
 predict_date_sort | date                        | 
 runoff_risk       | text                        | 
 tot72hour         | numeric                     | 
 date_retrieved    | timestamp without time zone | 
 userlink          | character varying(254)      | 
 geom              | geometry    

'''


class GetPostgresData:
	
	def __init__(self, application):
		self.__application = application
		self.logger = None
		self.conn = None
		self.connectionParams = None
		self.forecastSQL = """SELECT weather_data.predict_date, weather_data.prediction, \
			weather_data.tot72hour,  weather_data.runoff_risk \
			FROM weather_data_bc weather_data \
			WHERE to_date((to_char(date_retrieved, 'YYYY-MM-DD')), 'YYYY-MM-DD') = CURRENT_DATE  \
			and precipgrp = %s ORDER BY weather_data.predict_date ASC"""
		self.precipSQL = """SELECT precipgrp, runoff_risk, predict_date_sort, userlink \
			FROM bc_msa_latest \
			WHERE ST_Intersects( geom, 'POINT(%s %s)'::geometry )"""

	def __runQuery__( self, sql, listParam=None ):
		try:
			self.conn = psycopg2.connect(self.connectionParams)
			crs = self.conn.cursor()
			if listParam:
				crs.execute( sql, tuple(listParam) )
			else:
				crs.execute( sql )
			return crs.fetchall()
		except Exception, e:
			print >> self.logger, "".join(traceback.format_tb(sys.exc_info()[2]))
		finally:
			self.conn.close()

	def __callbackFormat__(self, data):
		getcontext().prec = 3
		if isinstance(data, Decimal):
			return round(float(data),3)

		elif isinstance(data, datetime.date):
			try:
				x =  string.split(datetime.datetime.strftime(data, '%Y-%m-%d %H:%M:%S'), ' ')[0]
				return x
			except Exception, e:
				print >> self.logger, "".join(traceback.format_tb(sys.exc_info()[2]))
		else:
			return data

    	def __formatDataResponse__(self, records, precipgrp):
		returns = { 'payload' : [], 'header': [] }
		#
		#  add header information
		#
		headers = map( self.__callbackFormat__, [precipgrp[0][0], precipgrp[0][1], precipgrp[0][2], precipgrp[0][3]] )
		for head in headers:
		    returns['header'].append( head )
		for rec in records:
		    formatted = map(self.__callbackFormat__, rec)		
		    #print >> self.logger, "formatted = %s" % str(formatted)
		    returns.get('payload').append(list(formatted))
		    print >> self.logger, "final object = %s" % str(returns)
		return json.dumps(returns)

    
	def __call__(self, environ, start_response):
		self.logger = environ['wsgi.errors']

		#
		# MSA config
		#
		msadbname = str(environ.get( 'MSADBNAME', None ))
		msadbuser = str(environ.get( 'MSADBUSER', None ))
		msadbpass = str(environ.get( 'MSADBPASS', None ))
		params = "dbname=%s user=%s password=%s host=localhost" % ( msadbname, msadbuser, msadbpass )
		self.connectionParams = params

		#
		# setup response
		#
		status = '200 OK'
		response_headers = [('Content-type', 'application/json'),]
		output = None

		#
		# parse GET params
		#
		#print >> environ['wsgi.errors'], "QUERY STRING : %s" % environ['QUERY_STRING']
		query_params=dict((k.upper(), v) for k, v in parse_qs(environ['QUERY_STRING']).iteritems())	
		#print >> environ['wsgi.errors'], "QUERY PARAMS : %s" % str(query_params)

		#
		# args to run query on
		#
		lng = query_params.get('LNG', None)
		lat = query_params.get('LAT', None)
		#print >> environ['wsgi.errors'], "LAT : %s" % str(lat)
		#print >> environ['wsgi.errors'], "LNG : %s" % str(lng)

		if environ['REQUEST_METHOD'] == 'GET' and lat and lng:
			precipSQL = self.precipSQL % ( lng[0], lat[0] )
			#print >> environ['wsgi.errors'], "precipSQL = %s" % precipSQL 
			precipgrp = self.__runQuery__( precipSQL )
			#print >> environ['wsgi.errors'], "precip data = %s" % str(precipgrp)
			if precipgrp:
				precipgrp_value = [ precipgrp[0][0], ]
				#print >> environ['wsgi.errors'], "precipgrp_value = %s" % str(precipgrp_value)
				rawdata = self.__runQuery__( self.forecastSQL, listParam=precipgrp_value )
				#print >> environ['wsgi.errors'], "RAW DATA : %s" % str(rawdata)
				#
				# precipgrp data in form [precipgrp, risk, date, urllink]
				#
				output = self.__formatDataResponse__( rawdata, precipgrp )
				#print >> environ['wsgi.errors'], "JSON RESPONSE: %s" % str(output)
			else:
			    output = json.dumps({'nan': ["no precipgrps found"]});
		elif environ['REQUEST_METHOD'] == 'POST':
			output = "POST methods aren't accepted";
		else:
			output = json.dumps({'nan': ["no args dude"]})

		response_headers.append( ('Content-Length', str(len(output))) )
		start_response(status, response_headers)
		return output

def application(environ, start_response):
	'''stub'''
application = GetPostgresData(application)
