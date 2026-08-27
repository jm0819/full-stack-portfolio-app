from sqlalchemy import Column, Integer, String, Float
from database import Base

class MenuItem(Base):
    __tablename__ = "menu_items" # This creates a brand new table in PostgreSQL

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True) # e.g., "Main Course", "Drink", "Dessert"
    price = Column(Float) # We use Float to handle decimals for prices