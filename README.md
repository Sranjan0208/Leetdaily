# LeetDaily

LeetDaily is a productivity-focused app designed to help users improve their problem-solving skills by sending a curated set of **LeetCode** questions daily. It also includes an **AI tutor** that assists with computer science topics by evaluating user-submitted answers and providing detailed feedback.

## 🚀 Features

### 📌 LeetCode Question Manager

- Get **n number of LeetCode questions** based on difficulty every day.
- Solve the problems directly from the app.
- **Star** questions to revisit later.
- **Mark questions as complete** to track progress.

### 🎓 AI Tutor

- Provides AI-generated questions on the following topics:
  - **DBMS**
  - **Operating Systems (OS)**
  - **Computer Networking**
  - **JavaScript (JS)**
  - **Node.js**
- Users can submit answers, and the AI tutor will provide **detailed feedback** to help improve understanding.

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, ShadCN
- **Backend:** Node.js, PostgreSQL, Drizzle ORM
- **Authentication:** Auth.js
- **AI Integration:** Google Gemini API

## 📦 Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Sranjan0208/Leetdaily
   cd leetdaily
   ```

2. Install dependencies:

   ```sh
   pnpm
   ```

3. Set up environment variables in a `.env` file:

   ```env
   DATABASE_URL=your_postgresql_database_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run database migrations:

   ```sh
   pnpm db:migrate
   ```

5. Start the development server:
   ```sh
   pnpm dev
   ```

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository, open issues, or submit pull requests to improve LeetDaily.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

### 🔗 Connect with Us

- GitHub: [Sranjan0208](https://github.com/Sranjan0208)
- Twitter: [@SujalRanjan](https://x.com/SujalRa81842273)
- Email: sranjan0208@gmail.com

Happy coding! 🚀
