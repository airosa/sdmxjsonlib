define(function () {

    var lib = {};

    lib.observation = observation = {
        _key: 'OBS_DIM0_ID0:OBS_DIM1_ID1',
        _seriesKey: '0',
        dimensions: [0,1],
        value: 2013.0,
        attributes: [0,1]
    };


    lib.series = series = {
        dimensionIndices: [0,1],
        dimensions: [
            {
                id: 'SER_DIM0_ID0',
                name: 'ser dim0 name0'
            },
            {
                id: 'SER_DIM1_ID1',
                name: 'ser dim1 name1'
            }
        ],
        attributeIndices: [0,1],
        attributes: [
            {
                id: 'SER_ATTR0_ID0',
                name: 'ser attr0 name0'
            },
            {
                name: 'ser attr1 name1'
            }
        ],
        observations: [ observation ]
    };


    lib.dimensions = dimensions = {
        series: [
            {
                id: 'SER_DIM0',
                name: 'ser dim0',
                values: [
                    {
                        id: 'SER_DIM0_ID0',
                        name: 'ser dim0 name0'
                    }
                ],
                _propertyName: 'serDim0',
                keyPosition: 0
            },
            {
                id: 'SER_DIM1',
                name: 'ser dim1',
                values: [
                    {
                        id: 'SER_DIM1_ID0',
                        name: 'ser dim1 name0'
                    },
                    {
                        id: 'SER_DIM1_ID1',
                        name: 'ser dim1 name1'
                    }
                ],
                _propertyName: 'serDim1',
                keyPosition: 1
            }
        ],
        observation: [
            {
                id: 'OBS_DIM0',
                name: 'obs dim0',
                values: [
                    {
                        id: 'OBS_DIM0_ID0',
                        name: 'obs dim0 name0'
                    }
                ],
                _propertyName: 'obsDim0'
            },
            {
                id: 'OBS_DIM1',
                name: 'obs dim1',
                values: [
                    {
                        id: 'OBS_DIM1_ID0',
                        name: 'obs dim1 name0'
                    },
                    {
                        id: 'OBS_DIM1_ID1',
                        name: 'obs dim1 name1'
                    }
                ],
                _propertyName: 'obsDim1'
            }
        ]
    };


    lib.attributes = attributes = {
        series: [
            {
                id: 'SER_ATTR0',
                name: 'ser attr0',
                values: [
                    {
                        id: 'SER_ATTR0_ID0',
                        name: 'ser attr0 name0'
                    }
                ],
                _propertyName: 'serAttr0'
            },
            {
                id: 'SER_ATTR1',
                name: 'ser attr1',
                values: [
                    {
                        id: 'SER_ATTR1_ID0',
                        name: 'ser attr1 name0'
                    },
                    {
                        id: 'SER_ATTR1_ID1',
                        name: 'ser attr1 name1'
                    }
                ],
                _propertyName: 'serAttr1'
            }
        ],
        observation: [
            {
                id: 'OBS_ATTR0',
                name: 'obs attr0',
                values: [
                    {
                        id: 'OBS_ATTR0_ID0',
                        name: 'obs attr0 name0'
                    }
                ],
                _propertyName: 'obsAttr0'
            },
            {
                id: 'OBS_ATTR1',
                name: 'obs attr1',
                values: [
                    {
                        name: 'obs attr1 name0'
                    },
                    {
                        name: 'obs attr1 name1'
                    }
                ],
                _propertyName: 'obsAttr1'
            }
        ]
    };

    return lib;
});
