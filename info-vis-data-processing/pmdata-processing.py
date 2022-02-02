import pandas


N = 16

for i in range(1,N+1):

    # get the correct person id
    person_id = "p"
    if(i <= 9): person_id += ('0' + str(i))
    else: person_id += (str(i))

    # open pmsys data (wellness)
    pmsys_wellness = pandas.read_csv('pmdata/' + person_id + "/pmsys/wellness.csv")
    
    break