//var baseUrl = location.toString().replace(/[^\s\/]+$/, '');
var baseUrl = '/cnarh/arcgis/';

window.dojoConfig = {
    packages : [
        {
            name : 'template',
            location : baseUrl + 'app/template'
        },
        {
            name : 'app',
            location :  baseUrl + 'app'
        },
        {
            name : "widgets",
            location : baseUrl + "app/widgets"
        },
        {
            name : "plugins",
            location : baseUrl + 'app/plugins'
        },
        {
            name : "bootstrap",
            location : baseUrl + "lib/bootstrap"
        },
        {
            name: "agsjs",
            location: baseUrl + 'lib/agsjs'
        },
        {
            name : "proj4js",
            location : baseUrl + 'lib/proj4js'
        }
    ],
    parseOnLoad : false,
    async : true
};

window.paceOptions = {
    document : false,
    eventLag : false,
    elements : {
        selectors : ['#sasjs']
    },
    target : '#sasjs'
};