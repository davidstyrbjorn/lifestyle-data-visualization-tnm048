
export type visualization_options = 'parallell-axis' | 'spider' | 'none';

export type visualization_type = {
    option: visualization_options;
    // ...
}

// These reflect what's inside the json files for each person!
export type attribute_options = "fatigue" | 
                                "mood" |    
                                "readiness" | 
                                "sleep_duration_h" | 
                                "sleep_quality" | 
                                "stress" | 
                                "glasses_of_fluid" | 
                                "bodyweight";
export type attribute_type = {
    availableAttributes: Array<attribute_options>,
    selectedAttributes: Array<number>
}

export interface person_information {
    name: string;
}