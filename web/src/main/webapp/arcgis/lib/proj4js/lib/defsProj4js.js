define(["proj4js/lib/proj4js-combined"], function(){
    "use strict";
    Proj4js.defs["EPSG:4225"] = "+title=Corrego Alegre +proj=longlat +a=6378388 +rf=297.00 +towgs84=-205.57,168.77,-4.12";
    Proj4js.defs["EPSG:4326"] = "+proj=longlat +a=6378137.0 +b=6356752.31424518 +ellps=WGS84 +datum=WGS84 +units=degrees";
    Proj4js.defs["EPSG:4674"] = "+title=SIRGAS 2000 +proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:5527"] = "+proj=longlat +a=6378160 +rf=298.25 +towgs84=-66.87,4.37,-38.52";

    Proj4js.defs["EPSG:22521"] = "+proj=utm +zone=21 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:22522"] = "+proj=utm +zone=22 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:22523"] = "+proj=utm +zone=23 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:22524"] = "+proj=utm +zone=24 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:22525"] = "+proj=utm +zone=25 +south +ellps=intl +towgs84=-206,172,-6,0,0,0,0 +units=m +no_defs";

    Proj4js.defs["EPSG:29169"] = "+title=SAD69 após 94 +proj=utm +zone=19 +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29170"] = "+title=SAD69 após 94 +proj=utm +zone=20 +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29171"] = "+title=SAD69 após 94 +proj=utm +zone=21 +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29172"] = "+title=SAD69 após 94 +proj=utm +zone=23 +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";

    Proj4js.defs["EPSG:29188"] = "+title=SAD69 após 94 +proj=utm +zone=18 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29189"] = "+title=SAD69 após 94 +proj=utm +zone=19 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29190"] = "+title=SAD69 após 94 +proj=utm +zone=20 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29191"] = "+title=SAD69 após 94 +proj=utm +zone=21 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29192"] = "+title=SAD69 após 94 +proj=utm +zone=22 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29193"] = "+title=SAD69 após 94 +proj=utm +zone=23 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29194"] = "+title=SAD69 após 94 +proj=utm +zone=24 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";
    Proj4js.defs["EPSG:29195"] = "+title=SAD69 após 94 +proj=utm +zone=25 +south +a=6378160 +rf=298.25  +towgs84=-67.35,3.88,-38.22";

    Proj4js.defs["EPSG:31977"] = "+title=SIRGAS 2000 +proj=utm +zone=17 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31978"] = "+title=SIRGAS 2000 +proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31979"] = "+title=SIRGAS 2000 +proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31980"] = "+title=SIRGAS 2000 +proj=utm +zone=20 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31981"] = "+title=SIRGAS 2000 +proj=utm +zone=21 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31982"] = "+title=SIRGAS 2000 +proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31983"] = "+title=SIRGAS 2000 +proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    Proj4js.defs["EPSG:31984"] = "+title=SIRGAS 2000 +proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";

    Proj4js.defs["EPSG:31985"] = "+proj=utm +zone=25 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

    Proj4js.defs["EPSG:102100"] = "+title=WebMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +units=m +k=1.0 +nadgrids=@null +no_defs";
});