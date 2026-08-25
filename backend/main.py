from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <-- New Import
from sqlalchemy.orm import Session
from sqlalchemy import text
import models, schemas
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# <-- New CORS Configuration -->
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any frontend to connect during local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Health check route
@app.get("/check-db")
def check_database_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Successfully connected to portfolio_db!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# 2. CREATE ROUTE: Save a new user into PostgreSQL
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new database record
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 3. READ ROUTE: Get all users from PostgreSQL
@app.get("/users/", response_model=list[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# 4. DELETE ROUTE: Remove a user from PostgreSQL
@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    # Find the user by their ID
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the user and save changes
    db.delete(user)
    db.commit()
    return {"status": "success", "message": f"User {user_id} deleted"}