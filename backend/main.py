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

# 2. CREATE ROUTE: Save a new menu item
@app.post("/items/", response_model=schemas.MenuItemResponse)
def create_item(item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    db_item = models.MenuItem(name=item.name, category=item.category, price=item.price)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 3. READ ROUTE: Get all menu items
@app.get("/items/", response_model=list[schemas.MenuItemResponse])
def read_items(db: Session = Depends(get_db)):
    items = db.query(models.MenuItem).all()
    return items

# 4. DELETE ROUTE: Remove a menu item
@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"status": "success", "message": f"Item {item_id} deleted"}