import { Component, OnInit } from '@angular/core';

import * as ol from 'openlayers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  extent: [number, number, number, number];
  projection: ol.proj.Projection;
  pathSource: ol.source.Vector;
  map: ol.Map;
  draw: ol.interaction.Draw;
  
  ngOnInit() {
    // Image layer
    this.extent = [0, 0, 4963, 2563];
    this.projection = new ol.proj.Projection({
      code: 'stargarden-image',
      units: 'pixels',
      extent: this.extent
    });
    let imageSource: ol.source.ImageStatic = new ol.source.ImageStatic({
      attributions: '© <a href="http://www.stargarden.ws/">stargarden</a>',
      url: 'https://www.stargarden.ws/image/attractive-pantry-moths-in-bedroom-5-grocery-store-floor-plan-layouts-4963-x-2563.jpg',
      projection: this.projection,
      imageExtent: this.extent
    });
    let imageLayer: ol.layer.Image = new ol.layer.Image({
      source: imageSource
    });
    
    // Path Layer (Nodes and Edges)
    this.pathSource = new ol.source.Vector();
    let pathStyle: ol.style.Style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 204, 51, 1)',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: 'rgba(255, 204, 51, 1)'
        })
      })
    });
    let pathLayer: ol.layer.Vector = new ol.layer.Vector({
      source: this.pathSource,
      style: pathStyle
    });
    
    // Map - Floor Plan
    this.map = new ol.Map({
      layers: [
        imageLayer,
        pathLayer
      ],
      target: 'map',
      view: new ol.View({
        projection: this.projection,
        center: ol.extent.getCenter(this.extent),
        zoom: 2.45,
        minZoom: 2.45,
        maxZoom: 7
      })
    });
    // Only one draw interaction at a time.
    // Or Modify interaction can used to modify
    // existing items.
    // 
    // this.addPointInteraction();
    this.addLineInteraction();
  }
  
  addPointInteraction() {
    this.draw = new ol.interaction.Draw({
      source: this.pathSource,
      type: ('Point'),
      style: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.5)'
          })
        })
      })
    });
    this.map.addInteraction(this.draw);
    this.draw.on('drawstart', (evt) => {}, this);
    this.draw.on('drawend', (evt) => {
      let feature: ol.Feature = evt.feature;
      let geom: ol.geom.Geometry = feature.getGeometry();
      console.log(feature.getId());
      console.log((<ol.geom.Point>geom).getCoordinates());
    }, this);
  }
  
  addLineInteraction() {
    this.draw = new ol.interaction.Draw({
      source: this.pathSource,
      type: ('LineString'),
      maxPoints: 2,
      style: new ol.style.Style({
        stroke:  new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.5)'
          })
        })
      })
    });
    this.map.addInteraction(this.draw);
    this.draw.on('drawstart', (evt) => {}, this);
    this.draw.on('drawend', (evt) => {
      let feature: ol.Feature = evt.feature;
      let geom: ol.geom.Geometry = feature.getGeometry();
      console.log(feature.getId());
      console.log((<ol.geom.LineString>geom).getCoordinates());
    }, this);
  }
  
  removeInteraction() {
    this.map.removeInteraction(this.draw);
    this.draw = null;
  }
  
  // addInteraction adds interaction to the source in map.
  // Create similar addInteraction to each one of ('Point', 'LineString')
  // where Point - Node and LineString - Edge. Multiple interactions can
  // be created for each Node type ('PathNode', 'ResourceNode') and
  // connection between these nodes as edges. Name each features by an id.
  // Finally collect all the features convert it to required JSON.
  // Send to server to preserve in database.
  // 
  // Note: After collecting all features if possible re-align nodes and
  // edges to appear as straight line instead of zig-zag lines.
  // 
  // Recreate those features when required.
}
