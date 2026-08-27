import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# The connection string to your local PostgreSQL database
# Format: postgresql://username:password@localhost/database_name
URL = "postgresql://postgres:123@localhost/portfolio_db"

if URL.startswith("postgres://"):
    URL = URL.replace("postgres://", "postgresql://", 1)
    
SQLALCHEMY_DATABASE_URL = URL
# Create the engine that drives the connection
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory to talk to the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# The base class we will use to create our database tables
Base = declarative_base()