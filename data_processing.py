import json
import datetime

data = {
    "name": "david",
    "pn": "000000000",
    "dates": [

    ]
}

date = datetime.datetime(2022, 1, 1, 12, 4, 5)

for i in range(31):
    data["dates"].append(date.date().isoformat())
    date += datetime.timedelta(days = 1)

print(data)