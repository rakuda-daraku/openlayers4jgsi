/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Grid.js
 *          @requires OpenLayers/Layer/HTTPRequest.js
 *          @requires OpenLayers/Console.js
 */

/**
 * Class: OpenLayers.Layer.Grid4JGSI
 * Base class for layers that use a lattice of tiles.  Create a new grid
 * layer with the <OpenLayers.Layer.Grid4JGSI> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.Grid4JGSI = OpenLayers.Class(OpenLayers.Layer.Grid, {
    /**
     * APIProperty: buffer
     * {Integer} Used only when in gridded mode, this specifies the number of 
     *           extra rows and colums of tiles on each side which will
     *           surround the minimum grid tiles to cover the map.
     *           For very slow loading layers, a larger value may increase
     *           performance somewhat when dragging, but will increase bandwidth
     *           use significantly. 
     */
    _Only_Grid4JGSI: 0,
    buffer: 0,
	isBaseLayer: false,
	tileWidth:300,                                                        // 画像のサイズ 単位 px )
	poweredBy: null,
	SCALE_DATA: [
		{ 
			level: 30720,                                                 // 縮尺名( 画像のサイズ 単位 100m )
			scale: 10000000,                                              // 縮尺
			scaleRange: { lower:9000000, upper:Number.NaN },
			displayLevel : 10000,
			resolution: { x:0.02844444444444444, y:0.02140979689366786 }, // 度/ピクセル
			lt: { x:102.4, y:68.26666666666666 },                         // 範囲の左上
			rb: { x:179.2, y:8.53333333333333 },                          // 範囲の右下
			url: "http://cyberjapandata.gsi.go.jp/data/raster/30720/new",
			suffix :'-img.png',
			currentAlt: "JAPAN_ALL"
		},
		{
			level: 15360,
			scale: 5000000,
			scaleRange: { lower:5000000, upper:9000000 },
			displayLevel : 10000,
			resolution: { x:0.014222222222222223, y:0.011329940252268201 },
			lt: { x:110.93333333333333, y:59.73333333333333 },
			rb: { x:166.4, y:8.53333333333333 },
			url: "http://cyberjapandata.gsi.go.jp/data/raster/15360/new",
			suffix :'-img.png',
			currentAlt: "JAPAN_ALL"
		},
		{
			level: 7680,
			scale: 2400000,
			scaleRange: { lower:2400000, upper:5000000 },
			displayLevel : 3000,
			resolution: { x:0.007111111111111111, y:0.005757121439280361 },
			lt: { x:115.2, y:53.33333333333333 },
			rb: { x:160, y:14.93333333333333 },
			url: "http://cyberjapandata.gsi.go.jp/data/raster/7680/new",
			suffix :'-img.png',
			currentAlt: "JAPAN_ALL"
		},
		{
			level: 3840,
			scale: 1200000,
			scaleRange: { lower:1200000, upper:2400000 },
			displayLevel : 3000,
			resolution: { x:0.00345945945945946, y:0.002930134603058328 },
			lt: { x:118.4, y:49.06666666666666 },
			rb: { x:156.8, y:17.06666666666666 },
			url: "http://cyberjapandata.gsi.go.jp/data/3840bafd/new",
			suffix :'-img.png',
			currentAlt: "bafd"
		},
		{
			level: 1920,
			scale: 600000,
			scaleRange: { lower:600000, upper:1200000 },
			displayLevel : 3000,
			resolution: { x:0.001777777777777778, y:0.0014555615120944818 },
			lt: { x:120, y:48.53333333333333 },
			rb: { x:150.4, y:18.66666666666666 },
			url: "http://cyberjapandata.gsi.go.jp/data/1920bafd/new",
			suffix :'-img.png',
			currentAlt: "bafd"
		},
		{
			level: 960,
			scale: 300000,
			scaleRange: { lower:300000, upper:600000 },
			displayLevel : 200,
			resolution: { x:0.0008815426997245183, y:0.0007325233315724598 },
			lt: { x:120.266666666666666, y:47.73333333333333 },
			rb: { x:152.266666666666666, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/960bafd/new",
			suffix :'-img.png',
			currentAlt: "bafd"
		},
		{
			level: 480,
			scale: 150000,
			scaleRange: { lower:150000, upper:300000 },
			displayLevel : 200,
			resolution: { x:0.00044444444444444425, y:0.0003651559667991687 },
			lt: { x:120.666666666666666, y:47.466666666666666 },
			rb: { x:150.133333333333333, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/480bafd/new",
			suffix :'-img.png',
			currentAlt: "bafd"
		},
		{
			level: 240,
			scale: 75000,
			scaleRange: { lower:75000, upper:150000 },
			displayLevel : 200,
			resolution: { x:0.0002222222222222222, y:0.00018266812441229002 },
			lt: { x:121, y:47.066666666666666 },
			rb: { x:150.066666666666666, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/240bafd/new",
			suffix :'-img.png',
			currentAlt: "bafd"
		},
		{
			level: 120,
			scale: 36000,
			scaleRange: { lower:36000, upper:75000 },
			displayLevel : 50,
			resolution: { x:0.0001111111111111111, y:0.00009013505258105335 },
			lt: { x:122, y:46.033333333333333 },
			rb: { x:149.033333333333333, y:24 },
			url: "http://cyberjapandata.gsi.go.jp/data/120bafd/new",
			suffix :'-img.png',
			currentAlt: "bafd"
		},
		{
			level: 60,
			scale: 18000,
			scaleRange: { lower:18000, upper:36000 },
			displayLevel : 25,
			resolution: { x:0.00005555555555555556, y:0.000045938749511900786 },
			lt: { x:122, y:45.999999999999999 },
			rb: { x:153.999999999999999, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/60nti/new",
			suffix :'-img.png',
			currentAlt: "NTI"
		},
		{
			level: 30,
			scale: 9000,
			scaleRange: { lower:9000, upper:18000 },
			displayLevel : 25,
			resolution: { x:0.00002777777777777778, y:0.00002296176777351219 },
			lt: { x:122, y:45.999999999999999 },
			rb: { x:153.999999999999999, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/30nti/new",
			suffix :'-img.png',
			currentAlt: "NTI"
		},
		{
			level: 15,
			scale: 4500,
			scaleRange: { lower:4500, upper:9000 },
			displayLevel : 25,
			resolution: { x:0.00001388888888888889, y:0.000011479028697571744 },
			lt: { x:122, y:45.999999999999999 },
			rb: { x:153.999999999999999, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/15nti/new",
			suffix :'-img.png',
			currentAlt: "NTI"
		},
		{
			level: 7.5,
			scale: 2500,
			scaleRange: { lower:2500, upper:4500 },
			displayLevel : 0.5,
			resolution: { x:0.000006944444444444445, y:0.000005739060798285698 },
			lt: { x:122, y:45.999999999999999 },
			rb: { x:153.999999999999999, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/7.5dm/23212dm",
			suffix :'-img.png',
			currentAlt: "FGD_L"
		},
		{
			level: 3,
			scale: 1000,
			scaleRange: { lower:100, upper:2500 },
			displayLevel : 0.5,
			resolution: { x:0.000002777777777777778, y:0.0000022955091982377905 },
			lt: { x:122, y:45.999999999999999 },
			rb: { x:153.999999999999999, y:20 },
			url: "http://cyberjapandata.gsi.go.jp/data/3dm/23212dm",
			suffix :'-img.png',
			currentAlt: null
		}
	],
	
	
	getZoom: function() {
    	var scale = this.map.getScale();
    	
		if (scale > this.SCALE_DATA[0].scale) return 0;
		var maxLength = this.SCALE_DATA.length;
		
		if (scale < this.SCALE_DATA[maxLength - 1].scale) return (maxLength - 1);
		
		for (var i = 0; i < maxLength; i++) {
			if (i==0 && scale >= this.SCALE_DATA[i].scaleRange.lower) {
				return i;
			} else if (i == maxLength-1 && scale <= this.SCALE_DATA[i].scaleRange.upper) {
				return i;
			} else if (scale >= this.SCALE_DATA[i].scaleRange.lower && scale <= this.SCALE_DATA[i].scaleRange.upper) {
				return i;
			}
		}
		return "Not Found" ;
	},

    /**
     * Constructor: OpenLayers.Layer.Grid
     * Create a new grid layer
     *
     * Parameters:
     * name - {String}
     * url - {String}
     * params - {Object}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                arguments);
        
        //grid layers will trigger 'tileloaded' when each new tile is 
        // loaded, as a means of progress update to listeners.
        // listeners can access 'numLoadingTiles' if they wish to keep track
        // of the loading progress
        //
//        this.events.addEventType("tileloaded");

        this.grid = [];
        
//        this._moveGriddedTiles = OpenLayers.Function.bind(
//            this.moveGriddedTiles, this
//        );
    },
    	
    /**
     * APIMethod: clone
     * Create a clone of this layer
     *
     * Parameters:
     * obj - {Object} Is this ever used?
     * 
     * Returns:
     * {<OpenLayers.Layer.Grid>} An exact clone of this OpenLayers.Layer.Grid
     */
    clone: function (obj) {
    console.log(" ---------clone --------------------");         
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid4JGSI(this.name,
                                            this.url,
                                            this.params,
                                            this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        
        // we do not want to copy reference to grid, so we make a new array
        obj.grid = [];

        return obj;
    },
    /**
     * Method: moveTo
     * This function is called whenever the map is moved. All the moving
     * of actual 'tiles' is done by the map, but moveTo's role is to accept
     * a bounds and make sure the data that that bounds requires is pre-loaded.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {
//      OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);
        
        bounds = bounds || this.map.getExtent();

        if (bounds != null) {
             
            // if grid is empty or zoom has changed, we *must* re-tile
            var forceReTile = !this.grid.length || zoomChanged;

            // total bounds of the tiles
            var tilesBounds = this.getTilesBounds();            
      
            if (this.singleTile) {
                
                // We want to redraw whenever even the slightest part of the 
                //  current bounds is not contained by our tile.
                //  (thus, we do not specify partial -- its default is false)
                if ( forceReTile || 
                     (!dragging && !tilesBounds.containsBounds(bounds))) {
                    this.initSingleTile(bounds);
                }
            } else {
             
                // if the bounds have changed such that they are not even 
                //  *partially* contained by our tiles (IE user has 
                //  programmatically panned to the other side of the earth) 
                //  then we want to reTile (thus, partial true).  
                //
//                if (forceReTile || !tilesBounds.containsBounds(bounds, true)) {
                    this.initGriddedTiles(bounds);
//                } else {
//                    this.scheduleMoveGriddedTiles();
//                }
            }
        }
    },
    /**
     * Method: moveByPx
     * Move the layer based on pixel vector.
     *
     * Parameters:
     * dx - {Number}
     * dy - {Number}
     */
    moveByPx: function(dx, dy) {    // Drag した場合にcallされる。
           if (!this.singleTile) {
//            this.scheduleMoveGriddedTiles();   
        }
    },        	
    /** 
     * Method: calculateGridLayout
     * Generate parameters for the grid layout.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bound>}
     * origin - {<OpenLayers.LonLat>}
     * resolution - {Number}
     *
     * Returns:
     * Object containing properties tilelon, tilelat, tileoffsetlat,
     * tileoffsetlat, tileoffsetx, tileoffsety
     */
    calculateGridLayout: function(bounds, origin, resolution) {
    
		var zoom = this.getZoom();
		var degDelta  = this.SCALE_DATA[zoom].level/3600;     // 一辺のサイズ( 単位:度 )
		var tileWidth = this.tileWidth*this.SCALE_DATA[zoom].scale/this.map.getScale();

        // ------  スケールに合わせて、タイルの幅、高さ を変更する。( 単位:度 )
		var  tilelon = degDelta;
		var  tilelat = degDelta;
        // ------ 

        var offsetlon = bounds.left - origin.lon;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * tileWidth;
        var tileoffsetlon = origin.lon + tilecol * tilelon;
        
        var offsetlat = bounds.top - (origin.lat + tilelat);  
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsetlat = origin.lat + tilerow * tilelat;
        var tileoffsety = -tilerowremain * this.calcHeight(tileoffsetlat, tileWidth);

        return { 
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },
    
	calcHeight: function(lat, width) {
	    if ( this.map.projection == "EPSG:4326")  {
	    	return width;
	    }
	    else {
			return Math.floor(width/Math.cos(lat*Math.PI/180.00));
		}
	},
	
    /**
     * Method: getTileOrigin
     * Determine the origin for aligning the grid of tiles.  If a <tileOrigin>
     *     property is supplied, that will be returned.  Otherwise, the origin
     *     will be derived from the layer's <maxExtent> property.  In this case,
     *     the tile origin will be the corner of the <maxExtent> given by the 
     *     <tileOriginCorner> property.
     *
     * Returns:
     * {<OpenLayers.LonLat>} The tile origin.
     */
    getTileOrigin: function() {
// console.log(" ---------getTileOrigin --------------------"); 
        var origin = this.tileOrigin;
        if (!origin) {
            var extent = this.getMaxExtent();
            var edges = ({
                "tl": ["left", "top"],
                "tr": ["right", "top"],
                "bl": ["left", "bottom"],
                "br": ["right", "bottom"]
            })[this.tileOriginCorner];
            origin = new OpenLayers.LonLat(extent[edges[0]], extent[edges[1]]);
        }
        return origin;
    },

    /**
     * Method: initGriddedTiles
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    initGriddedTiles:function(proj_bounds) {
    
    
    this._Only_Grid4JGSI = 1 ; 
    
        // 経緯度で処理行う。displayProjectionが経緯度のEPSG  例えば、EPSG:4326
		var bounds     = proj_bounds.transform(this.map.projection,this.map.displayProjection);

		var viewSize = this.map.getSize();
        var zoom = this.getZoom();
		var degDelta = this.SCALE_DATA[zoom].level/3600;                                // 一辺のサイズ(度)
		
		// tile width is constant so it's easy to find how many cols required


		this.tileSize.w = viewSize.w/(bounds.right - bounds.left  )*degDelta;
		this.tileSize.h = viewSize.h/(bounds.top   - bounds.bottom)*degDelta;    // 正確ではない
		
		var tileWidth  = this.tileSize.w ;                                        // 幅(pixcel)

		
		// tile width is constant so it's easy to find how many cols required
		var minCols = Math.ceil(viewSize.w/tileWidth) + Math.max(1, 2 * this.buffer);
		
		// but tile height is variable, so we need calculate how many rows required
		// by using delta in degrees 
		var minRows = Math.ceil((bounds.top - bounds.bottom)/degDelta) + Math.max(1, 2 * this.buffer);
		
		var leftmost = this.SCALE_DATA[zoom].lt.x;
		var topmost  = this.SCALE_DATA[zoom].lt.y;
		
		// tileoffsetlon = left of first (current) tile in degree (lon)
		// => center - half of required tiles coverage (excluding current tile hence the -1)
//		var tileoffsetlon = ((bounds.left + bounds.right)/2) - ((minCols/2) - 1)*degDelta;
		var tileoffsetlon = ((bounds.left + bounds.right)/2) - minCols/2*degDelta;
		
		// round to the closest tile left
		if (tileoffsetlon < leftmost) {
			tileoffsetlon = leftmost;
		} else {
			tileoffsetlon = leftmost + Math.floor((tileoffsetlon - leftmost)/degDelta) * degDelta;
		}
		
		// tileoffsetlat = top of first (current) tile in degree (lat)
//		var tileoffsetlat = ((bounds.bottom + bounds.top)/2) + ((minRows/2) - 1)*degDelta;
		var tileoffsetlat = ((bounds.bottom + bounds.top)/2) + minRows/2*degDelta;
		if (tileoffsetlat > topmost) {
			tileoffsetlat = topmost;
		} else {
			tileoffsetlat = topmost - Math.floor((topmost - tileoffsetlat)/degDelta) * degDelta;
		}
		
		// x-dir pixel offset of first (current) tile relative to bounds => (0,0) pixel
		var tileoffsetx = -Math.round(((bounds.left - tileoffsetlon)/degDelta) * tileWidth);
		
		// y-dir pixel offset of first (current) tile relative to bounds => (0,0) pixel
		// because tile height is variable, we need to consider and calculate each tile up to the
		// top tile.
		var curlat = topmost - Math.floor((topmost - bounds.top)/degDelta) * degDelta;
		var tileoffsety = ((bounds.top - curlat)/degDelta) * this.calcHeight(curlat - degDelta, tileWidth);
		
		// degDelta/2 so it stops exactly on the tile with top = tileoffsetlat (last tile processed should be curlat = tileoffsetlat + degDelta)
		var toplimit = tileoffsetlat - degDelta/2;
		while (curlat < toplimit) {
			curlat += degDelta;
			tileoffsety -= this.calcHeight(curlat - degDelta, tileWidth);
		}
		tileoffsety = Math.round(tileoffsety);
		
		var curTileHeight = this.calcHeight(tileoffsetlat - degDelta, tileWidth);
		
		this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);
		
		var startX = tileoffsetx; 
		var startLon = tileoffsetlon;
		
		var rowidx = 0;
		
		var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
		var layerContainerDivTop  = parseInt(this.map.layerContainerDiv.style.top);
		
		do {
			var row = this.grid[rowidx++];
			if (!row) {
				row = [];
				this.grid.push(row);
			}
			
			tileoffsetlon = startLon;
			tileoffsetx = startX;
			var colidx = 0;
			
			do {
				var tileBounds = new OpenLayers.Bounds(
						tileoffsetlon, 
						tileoffsetlat - degDelta, 
						tileoffsetlon + degDelta,
						tileoffsetlat);
				
				var x = tileoffsetx;
				x -= layerContainerDivLeft;
				
				var y = tileoffsety;
				y -= layerContainerDivTop;
				
				var px = new OpenLayers.Pixel(x, y);
				tileBounds =  tileBounds.transform(this.map.displayProjection,this.map.projection);
				
				var tile = row[colidx++];
				if (!tile) {
					tile = this.addTile(tileBounds, px, new OpenLayers.Size(tileWidth, curTileHeight));
					this.addTileMonitoringHooks(tile);
					row.push(tile);

				} else {
					tile.size.w = tileWidth;
					tile.size.h = curTileHeight;
					tile.moveTo(tileBounds, px, false);

				}
				
				tileoffsetlon += degDelta;
				tileoffsetx += tileWidth;
				
			} while ((tileoffsetlon <= bounds.right + degDelta * this.buffer) || colidx < minCols);

			tileoffsetlat -= degDelta;
			tileoffsety += curTileHeight;
			curTileHeight = this.calcHeight(tileoffsetlat - degDelta, tileWidth);
			
		} while ((tileoffsetlat >= bounds.bottom - degDelta * this.buffer) || rowidx < minRows);

		//shave off exceess rows and colums
		this.removeExcessTiles(rowidx, colidx);

		//now actually draw the tiles
		this.spiralTileLoad();
		
		 this._Only_Grid4JGSI = 0 ; 

    },

    /**
     * Method: getMaxExtent
     * Get this layer's maximum extent. (Implemented as a getter for
     *     potential specific implementations in sub-classes.)
     *
     * Returns:
     * {OpenLayers.Bounds}
     */
    getMaxExtent: function() {
// console.log(" ---------getMaxExten --------------------"); 
        return this.maxExtent;
    },
    
    /**
     * Method: spiralTileLoad
     *   Starts at the top right corner of the grid and proceeds in a spiral 
     *    towards the center, adding tiles one at a time to the beginning of a 
     *    queue. 
     * 
     *   Once all the grid's tiles have been added to the queue, we go back 
     *    and iterate through the queue (thus reversing the spiral order from 
     *    outside-in to inside-out), calling draw() on each tile. 
     */
    spiralTileLoad: function() {

        var tileQueue = [];
 
        var directions = ["right", "down", "left", "up"];

        var iRow = 0;
        var iCell = -1;
        var direction = OpenLayers.Util.indexOf(directions, "right");
        var directionsTried = 0;
        
        while( directionsTried < directions.length) {

            var testRow = iRow;
            var testCell = iCell;

            switch (directions[direction]) {
                case "right":
                    testCell++;
                    break;
                case "down":
                    testRow++;
                    break;
                case "left":
                    testCell--;
                    break;
                case "up":
                    testRow--;
                    break;
            } 
    
            // if the test grid coordinates are within the bounds of the 
            //  grid, get a reference to the tile.
            var tile = null;
            if ((testRow < this.grid.length) && (testRow >= 0) &&
                (testCell < this.grid[0].length) && (testCell >= 0)) {
                tile = this.grid[testRow][testCell];
            }
            
            if ((tile != null) && (!tile.queued)) {
                //add tile to beginning of queue, mark it as queued.
                tileQueue.unshift(tile);
                tile.queued = true;
                
                //restart the directions counter and take on the new coords
                directionsTried = 0;
                iRow = testRow;
                iCell = testCell;
            } else {
                //need to try to load a tile in a different direction
                direction = (direction + 1) % 4;
                directionsTried++;
            }
        } 
        
        // now we go through and draw the tiles in forward order
        for(var i=0, len=tileQueue.length; i<len; i++) {
            var tile = tileQueue[i];
            
            tile.draw();
            //mark tile as unqueued for the next time (since tiles are reused)
            tile.queued = false;       
        }
    },

    /**
     * APIMethod: addTile
     * Create a tile, initialize it, and add it to the layer div. 
     *
     * Parameters
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.Tile>} The added OpenLayers.Tile
     */
    addTile:function(bounds, position, tileSize) {
        return new OpenLayers.Tile.Image4JGSI(this, position, bounds, null,tileSize);
    },
    
 
    /**
     * Method: moveGriddedTiles
     */
    moveGriddedTiles: function() {
    
        var shifted = true;
        var buffer = this.buffer || 1;

        var tlLayer = this.grid[0][0].position;
        var offsetX = parseInt(this.map.layerContainerDiv.style.left);
        var offsetY = parseInt(this.map.layerContainerDiv.style.top);
        var tlViewPort = tlLayer.add(offsetX, offsetY);
        
        if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
//            this.shiftColumn(true);
        } else if (tlViewPort.x < -this.tileSize.w * buffer) {
  //          this.shiftColumn(false);
        } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
//            this.shiftRow(true);
        } else if (tlViewPort.y < -this.tileSize.h * buffer) {
//             this.shiftRow(false);
        } else {
            shifted = false;
        }
///       if (shifted) {
            // we may have other row or columns to shift, schedule it
            // with a setTimeout, to give the user a chance to sneak
            // in moveTo's
   //         this.timerId = window.setTimeout(this._moveGriddedTiles, 0);
   //     }
    },

    /**
     * Method: shiftRow
     * Shifty grid work
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftRow:function(prepend) {
// console.log(" ---------shiftRow --------------------");  
 		var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
		var grid = this.grid;
		var modelRow = grid[modelRowIndex];

		var zoom = this.getZoom();
		var degDelta = this.SCALE_DATA[zoom].level/3600;
		var deltaLat  = (prepend) ? degDelta : -degDelta ;
		
		var viewSize = this.map.getSize();
		var viewBounds = this.map.getExtent();
		var tileWidth= viewSize.w/(viewBounds.right - viewBounds.left  )*degDelta;      // 幅(pixcel)
		
		var bounds = modelRow[modelRowIndex].bounds.clone();
		bounds =  bounds.transform(this.map.projection,this.map.displayProjection);
		
		var nextHeight = (prepend) ? 
				this.calcHeight(bounds.bottom + deltaLat, tileWidth) : 
				this.calcHeight(bounds.bottom, tileWidth);
		var deltaY = (prepend) ? -nextHeight : nextHeight;

		var row = (prepend) ? grid.pop() : grid.shift();

		for (var i=0, len=modelRow.length; i<len; i++) {
			var modelTile = modelRow[i];
			var bounds = modelTile.bounds.clone();
			var position = modelTile.position.clone();

			bounds =  bounds.transform(this.map.projection,this.map.displayProjection);
			bounds.bottom = bounds.bottom + deltaLat;
			bounds.top = bounds.top + deltaLat;
			bounds =  bounds.transform(this.map.displayProjection,this.map.projection);
			
			position.y = position.y + deltaY;
			row[i].size.h = nextHeight;
			row[i].moveTo(bounds, position);
		}

		if (prepend) {
			grid.unshift(row);
		} else {
			grid.push(row);
		}
	},
 
    /**
     * Method: shiftColumn
     * Shift grid work in the other dimension
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftColumn: function(prepend) {
// console.log(" ---------shiftColumn --------------------");  
 		var zoom = this.getZoom();
		var degDelta = this.SCALE_DATA[zoom].level/3600;
		
		var viewSize = this.map.getSize();
		var viewBounds = this.map.getExtent();
		var tileWidth= viewSize.w/(viewBounds.right - viewBounds.left  )*degDelta;      // 幅(pixcel)
		
		var deltaX = (prepend) ? -tileWidth : tileWidth;
 
 		
		var deltaLon = (prepend) ? -degDelta : degDelta;

		for (var i=0, len=this.grid.length; i<len; i++) {
			var row = this.grid[i];
			var modelTileIndex = (prepend) ? 0 : (row.length - 1);
			var modelTile = row[modelTileIndex];

			var bounds = modelTile.bounds.clone();
			var position = modelTile.position.clone();
			
			bounds =  bounds.transform(this.map.projection,this.map.displayProjection);
			bounds.left = bounds.left + deltaLon;
			bounds.right = bounds.right + deltaLon;
			position.x = position.x + deltaX;
			bounds =  bounds.transform(this.map.displayProjection,this.map.projection);

			var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
			tile.moveTo(bounds, position);
			if (prepend) {
				row.unshift(tile);
			} else {
				row.push(tile);
			}
		}
	},

    /**
     * Method: removeExcessTiles
     * When the size of the map or the buffer changes, we may need to
     *     remove some excess rows and columns.
     * 
     * Parameters:
     * rows - {Integer} Maximum number of rows we want our grid to have.
     * columns - {Integer} Maximum number of columns we want our grid to have.
     */
    removeExcessTiles: function(rows, columns) {
        // remove extra rows
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (var i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                this.removeTileMonitoringHooks(tile);
                tile.destroy();
            }
        }
        
        // remove extra columns
        while (this.grid[0].length > columns) {
            for (var i=0, l=this.grid.length; i<l; i++) {
                var row = this.grid[i];
                var tile = row.pop();
                this.removeTileMonitoringHooks(tile);
                tile.destroy();
            }
        }
    },

    /**
     * Method: onMapResize
     * For singleTile layers, this will set a new tile size according to the
     * dimensions of the map pane.
     */
    onMapResize: function() {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize();
        }
    },
    
    /**
     * APIMethod: getTileBounds
     * Returns The tile bounds for a layer given a pixel location.
     *
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>} The location in the viewport.
     *
     * Returns:
     * {<OpenLayers.Bounds>} Bounds of the tile at the given pixel location.
     */
    getTileBounds: function(viewPortPx) {
    
    
console.log(" ****** getTileBounds  ****************");

        var maxExtent = this.maxExtent;
        var resolution = this.getResolution();
        
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        
        var tileLeft = maxExtent.left + (tileMapWidth *
                                         Math.floor((mapPoint.lon -
                                                     maxExtent.left) /
                                                    tileMapWidth));
        var tileBottom = maxExtent.bottom + (tileMapHeight *
                                             Math.floor((mapPoint.lat -
                                                         maxExtent.bottom) /
                                                        tileMapHeight));
        return new OpenLayers.Bounds(tileLeft, tileBottom,
                                     tileLeft + tileMapWidth,
                                     tileBottom + tileMapHeight);
    },
    
    CLASS_NAME: "OpenLayers.Layer.Grid4JGSI"
});
