import pandas
import datetime

N = 16

for i in range(1,N+1):

    # Get the correct person id
    person_id = "p"
    if(i <= 9): person_id += ('0' + str(i))
    else: person_id += (str(i))

    # Open pmsys data (wellness)
    pmsys_wellness = pandas.read_csv('pmdata/' + person_id + "/pmsys/wellness.csv")
    pmsys_googledocs = pandas.read_csv('pmdata/' + person_id + "/googledocs/reporting.csv")
    
    data = {
        "lifestyle_log": [
            
        ],
        "training_log": [

        ]
    }

    measured_days = len(pmsys_wellness)

    for i in range(measured_days):
        data['lifestyle_log'].append({
            "date": pmsys_wellness['effective_time_frame'][i][0:10],
            "fatigue": pmsys_wellness['fatigue'][i],
            "mood": pmsys_wellness['mood'][i],
            "readiness": pmsys_wellness['readiness'][i],
            "sleep_duration_h": pmsys_wellness['sleep_duration_h'][i],
            "sleep_quality": pmsys_wellness['sleep_quality'][i],
            "stress": pmsys_wellness['stress'][i]
        })


    print(data)
