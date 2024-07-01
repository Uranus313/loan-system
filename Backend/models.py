from sqlalchemy import Column, ForeignKey, Integer, String, Date
from database import Base



class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    firstName =Column(String(100), nullable=False)
    middleName = Column(String(100), nullable=True)
    lastName = Column(String(100), nullable=False)
    password = Column(String(100))
    dateOfBirth = Column(Date, nullable=False)
    IDNumber = Column(String(100), unique=True, index=True, nullable=False)