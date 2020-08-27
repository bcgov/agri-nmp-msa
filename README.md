# BC ARM Tool

Removed harcoded `$DB_*` references

```
Sent: June 29, 2020 3:07 PM
Subject: BC MSA code request

Hi Josh,

sorry for the delay here is the entire directory from the server
including the mapping stuff based on leaflet - start with looking at index.php ...

www.terragis.net/docs/other/wcd/bc_map_archive.tar.gz

Cheers
Karsten
```

```
Date: Tuesday, June 23, 2020 at 11:11 AM
Subject: RE: AGRI DevExchange opportunity


Hi Gary,

I am beginning to work on a second BC Dev Exchange opportunity for the BC ARM Tool and was hoping you might be able to help me with some of the technical aspects. As you recall, the first opportunity was to update the smartform from Whatcom Conservation District which ended up going to Anselmo at Quartech.

For this opportunity the task would be to put the precipitation forecast map portion of the tool on an AGRI site. I have received some technical info on how the map works (attached), but it is obviously out of my area of expertise. If possible, would you have some time to take a look and potentially discuss it with me?

```

Comparison:
https://maps.whatcomcd.org/whatcom_msa

https://maps.whatcomcd.org/bc_msa

versus

http://localhost:8080

❯ docker-compose exec db bash
root@19a78780fbb9:/# psql -U gcorradini -p ${DATABASE_PORT} -h ${DATABASE_HOST} \${POSTGRES_DB}
