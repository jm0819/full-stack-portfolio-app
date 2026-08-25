from pydantic import BaseModel

# What data we expect when someone creates a new user
class UserCreate(BaseModel):
    name: str
    email: str

# What data our API sends back (includes the database-generated ID)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True