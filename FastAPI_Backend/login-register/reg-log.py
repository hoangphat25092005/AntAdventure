from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Form

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str = Form(...)
    password: str = Form(...)
    confirmpassword: str = Form(...)

class Login(BaseModel):
    username: str = Form(...)
    password: str = Form(...)

# In-memory storage (use database in real apps)
users = {}

@app.post("/register")
async def register(user: User):
    if user.username in users:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if user.password != user.confirmpassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Store user
    users[user.username] = user.password
    
    # Redirect to login page with a valid response body
    return JSONResponse(content={"redirect_url": "http://localhost:3001/login"}, status_code=200)

@app.post("/login")
async def login(login: Login):
    if login.username not in users:
        return JSONResponse(content={"redirect_url": "http://localhost:3001/register"}, status_code=200)
    
    if login.password != users[login.username]:
        return JSONResponse(content={"detail": "Incorrect password"}, status_code=400)

    # Redirect to home page if login is successful
    return JSONResponse(content={"redirect_url": "http://localhost:3001/home"}, status_code=200)
