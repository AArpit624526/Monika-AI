# Monika-AI

## Description
Monika-AI is an interactive chatbot that serves as a companion for users, incorporating advanced AI technologies to provide personalized conversations and tasks.

## Features
- Natural language processing for seamless conversation
- Customizable personality and responses
- Integration with various APIs for enhanced functionalities
- User-friendly interface
- Multi-platform support

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Model**: TensorFlow, OpenAI's GPT
- **Deployment**: Docker, Heroku

## Setup Instructions
1. Clone the repository: `git clone https://github.com/tagadearpit/Monika-AI.git`
2. Navigate to the directory: `cd Monika-AI`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Folder Structure
```
Monika-AI/
├── client/          # Frontend code
├── server/          # Backend code
├── models/          # Database models
├── routes/          # API routes
├── public/          # Static files
└── README.md
```

## Deployment Info
To deploy the application:
1. Ensure Docker is installed.
2. Build the Docker image: `docker build -t monika-ai .`
3. Run the container: `docker run -p 4000:4000 monika-ai`
4. Access the app at `http://localhost:4000`
