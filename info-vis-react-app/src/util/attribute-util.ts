import { attribute_options } from "../types/types";

// Convert a attribute_options variable to something more user-friendly
export function makeAttributePresentable(attributeOpt: attribute_options){
    const dict = {
        "fatigue": "Fatigue",
        "mood": "Mood",
        "readiness": "Readiness",
        "sleep_duration_h": "Sleep Duration",
        "sleep_quality": "Sleep Quality",
        "stress": "Stress",
        "glasses_of_fluid": "Glasses of Fluid",
        "bodyweight": "Bodyweight"
    }
    return dict[attributeOpt];
}