
import enum
from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, Date, Enum
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

class BankType(str, enum.Enum):
    default = "default"
    custom = "custom"
    

class Loan(Base):
    __tablename__ = "loans"

    loan_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    amount = Column(Integer, nullable=False)
    interest = Column(Integer, nullable=False)
    startDate = Column(Date, nullable=False)
    endDate = Column(Date, nullable=False)
    debtNumber = Column(Integer, nullable=False)
    paidDebtNumber = Column(Integer, nullable=False)
    bank_id = Column(Integer, ForeignKey("banks.bank_id"), nullable=True)
    customBank_id = Column(Integer, ForeignKey("custom_banks.bank_id"), nullable=True)
    bankType = Column(Enum(BankType))
    note = Column(String(500), nullable=True)

class Bank(Base):
    __tablename__ = "banks"

    bank_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String(100), unique=True, index=True, nullable=False)
    img_URL =Column(String(500), nullable=True)

class CustomBank(Base):
    __tablename__ = "custom_banks"

    bank_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

class Debt(Base):
    __tablename__ = "debts"

    debt_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    loan_id = Column(Integer, ForeignKey("loans.loan_id"), nullable=False)
    amount = Column(Numeric(precision=100, scale=2), nullable=False)
    paidDate = Column(Date, nullable=True)
    deadline = Column(Date, nullable=False)