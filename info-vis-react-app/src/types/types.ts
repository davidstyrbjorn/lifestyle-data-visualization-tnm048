
export type visualization_options = 'parallell-axis' | 'spider' | 'none';

export type visualization_type = {
    option: visualization_options;
    // ...
}

export type attribute_type = {
    availableAttributes: Array<string>,
    selectedAttributes: Array<number>
}
    