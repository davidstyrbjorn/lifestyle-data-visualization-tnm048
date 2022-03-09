
export type visualization_options = 'parallell-axis' | 'line-plot' | 'spider' | 'none';

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

export type lifestyle = {
    date: string;
    fatigue: number;
    mood: number;
    stress: number;
    readiness: number;
    sleep_duration_h: number;
    sleep_quality: number;
    glasses_of_fluid: number;
    bodyweight: number;
}

export type person_data = {
    name: string;
    lifestyle: Array<lifestyle>
}

export const AVAILABLE_COLORS = [
    {
        primary: '#FFC142'
    },
    {
        primary: '#D200A8'
    },
    {
        primary: '#88F7E2',
    },
    {
        primary: '#44D492'
    },
    {
        primary: '#8BE836'
    },
    {
        primary: '#F5EB67'
    },
    {
        primary: '#E83938'
    }, 
    {
        primary: '#C100FF'
    },
    {
        primary: '#FF00CC'
    },
    {
        primary: '#5793FF'
    },
    {
        primary: '#FFBA00'
    },
    {
        primary: '#FFE4FA'
    },
    {
        primary: '#D200A8'
    },
    {
        primary: '#FFA15C'
    },
    {
        primary: '#FA233E'
    },
];