# 🌍 D3 World Population Growth Map

An interactive choropleth map visualizing **annual population growth rates by country** (2017), built with D3.js v7 and World Bank data.

![D3 World Map](https://img.shields.io/badge/D3.js-v7-orange?style=flat-square&logo=d3.js)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

![World Map](world_map.png)

| Tooltip — Estonia | Tooltip — Finland |
|---|---|
| ![Estonia](tooltip_Estonia.png) | ![Finland](tooltip_Finland.png) |

---

## What it does

- Renders a world map using the **Equal Earth projection**
- Colors each country on a **blue → white → red diverging scale** (decline → growth)
- Shows country name and exact growth % on **hover tooltip**
- Pins **your current location** via browser geolocation API

## Data sources

Data files are not included in the repo due to size — download them and place in the project root:

- **[World Bank — Population Growth (annual %)](https://data.worldbank.org/indicator/SP.POP.GROW)** → save as `world_bank_data.csv`
- **[Natural Earth — Admin 0 Countries](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/)** → convert to `world-geojson.json` via [mapshaper.org](https://mapshaper.org/)

