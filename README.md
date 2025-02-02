# Orderly
Orderly scrapes SRM Academia to fetch the current day order and seamlessly
syncs your class schedule with Google Calendar.

Just log in once, save your timetable and let Orderly handle the rest. Your calendar will update automatically every day.

##  Features
- **Automated Day Order Scraping** – Uses Puppeteer to scrape the daily order from Academia.
- **Google Calendar Integration** – Syncs your classes automatically based on your saved timetable.
- **Real-Time Monitoring** – Powered by BullMQ for reliable job handling for errors and retries. Uses BullBoard to track job execution and logs.

##  Usage
1. Log in using your Google account.
2. Add your subjects
3. Go to edit timetable and add your classes for each day order
4. **Save your timetable** in the app
5. Enable automated events
6. Click **Manual Trigger** to add your schedule into google calendar the first time **(Optional)**


Orderly will now scrape academia daily at midnight and your classes into your google calendar


##  Tech Stack
### **Backend**
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [BullMQ](https://docs.bullmq.io/) - Job queue for handling background tasks like scraping and calendar event scheduling for mutliple users.
- [BullBoard](https://github.com/felixmosh/bull-board) – UI dashboard for monitoring job queues.
- [Google APIs](https://developers.google.com/) – For authentication and Google Calendar integration.
- [Puppeteer](https://pptr.dev/) – Headless browser for web scraping.
- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### **Frontend**
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Shadcn](https://ui.shadcn.com/)
- [MagicUI](https://magicui.design/)
- [TsParticles](https://github.com/matteobruni/tsparticles)

### **Deployment**
- **Backend:** AWS EC2
- **Frontend:** Vercel

## App Preview

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/999d7624-be3e-468a-830d-1367662f0370" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/c0bdb96f-3590-47a7-9ac2-0e15545d0629" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/337b2116-7e5d-4267-acd2-0d419c528d6a" />

### Google Calendar

<img width="1439" alt="image" src="https://github.com/user-attachments/assets/571fd94f-76f2-406c-a5a7-6a09380c9f76" />

### Bull Board

<img width="1438" alt="image" src="https://github.com/user-attachments/assets/cffcd1cc-1920-41d0-aa11-49569f0c26bf" />
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/95388160-477d-4b85-bc98-7b8215135a68" />
<img width="1384" alt="image" src="https://github.com/user-attachments/assets/c88ff7ca-c3aa-42e9-9612-248c0d9e3f4b" />



## Installation & Setup
### **Backend**
1. Clone the repository:
   ```sh
   git clone https://github.com/swebi/Orderly.git
   cd server
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set up environment variables in a .env file:
   ```env
	EMAIL = <SRM Academia email>
	PASSWORD = <SRM Academia password>
	DATABASE_URL= <Postgres URL>
	CLIENT_ID= <Google Client ID>
	CLIENT_SECRET= <Google Client Secret>
	SERVER_URL= <Backend URL>
	REDIRECT_URL= <Backend endpoint for google auth redirect>
	ADMIN_PASSWORD= <String>
	CLIENT_URL= <Frontend URL>
   ```
4. Run database migrations:
   ```sh
   pnpm dlx prisma db push
   ```
5. Start the server:
   ```sh
   pnpm dev
   ```

### **Frontend**
1. Navigate to the frontend folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set up environment variables in a .env file:
   ```env
	VITE_PUBLIC_SERVER_URL = <Backend URL>
	VITE_PUBLIC_GITHUB_URL = <GitHub URL>
   ```
4. Start the server:
   ```sh
   pnpm dev
   ```


