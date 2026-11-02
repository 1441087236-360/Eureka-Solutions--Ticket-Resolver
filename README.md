Eureka Solutions . Ticker Resolver

● Objective<br>
Build a basic support-ticket system with ticket creation, status updates, and a summary dashboard.<br><br>
● Requirements
• Each ticket should have a subject, description, category, priority, status, and creation date.<br>
• Allow users to create and view tickets.<br>
• Allow ticket status to be updated to Open, In Progress, or Resolved.<br>
• Provide filters by status, category, and priority.<br>
• Display the total number of tickets and counts by status on a dashboard.<br>
• Keep a history of status changes with the previous status, new status, and timestamp.<br><br>
● Frontend<br>
• Create a ticket submission form, ticket list, ticket details view, and dashboard.<br>
• Use clear labels for ticket status and priority.<br>
• Show loading, empty, success, and error states.<br>
• Refresh the ticket information and dashboard after an update.<br><br>
● Backend<br>
• Create API endpoints to create, list, retrieve, and update tickets.<br>
• Store tickets and status history in a database.<br>
• Validate required fields and allowed status/priority values.<br>
• Calculate dashboard counts from stored data.<br>
• Handle invalid ticket IDs and server errors appropriately.<br><br><br>


● Setup <br>
Run these commands from the project root:<br>
npm install<br>
cd backend<br>
npm install<br>
cp .env.example .env<br>
cd ../frontend<br>
npm install<br>
cp .env.example .env<br>
cd ..<br><br><br>

Start MongoDB<br>
docker compose up -d mongodb<br>
docker compose ps<br><br>

cd backend<br>
npm run db:seed<br>
npm run dev<br>
The API runs at http://localhost:5000.<br><br>

Start the frontend (another terminal)<br>
cd frontend<br>
npm run dev<br>
curl http://localhost:5000/api/health<br><br>

API endpoints<br>
http://localhost:5000/api<br><br><br>


GET	/health	<br>
POST	/tickets	Create a ticket<br>
GET	/tickets	List tickets<br>
GET	/tickets/:id	<br>
PATCH	/tickets/:id/status	<br>
GET	/tickets/:id/history	<br>
POST	/tickets/:id/comments	<br>
GET	/tickets/:id/comments	<br>
GET	/dashboard/summary	<br><br><br>


Create a ticket<br>
POST /tickets<br><br>

Example JSON body:<br>
{<br>
  "subject": "Unable to log in",<br>
  "description": "I cannot access my account even though my login details are correct.",<br>
  "category": "Account",<br>
  "priority": "High"<br>
}<br><br>

GET /tickets<br>
<br><br><br>


Example JSON body:<br>
{<br>
  "status": "In Progress",<br>
  "changedBy": "Support Agent"<br>
}<br><br>

GET /tickets/:id/history<br><br>

POST /tickets/:id/comments<br><br>

Example JSON body:<br>
{<br>
  "authorName": "Support Agent",<br>
  "message": "We are checking the reported problem."<br>
}<br>
<br><br>
Ticket number	Subject	  Category	Priority	Current status<br>
TKT-2026-A10001	Unable to log in to my account	Account	High	Open<br><br>

<p align="center"><br>
  <img src="frontend/src/assets/1.png" /><br>
</p><br><br>

<p align="center"><br>
  <img src="frontend/src/assets/2.png" /><br>
</p><br><br>

<p align="center"><br>
  <img src="frontend/src/assets/3.png" /><br>
</p><br><br>

<p align="center"><br>
  <img src="frontend/src/assets/4.png" /><br>
</p><br>
