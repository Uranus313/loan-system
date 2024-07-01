from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator



class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=50)
    firstName: Optional[str] = Field(None, max_length=100)
    middleName: Optional[str] = Field(None, max_length=100)
    lastName: Optional[str] = Field(None, max_length=100)
    dateOfBirth: Optional[date] = None
    IDNumber: Optional[str] = None

    @field_validator("IDNumber")
    def validate_IDNumber(cls, value):
        if value:
            if len(value) != 10 or any(not char.isdigit() for char in value):
                raise ValueError("ID Number must contain only 10 digits")
            return value

    @field_validator("password")
    def validate_password(cls, value):
        if value:
            if not any(char.isdigit() for char in value):
                raise ValueError("Password must contain at least one digit")
            if not any(char.islower() for char in value):
                raise ValueError("Password must contain at least one lowercase letter")
            if not any(char.isupper() for char in value):
                raise ValueError("Password must contain at least one uppercase letter")
            return value

class UserBase(BaseModel):
    username: str = Field(max_length=100)
    email: EmailStr = Field(max_length=100)
    firstName: str = Field(max_length=100)
    middleName: Optional[str] = Field(None, max_length=100)
    lastName: str = Field(max_length=100)
    dateOfBirth: date
    IDNumber: str

    @field_validator("IDNumber")
    def validate_IDNumber(cls, value):
        if len(value) != 10 or any(not char.isdigit() for char in value):
            raise ValueError("ID Number must contain only 10 digits")
        return value


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=50)

    @field_validator("password")
    def validate_password(cls, value):
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one digit")
        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter")
        return value

class User(UserBase):
    user_id: int

    class Config:
        orm_mode = True
        from_attributes=True