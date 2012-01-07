/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Grid4JGSI.js
 * @requires OpenLayers/Tile/Image.js
 * @requires OpenLayers/Layer/SphericalMercator.js
 * @requires OpenLayers/Layer/FixedZoomLevels.js
 */

/**
 * Class: OpenLayers.Layer.TMS
 * Create a layer for accessing tiles from services that conform with the 
 *     Tile Map Service Specification 
 *     (http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification).
 *
 * Example:
 * (code)
 *     var layer = OpenLayers.Layer.TMS4JGSI(
 *         "My Layer", // name for display in LayerSwitcher
 *         "http://tilecache.osgeo.org/wms-c/Basic.py/", // service endpoint
 *         {layername: "basic", type: "png"} // required properties
 *     );
 * (end)
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 *
 */
OpenLayers.Layer.TMS4JGSI = OpenLayers.Class(
                                  OpenLayers.Layer.Grid4JGSI, {

    /** 
     * Constant: MIN_ZOOM_LEVEL
     * {Integer} 0 
     */
    MIN_ZOOM_LEVEL: 0,
    
    /** 
     * Constant: MAX_ZOOM_LEVEL
     * {Integer} 21
     */
    MAX_ZOOM_LEVEL: 21,

    /**
     * APIProperty: sphericalMercator
     * {Boolean} Should the map act as a mercator-projected map? This will
     *     cause all interactions with the map to be in the actual map 
     *     projection, which allows support for vector drawing, overlaying 
     *     other maps, etc. 
     */
    sphericalMercator: false, 
    
    /** 
     * Constant: RESOLUTIONS
     * {Array(Float)} Hardcode these resolutions so that they are more closely
     *                tied with the standard wms projection
     */

    RESOLUTIONS: [
        1.40625, 
        0.703125, 
        0.3515625, 
        0.17578125, 
        0.087890625, 
        0.0439453125,
        0.02197265625, 
        0.010986328125, 
        0.0054931640625, 
        0.00274658203125,
        0.001373291015625, 
        0.0006866455078125, 
        0.00034332275390625,
        0.000171661376953125, 
        0.0000858306884765625, 
        0.00004291534423828125,
        0.00002145767211914062, 
        0.00001072883605957031,
        0.00000536441802978515, 
        0.00000268220901489257,
        0.0000013411045074462891,
        0.00000067055225372314453
    ],

    
    /**
     * APIProperty: serviceVersion
     * {String} Service version for tile requests.  Default is "1.0.0".
     */
    serviceVersion: "1.0.0",

    /**
     * APIProperty: layername
     * {String} The identifier for the <TileMap> as advertised by the service.  
     *     For example, if the service advertises a <TileMap> with 
     *    'href="http://tms.osgeo.org/1.0.0/vmap0"', the <layername> property 
     *     would be set to "vmap0".
     */
    layername: null,

    /**
     * APIProperty: type
     * {String} The format extension corresponding to the requested tile image
     *     type.  This is advertised in a <TileFormat> element as the 
     *     "extension" attribute.  For example, if the service advertises a 
     *     <TileMap> with <TileFormat width="256" height="256" mime-type="image/jpeg" extension="jpg" />,
     *     the <type> property would be set to "jpg".
     */
    type: null,

    /**
     * APIProperty: isBaseLayer
     * {Boolean} Make this layer a base layer.  Default is true.  Set false to
     *     use the layer as an overlay.
     */
    isBaseLayer: true,

    /**
     * APIProperty: tileOrigin
     * {<OpenLayers.LonLat>} Optional origin for aligning the grid of tiles.
     *     If provided, requests for tiles at all resolutions will be aligned
     *     with this location (no tiles shall overlap this location).  If
     *     not provided, the grid of tiles will be aligned with the bottom-left
     *     corner of the map's <maxExtent>.  Default is ``null``.
     *
     * Example:
     * (code)
     *     var layer = OpenLayers.Layer.TMS4JGSI(
     *         "My Layer",
     *         "http://tilecache.osgeo.org/wms-c/Basic.py/",
     *         {
     *             layername: "basic", 
     *             type: "png",
     *             // set if different than the bottom left of map.maxExtent
     *             tileOrigin: new OpenLayers.LonLat(-180, -90)
     *         }
     *     );
     * (end)
     */
    tileOrigin: null,

    /**
     * APIProperty: serverResolutions
     * {Array} A list of all resolutions available on the server.  Only set this 
     *     property if the map resolutions differs from the server.
     */
    serverResolutions: null,

    /**
     * APIProperty: zoomOffset
     * {Number} If your cache has more zoom levels than you want to provide
     *     access to with this layer, supply a zoomOffset.  This zoom offset
     *     is added to the current map zoom level to determine the level
     *     for a requested tile.  For example, if you supply a zoomOffset
     *     of 3, when the map is at the zoom 0, tiles will be requested from
     *     level 3 of your cache.  Default is 0 (assumes cache level and map
     *     zoom are equivalent).  Using <zoomOffset> is an alternative to
     *     setting <serverResolutions> if you only want to expose a subset
     *     of the server resolutions.
     */
    zoomOffset: 0,
    
    /**
     * Constructor: OpenLayers.Layer.TMS
     * 
     * Parameters:
     * name - {String} Title to be displayed in a <OpenLayers.Control.LayerSwitcher>
     * url - {String} Service endpoint (without the version number).  E.g.
     *     "http://tms.osgeo.org/".
     * options - {Object} Additional properties to be set on the layer.  The
     *     <layername> and <type> properties must be set here.
     */
    initialize: function(name, url, options) {
    
        var newArguments = [];
        newArguments.push(name, url, {}, options);
        OpenLayers.Layer.Grid4JGSI.prototype.initialize.apply(this, newArguments);

        //
        //   Create JSGI Logo 
        //
        var imgURL = "http://cyberjapan.jp/images/icon01.gif";
        var px = new OpenLayers.Pixel(5,30);
        var sz= new OpenLayers.Size(32,32);
        
        var poweredBy_div = OpenLayers.Util.createDiv(OpenLayers.Util.createUniqueID("OpenLayers.Control.JSGI_"),
			px,         // px : The element left and top position
			sz,         // sz : The element width and height The element width and height
			imgURL,
			"absolute", // position: The style.position value. eg: absolute, relative etc
			"2px",      // border
			"hidden",   // overflow
			1.0         // opacity
        	);
        	
        this.poweredBy =  poweredBy_div ;

        this.poweredBy.style.zIndex = "1100";
        this.poweredBy.style.left = "5px";
        this.poweredBy.style.top = "";
        this.poweredBy.style.bottom = "30px";
        this.poweredBy.style.className = "olLayerJSGI_PoweredBy";

		var parent = document.getElementById("OpenLayers.Map_3_OpenLayers_ViewPort");
		parent.appendChild(poweredBy_div);
		
		this.events.register( 'visibilitychanged', this, function(){
				if ( this.visibility === false ){
					this.poweredBy.style.display = "none";
				} 
				else {
					this.poweredBy.style.display = "";
				};
		});

        // RESOLUTIONSÅAunits ãyÇ— projectionÇÃçƒíËã`
        if (this.sphericalMercator) {
            OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator);
            this.initMercatorParameters();
        }
    },

    /**
     * APIMethod:destroy
     */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid4JGSI.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * APIMethod: clone
     * Create a complete copy of this layer.
     *
     * Parameters:
     * obj - {Object} Should only be provided by subclasses that call this
     *     method.
     * 
     * Returns:
     * {<OpenLayers.Layer.TMS>} An exact clone of this <OpenLayers.Layer.TMS>
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.TMS4JGSI(this.name,
                                           this.url,
                                           this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid4JGSI.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * Method: getURL
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {String} A string with the layer's url and parameters and also the 
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters
     */
    getURL: function (bounds) {
	
		// ------  Get URL of äÓî’ínê}èÓïÒ  -----------
		function getZeroPatString(value, len) {
			var svalue = value.toString();
			var slen = svalue.length;
			var i;
			var patLength = len - slen;
	
			for (i = 0; i<patLength; i++) {
				svalue = '0' + svalue;
			}
			return svalue;
		}

		function makeImageFileName(l, t, suffix) {
			var ls = getZeroPatString(l, 8);
			var ts = getZeroPatString(t, 8);
	
			if (ls.charAt(0) == '0') {
				ls = ls.substr(1, 7);
			}
			
			if (ts.charAt(0) == '0') {
				ts = ts.substr(1, 7);
			}
		 
			return '/' +  ls + '/' + ls + '-' + ts + suffix;
		}
		
		//
		// Help Me! Who called getURL? 
		//
		if ( this._Only_Grid4JGSI == 0 ) return null ;
		
		var LB  = new OpenLayers.LonLat();
		LB.lon = bounds.left   ;
		LB.lat = bounds.bottom ;
		LB=LB.transform(this.map.projection, this.map.displayProjection);

		var zoom = this.getZoom();
        
        var x = Math.round(LB.lon*360000);
        var y = Math.round(LB.lat*360000);
		
		var path =makeImageFileName(x, y, "-img.png");
		
		var url = this.SCALE_DATA[zoom].url;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(path, url);
        }
        
        console.log("getURL=%s ", url + path); 
        
        return url + path;
    },

    /** 
     * Method: setMap
     * When the layer is added to a map, then we can fetch our origin 
     *    (if we don't have one.) 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
		OpenLayers.Layer.FixedZoomLevels.prototype.initResolutions.apply(this);
/*
        console.log(" -- TMS4JGSI  setMap 2 ----");
        console.log(" --              THIS RESOLUTIONS=%s %s",this.minResolution,this.maxResolution);
        console.log(" --              gmap RESOLUTIONS=%s %s",gmap.minResolution,gmap.maxResolution);
        console.log(" --              MAP  ZOOM LEVEL=%s %s %s",this.map.minZoomLevel,this.map.maxZoomLevel,this.map.numZoomLevels);
        console.log(" --              THIS ZOOM LEVEL=%s %s %s",this.minZoomLevel,this.maxZoomLevel,this.numZoomLevels);
        console.log(" --              gmap ZOOM LEVEL=%s %s %s",gmap.minZoomLevel,gmap.maxZoomLevel,gmap.numZoomLevels);
        console.log(" --              getExtent=%s  %s",this.getExtent(),gmap.getExtent());
        console.log(" --              getResolutions=%s   %s",this.getResolution(),gmap.getResolution());
*/

        OpenLayers.Layer.Grid4JGSI.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) { 
            this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                                                this.map.maxExtent.bottom);
        }                                       
    },

    CLASS_NAME: "OpenLayers.Layer.TMS4JGSI"
});
