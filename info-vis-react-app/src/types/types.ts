
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
        primary: '#e12777',
    },
    {
        primary: '#14bf77'
    },
    {
        primary: '#f0290c'
    },
    {
        primary: '#1c77f4'
    },
    {
        primary: '#f13f28'
    },
    {
        primary: '#be1efb'
    }, 
    {
        primary: '#e24377'
    }, 
    {
        primary: '#36a12f'
    }
];