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
    googledocs_reporting = pandas.read_csv('pmdata/' + person_id + "/googledocs/reporting.csv")

    # Data structure for each person    
    data = {
        "wellness": [
            
        ],
        "reporting": [
            
        ],
        "training_log": [

        ]
    }

    measured_days_wellness = len(pmsys_wellness)
    measured_days_googledocs = len(googledocs_reporting)

    # Add measured lifestyle data for each measured day, combine with google docs data. Include dates where both files have data.
    for i in range(measured_days_wellness):
        data['wellness'].append({
            "date": pmsys_wellness['effective_time_frame'][i][0:10],
            "fatigue": pmsys_wellness['fatigue'][i],
            "mood": pmsys_wellness['mood'][i],
            "readiness": pmsys_wellness['readiness'][i],
            "sleep_duration_h": pmsys_wellness['sleep_duration_h'][i],
            "sleep_quality": pmsys_wellness['sleep_quality'][i],
            "stress": pmsys_wellness['stress'][i]
        })
    
    # Make separate list for things which are not measured in the same time frame as the wellness data
    # Check both dates in each row
    for i in range(measured_days_googledocs):
        d = datetime.date(int(googledocs_reporting['date'][i][6:10]),int(googledocs_reporting['date'][i][3:5]),int(googledocs_reporting['date'][i][0:2]))
        data['reporting'].append({
            "date": str(d)

        })
    
    
    


    print(data['reporting'])
