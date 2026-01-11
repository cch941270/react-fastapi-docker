#!/bin/ash
set -e

for i in {1..5}; do
    alembic upgrade head && python seeds/seeds.py && exit 0
    sleep 5
done

echo "Migrate and Seed Failed."
exit 1