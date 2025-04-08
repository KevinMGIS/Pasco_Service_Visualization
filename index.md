---
layout: default
title: "County Service Visualizations: Pasco & Hillsborough"
---

# County Service Visualizations: Pasco & Hillsborough

This project features two interactive maps that display public service data at the county level. Each map has been developed using a different approach and technology stack, highlighting the strengths and tradeoffs of proprietary versus open source solutions.

## Pasco County Interactive Map

The Pasco County map is built using the **ArcGIS API for JavaScript**. Key technical features include:

- **Data Integration:**  
  GeoJSON files were directly integrated into a code-first environment.
  
- **Custom Symbology and Interactivity:**  
  Each layer is rendered with a unique, color-coded renderer—including transparency for polygon layers—and includes clustering for point data. An interactive pie chart (built with **Chart.js**) dynamically updates to reflect the number of visible features within the current map extent.

- **Basemap Toggle:**  
  A custom control allows users to switch among various basemaps, providing flexibility in visual presentation.

This approach emphasizes granular control over the visualization and interactivity, enabling dynamic querying and custom user interface elements.

## Hillsborough Services Visualization

In contrast, the Hillsborough map was developed using open source technologies, primarily leveraging the **Leaflet** mapping library. Notable aspects include:

- **Open Source Stack:**  
  Leaflet was used to build the map, taking advantage of its extensive community support and flexible plugin ecosystem.
  
- **Data Display:**  
  Public service data was also prepared in GeoJSON format, which was then integrated into the Leaflet framework for visualization.
  
- **Rapid Configuration:**  
  The open source approach facilitated a quick setup using community-driven tools and plugins, focusing on ease of deployment and cost-effective development.

This methodology underscores a flexible and community-oriented approach, highlighting how robust interactive maps can be developed using freely available tools.

## Explore the Maps

- [Pasco County Interactive Map](https://kevinmgis.github.io/Pasco_Service_Visualization/map.html)
- [Hillsborough Services Visualization](https://kevinmgis.github.io/Hillsborough_Service_Visualization/map.html)

The two maps provide complementary perspectives on spatial data visualization by comparing a code-first, proprietary solution with a rapid, open source implementation.
