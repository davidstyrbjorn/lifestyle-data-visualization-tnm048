import pandas
import json
import numpy as np

N = 16

for i in range(1,N+1):
    # Get the correct person id
    person_id = "p"
    if(i <= 9): person_id += ('0' + str(i))
    else: person_id += (str(i))

    # Open pmsys data (wellness)
    try:
        pmsys_wellness = pandas.read_csv('pmdata/' + person_id + "/pmsys/wellness.csv")
        googledocs_reporting = pandas.read_csv('pmdata/' + person_id + "/googledocs/reporting.csv")
    except FileNotFoundError:
        print("Not enough data for: " + person_id)
        continue

    # Data structure for each person    
    data = {
        "life-style": [

        ],
        "training_log": [

        ]
    }

    # number of entries in each
    measured_days_wellness = len(pmsys_wellness)
    measured_days_googledocs = len(googledocs_reporting)

    date_list = googledocs_reporting['date'].tolist();
    # this will always be something, in the days that bodyweight wasn't logged we will use weight from the last day it was logged
    current_weight = 0 
    
    # Look through each entry here,
    for i in range(measured_days_wellness):
        # log if the date exists also in the wellness set
        for j, google_date in enumerate(date_list):
            d = google_date[6:10] + '-' + google_date[3:5] + '-' + google_date[0:2] # Convert google date to format YY-MM-DD
            if str(pmsys_wellness['effective_time_frame'][i][0:10]) == d:
                # check if bodyweight exists for this entry
                if not np.isnan(googledocs_reporting['weight'][j]):
                    current_weight = googledocs_reporting['weight'][j]

                # we have an entry where date exists in both lists
                # append to our life-style log json entry
                data['life-style'].append({
                    "date": str(d), # the date
                    "fatigue": int(pmsys_wellness['fatigue'][i]),
                    "mood": int(pmsys_wellness['mood'][i]),
                    "readiness": int(pmsys_wellness['readiness'][i]),
                    "sleep_duration_h": int(pmsys_wellness['sleep_duration_h'][i]),
                    "sleep_quality": int(pmsys_wellness['sleep_quality'][i]),
                    "stress": int(pmsys_wellness['stress'][i]),
                    "glasses_of_fluid": int(googledocs_reporting['glasses_of_fluid'][j]),
                    "bodyweight": float(current_weight)
                })
                break
        
    # create output file
    output = open(person_id + '.json', 'w');

    # dump all our json into this file
    json.dump(data, output)