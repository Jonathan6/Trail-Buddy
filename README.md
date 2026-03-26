# Trail Buddy

A web application for searching hiking trails by city, viewing trail details, and checking a 5-day weather forecast for any selected trail.

🔗 **Live Demo:** [Trail Buddy](https://jonathan6.github.io/Trail-Buddy/)

![Screenshot](/assets/images/screenshot.png)

---

## Built With

- **Languages:** HTML, CSS, JavaScript
- **Tools & Services:** National Park Service (NPS) API, OpenWeather API

---

## How It's Made

Trail Buddy integrates two server-side APIs to deliver trail discovery and weather data in a single interface. The NPS API handles trail search and detail retrieval by city, while the OpenWeather API returns a 5-day forecast tied to the selected trail's location. Both data sources are combined on the client side to give users actionable information before heading out.

---

## Lessons Learned

- Coordinating multiple asynchronous API calls requires deliberate state management to ensure dependent data renders in the correct order.
- A structured Git workflow (feature branches, pull requests) is essential in multi-developer projects — merge conflicts are largely preventable with consistent discipline.
- Bulma's documentation is approachable, but its utility class conventions require upfront familiarization to use effectively at scale.

---

## Contact

**Project Repository:** [https://github.com/jonathan6/Trail-Buddy](https://github.com/jonathan6/Trail-Buddy)

---

## Acknowledgments

- [National Park Service API](https://www.nps.gov/subjects/developer/api-documentation.htm) — trail data
- [OpenWeather API](https://openweathermap.org/api) — 5-day weather forecast
- Background images via [Unsplash](https://unsplash.com/)
