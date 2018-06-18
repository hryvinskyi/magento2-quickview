var config = {
    map: {
        '*': {
            'Magento_Swatches/js/swatch-renderer': 'Script_QuickView/js/swatch-renderer',
            colorBox: 'Script_QuickView/js/jquery.colorbox-min.min',
            script_quickview: 'Script_QuickView/js/script-quickview'
        }
    },
    shim: {
        colorBox: {
            deps: ['jquery']
        }
    }
};
