import json
import datetime
import random

names = {"David", "Greg", "Heidi", "Janice", "Jeff"}
measured_days = 31

# Persons
for idx, name in enumerate(names):
    date = datetime.datetime(2022, 1, 1, 12, 0, 0)
    data = {
        "age": random.randint(20,40),
        "bodyweight": random.randint(60,90),
        "lifestyle_log": [

        ],
        "training_log": [

        ]
    }

    for i in range(measured_days):
        data["lifestyle_log"].append(
        {
            "date": date.date().isoformat(),
            "energy_level": random.randint(1,10),
            "water_drank": random.randint(1,5),
            "stress_level": random.randint(1,10),
            "motivation": random.randint(1,10),
            "hours_slept": random.randint(5,12),
            "caffein_intake": random.randint(0,400)
        })
        date += datetime.timedelta(days = 1)
    out_file = open('' + name + '.json', 'w')
    json.dump(data, out_file)