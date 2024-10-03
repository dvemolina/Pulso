# PULSO 
The platform for the future of the Snowsports World

First sketch for an MVP of the platform.
Pulso de Nieve is an idea to bring a bit more of today's technology into the Mountain and Snow Sports world. 
Aimed to Ski & Snowboard Instructors to help them get more recognition and compensation for their labour, by connecting them directly to the potential clients, giving them tools to manage their own prices and fares, schedue and availability.

The actual stack is made to go around the main ways of building things and do it basically for 0$. Broke development.
Pure vanilla JS, HTML and CSS for everything.
For the back-end a real and awful frankenstein of 4 different API's as serverless functions in Vercel using NodeJs in conjunction with express following an MVC pattern and 2 Webapps deployed using G.A.S, managing: 
  - User signups, logins & custom auth.
  - Database CRUD operations using MongoDb in conjunction with Google Sheets.
  - Booking and Availability System
  - Dashboard system as WebApp deployed with G.A.S using some iframe workaround to get rid of Google's watermarks and other annoying details.

I did this just for testing purposes but I fell so much in love with the potentiallity of the idea that I feel obliged to develop it with a more robust, maintainable & scalable architecture and infrastructure. 

