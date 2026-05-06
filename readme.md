# Skyline Weather App

## Purpose
**Skyline Weather App** is a high-performance weather dashboard designed for users who want accurate meteorological data without the clutter of traditional news-heavy weather sites. While many platforms are saturated with advertisements and unnecessary articles, Skyline focuses on immediate, actionable data.

The application allows users to search for real-time weather conditions and 5-day forecasts for any city globally. It is designed to be a "daily companion" for three primary use-cases: daily commuters planning their outfits, travelers checking destination climates, and outdoor enthusiasts monitoring environmental conditions.

The goal is to provide a seamless interface where a user can enter a city name and instantly receive a visual and data-driven summary of the environment.

## User Stories
### As a Daily Commuter
- I want to see the current temperature and "feels like" reading so that I can decide what to wear before leaving the house.
- I want to see the 5-day forecast so that I can plan my travel for the upcoming work week.

### As a Traveller
- I want to search for weather in different cities globally so that I can pack appropriately for my trip.
- I want a history of my recently searched cities so that I can quickly toggle between my home and my destination[cite: 1, 3].

### As an Outdoor Enthusiast
- I want to check wind speeds and humidity levels so that I can determine if it is a good day for cycling or hiking.
- I want to see visual icons representing the weather so that I can understand the conditions at a glance.

## UX Design

### Strategy Plane
- **Target Audience**: Commuters, students, travelers, and general users seeking quick weather updates.
- **User Needs**: Rapid data retrieval, mobile-friendly interface, and high-contrast visuals for outdoor viewing.
- **Rationale**: The project bridges the gap between complex meteorological tools and simple widgets, providing a "middle-ground" dashboard that is both lightweight and informative.

### Scope Plane
- **Project Requirements**: A fully responsive single-page application featuring a dynamic search bar, local storage for search history, and real-time API integration.
- **Content Requirements**: Current weather metrics (Temp, Humidity, Wind, UV Index), 5-day forecast cards, and a search history sidebar.
- **Out of Scope**: Historical weather data, interactive radar maps, and user account creation.

### Structure Plane
- **Information Hierarchy**: The search interface is positioned prominently at the top. Current weather is the largest element, followed by a secondary grid for the 5-day forecast.
- **Interaction Feedback**: Buttons use subtle transitions on hover. The search history updates instantly when a new city is successfully called.

### Skeleton Plane
- **Wireframes**: Initial layouts were planned to ensure that even on mobile, the most vital information remains "above the fold".
    - 📄 [Dashboard](docs/wireframes/dashboard.png) - Features the app branding and a persistent search input.
    - A large hero section for the current city, followed by a horizontal row of cards.

### Surface Plane
- **Colour Palette**: A professional, high-contrast palette using deep blues and slate greys to ensure readability.
- **Font**: Inter / Roboto - Used for all body text and data readouts for maximum legibility.
- **Accessibility**: All images/icons include descriptive alt text or ARIA labels. Semantic HTML elements are used to provide clear structure.

### Design Evolution
TBD

## Features
### Search and History
- **Global Search**: Find weather data for any city in the world using the Open Metro API.
- **Search History**: The app saves recently searched cities to `localStorage`.

### Real-Time Dashboard
- **Dynamic Current Weather**: Displays the city name, date, weather icon, temperature, humidity, and wind speed.
- **UV Index Indicator**: Includes a color-coded badge indicating favorable, moderate, or severe levels.

## Future Development
TBD