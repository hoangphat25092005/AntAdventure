from fastapi import FastAPI
from typing import Annotated
from pydantic import BaseModel, EmailStr

class Login(BaseModel):
    username: str
    password: str

app = FastAPI()

@app.post("/login")
async def login(login: Login):
    return {"username": login.username, "password": login.password}

