require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/tasks/support/Query"
  ], function(Map, MapView, GeoJSONLayer, Query) {
  
    // Create the map with a chosen basemap.
    const map = new Map({
      basemap: "gray-vector"
    });
  
    // Initialize the MapView centered on Pasco County.
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-82.4, 28.3],  // Adjusted center for Pasco County.
      zoom: 10
    });
  
    // Define an array of layer configurations with custom colors.
    // Parks is a polygon layer so we set geometryType: "polygon".
    const layersConfig = [
      {
        url: "data/Fire_Stations.geojson",
        title: "Fire Stations",
        color: "#FF0000",  // Red
        popupTemplate: {
          title: "{Station_Name}",
          content: "<b>Address:</b> {Address}"
        }
      },
      {
        url: "data/Hospitals.geojson",
        title: "Hospitals",
        color: "#0000FF",  // Blue
        popupTemplate: {
          title: "{Hospital_Name}",
          content: "<b>Address:</b> {Address}"
        }
      },
      {
        url: "data/Libraries.geojson",
        title: "Libraries",
        color: "#008000",  // Green
        popupTemplate: {
          title: "{Library_Name}",
          content: "<b>Address:</b> {Address}"
        }
      },
      {
        url: "data/Pasco_Schools.geojson",
        title: "Pasco Schools",
        color: "#FFA500",  // Orange
        popupTemplate: {
          title: "{Name}",
          content: "<b>Address:</b> {Address}"
        }
      },
      {
        url: "data/Police_Stations.geojson",
        title: "Police Stations",
        color: "#800080",  // Purple
        popupTemplate: {
          title: "{Station_Name}",
          content: "<b>Address:</b> {Address}"
        }
      },
      // Parks layer moved to the end. It's a polygon layer.
      {
        url: "data/Parks_Poly.geojson",
        title: "Parks",
        color: "rgba(127,255,0,0.5)",  // Transparent chartreuse.
        geometryType: "polygon",
        popupTemplate: {
          title: "{Park_Name}",
          content: "<b>Description:</b> {Description}"
        }
      }
    ];
  
    // Array to hold created layers.
    const layers = [];
  
    // Loop through the layer configurations and add each GeoJSONLayer to the map.
    layersConfig.forEach(config => {
      // Define renderer based on geometry type.
      let renderer;
      if (config.geometryType === "polygon") {
        renderer = {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: config.color,
            outline: {
              color: "white",
              width: 1
            }
          }
        };
      } else {
        renderer = {
          type: "simple",
          symbol: {
            type: "simple-marker",
            color: config.color,
            size: "8px",
            outline: {
              color: "white",
              width: 1
            }
          }
        };
      }
  
      // Build properties for the GeoJSONLayer.
      const layerProperties = {
        url: config.url,
        title: config.title,
        popupTemplate: config.popupTemplate,
        renderer: renderer
      };
  
      // For point layers (non-polygon), add clustering.
      if (!config.geometryType) {
        layerProperties.featureReduction = {
          type: "cluster",
          clusterRadius: "100px",
          // Optionally include labeling for clusters.
          labelingInfo: [{
            deconflictionStrategy: "none",
            symbol: {
              type: "text",
              color: "white",
              haloColor: "black",
              haloSize: "1px",
              font: { size: "12px", weight: "bold" }
            },
            labelExpressionInfo: { expression: "$feature.cluster_count" }
          }],
          popupTemplate: {
            title: "{cluster_count} features",
            content: "This cluster represents {cluster_count} features."
          }
        };
      }
  
      // Create the GeoJSONLayer.
      const layer = new GeoJSONLayer(layerProperties);
  
      // Attach the custom color property for UI use.
      layer.customColor = config.color;
  
      // Add the layer to the map and to our array.
      map.add(layer);
      layers.push(layer);
    });
  
    // -------------------------------------------------------------------
    // Create Basemap Toggle UI.
    // -------------------------------------------------------------------
    function createBasemapToggle() {
      const basemapDiv = document.createElement("div");
      basemapDiv.id = "basemapToggle";
      // Position the basemap toggle at the top right.
      basemapDiv.style.position = "absolute";
      basemapDiv.style.top = "30px";
      basemapDiv.style.left = "60px";  // Moved to the right by 70px.
      basemapDiv.style.backgroundColor = "white";
      basemapDiv.style.padding = "10px";
      basemapDiv.style.borderRadius = "4px";
      basemapDiv.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
      basemapDiv.style.zIndex = "99";
  
      const label = document.createElement("label");
      label.textContent = "Basemap: ";
      basemapDiv.appendChild(label);
  
      const select = document.createElement("select");
  
      // List of basemaps.
      const basemaps = [
        { name: "Gray", value: "gray-vector" },
        { name: "Streets", value: "streets-navigation-vector" },
        { name: "Topographic", value: "topo-vector" },
        { name: "Satellite", value: "satellite" }
      ];
  
      basemaps.forEach(basemap => {
        const option = document.createElement("option");
        option.value = basemap.value;
        option.textContent = basemap.name;
        select.appendChild(option);
      });
  
      // When selection changes, update the map's basemap.
      select.addEventListener("change", function(e) {
        map.basemap = e.target.value;
      });
  
      basemapDiv.appendChild(select);
      document.body.appendChild(basemapDiv);
    }
  
    // -------------------------------------------------------------------
    // Create Layer Toggle UI.
    // -------------------------------------------------------------------
    function createLayerToggle() {
      const layerToggleDiv = document.createElement("div");
      layerToggleDiv.id = "layerToggle";
      // Position the layer toggle at the top right.
      layerToggleDiv.style.position = "absolute";
      layerToggleDiv.style.top = "10px";
      layerToggleDiv.style.right = "10px";
      layerToggleDiv.style.backgroundColor = "white";
      layerToggleDiv.style.padding = "10px";
      layerToggleDiv.style.borderRadius = "4px";
      layerToggleDiv.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
      layerToggleDiv.style.zIndex = "99";
  
      const title = document.createElement("div");
      title.textContent = "Toggle Layers";
      title.style.fontWeight = "bold";
      title.style.marginBottom = "5px";
      layerToggleDiv.appendChild(title);
  
      layers.forEach(layer => {
        const label = document.createElement("label");
        label.style.display = "block";
        label.style.fontSize = "14px";
        label.style.marginBottom = "3px";
  
        // Create a color indicator icon.
        const colorIndicator = document.createElement("span");
        colorIndicator.style.display = "inline-block";
        colorIndicator.style.width = "12px";
        colorIndicator.style.height = "12px";
        colorIndicator.style.backgroundColor = layer.customColor;
        colorIndicator.style.marginRight = "5px";
        colorIndicator.style.borderRadius = "50%";
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.style.marginRight = "5px";
        checkbox.addEventListener("change", function(e) {
          layer.visible = e.target.checked;
        });
  
        label.appendChild(colorIndicator);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(layer.title));
        layerToggleDiv.appendChild(label);
      });
  
      document.body.appendChild(layerToggleDiv);
    }
  
    // -------------------------------------------------------------------
    // Create Pie Chart Panel.
    // -------------------------------------------------------------------
    let pieChart; // Global Chart.js instance.
    function createPieChartPanel() {
      const chartDiv = document.createElement("div");
      chartDiv.id = "chartPanel";
      chartDiv.style.position = "absolute";
      chartDiv.style.bottom = "10px";
      chartDiv.style.right = "10px";
      chartDiv.style.backgroundColor = "white";
      chartDiv.style.padding = "10px";
      chartDiv.style.borderRadius = "4px";
      chartDiv.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
      chartDiv.style.zIndex = "99";
      chartDiv.style.width = "250px";
      chartDiv.style.height = "250px";
  
      const canvas = document.createElement("canvas");
      canvas.id = "pieChart";
      canvas.width = 250;
      canvas.height = 250;
      chartDiv.appendChild(canvas);
  
      document.body.appendChild(chartDiv);
  
      const ctx = canvas.getContext("2d");
      pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Fire Stations", "Hospitals", "Libraries", "Pasco Schools", "Police Stations"],
          datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              "#FF0000",
              "#0000FF",
              "#008000",
              "#FFA500",
              "#800080"
            ]
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }
  
    // -------------------------------------------------------------------
    // Update Pie Chart Data based on visible features.
    // -------------------------------------------------------------------
    function updatePieChart() {
      const layerLabels = [];
      const layerCounts = [];
      const backgroundColors = [];
      const queryPromises = [];
  
      layers.forEach(layer => {
        if (layer.title !== "Parks" && layer.visible) {
          const query = layer.createQuery();
          query.where = "1=1";
          query.geometry = view.extent;
          query.spatialRelationship = "intersects";
          query.returnGeometry = false;
          query.outFields = ["*"];
  
          const promise = layer.queryFeatures(query).then(function(result) {
            layerLabels.push(layer.title);
            layerCounts.push(result.features.length);
            backgroundColors.push(layer.customColor);
          });
          queryPromises.push(promise);
        }
      });
  
      Promise.all(queryPromises).then(() => {
        pieChart.data.labels = layerLabels;
        pieChart.data.datasets[0].data = layerCounts;
        pieChart.data.datasets[0].backgroundColor = backgroundColors;
        pieChart.update();
      });
    }
  
    // -------------------------------------------------------------------
    // Initialize UI Panels when view is ready.
    // -------------------------------------------------------------------
    view.when(() => {
      createBasemapToggle();
      createLayerToggle();
      createPieChartPanel();
      updatePieChart();
      view.watch("extent", updatePieChart);
    });
  });
  