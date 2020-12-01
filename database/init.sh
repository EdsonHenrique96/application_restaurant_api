#!/bin/bash

sqlFiles=`ls ./docker-entrypoint-initdb.d/*/*.sql`
for sql in $sqlFiles
do
  echo "Run sql ${sql}"

  mysql --user=root --password=passwd < "${sql}"
done