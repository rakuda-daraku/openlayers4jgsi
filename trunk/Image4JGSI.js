OpenLayers.Tile.Image4JGSI = OpenLayers.Class(OpenLayers.Tile.Image, {


    renderTile: function() {
        if (this.layer.async) {
//            this.initImgDiv();
            // Asyncronous image requests call the asynchronous getURL method
            // on the layer to fetch an image that covers 'this.bounds', in the scope of
            // 'this', setting the 'url' property of the layer itself, and running
            // the callback 'positionFrame' when the image request returns.
//            this.layer.getURLasync(this.bounds, this, "url", this.positionImage);
        } else {
            // syncronous image requests get the url and position the frame immediately,
            // and don't wait for an image request to come back.
          
            this.url = this.layer.getURL(this.bounds);

            this.initImgDiv();
          
            // position the frame immediately
            this.positionImage(); 
        }
        return true;
    },
	
    /**
     * Method: positionImage
     * Using the properties currenty set on the layer, position the tile correctly.
     * This method is used both by the async and non-async versions of the Tile.Image
     * code.
     */
     positionImage: function() {
        // if the this layer doesn't exist at the point the image is
        // returned, do not attempt to use it for size computation
        if (this.layer === null) {
            return;
        }
        // position the frame 
        OpenLayers.Util.modifyDOMElement(this.frame, 
                                          null, this.position, this.size);   

         if (this.layerAlphaHack) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imgDiv,
                    null, null, this.size, this.url);
        } else {
            OpenLayers.Util.modifyDOMElement(this.imgDiv,
                    null, null, this.size) ;
            this.imgDiv.src = this.url;
        }
    },
        
	CLASS_NAME: "OpenLayers.Tile.Image4JGSI"
});