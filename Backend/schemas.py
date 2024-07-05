from datetime import date
from enum import Enum
from typing import Optional
from decimal import ROUND_HALF_UP, Decimal
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


class BankBase(BaseModel):
    name: str = Field(max_length=100)
    img_URL: Optional[str] = Field(None, max_length=500)

class bankCreate(BankBase):
    pass

class Bank(BankBase):
    bank_id: int

    class Config:
        orm_mode = True
        from_attributes=True


class CustomBankBase(BaseModel):
    name: str = Field(max_length=100)

class CustomBankCreate(CustomBankBase):
    pass

class CustomBank(CustomBankBase):
    bank_id: int
    user_id: int

    class Config:
        orm_mode = True
        from_attributes=True


class DebtBase(BaseModel):
    loan_id: int
    amount: Decimal = Field(gt=0)
    paidDate: Optional[date] = None
    deadline: date

    @field_validator('amount', mode='before')
    def set_two_decimal_places(cls, v):
        if isinstance(v, (float, int)):
            v = Decimal(str(v))
        if isinstance(v, Decimal):
            return v.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        raise ValueError('amount must be a number')

class DebtCreate(DebtBase):
    pass

class Debt(DebtBase):
    debt_id: int

    class Config:
        orm_mode = True
        from_attributes=True


class BankType(str, Enum):
    default = "default"
    custom = "custom"

class LoanBase(BaseModel):
    amount: int = Field(gt=0)
    interest: int = Field(0, ge=0)
    startDate: date
    debtNumber: int
    paidDebtNumber: Optional[int] = 0
    bank_id: Optional[int] = None
    customBank_id: Optional[int] = None
    bankType: BankType = BankType.default
    note: Optional[str] = Field(None, max_length=500)

class LoanCreate(LoanBase):
    pass

class Loan(LoanBase):
    laon_id: int
    receiver_id: int
    endDate: date

    class Config:
        orm_mode = True
        from_attributes=True
class NotificationBase(BaseModel):
    title: str = Field(max_length=100)
    text : Optional[str] = Field(None, max_length=1000)
    isRead : bool
    user_id : int
    debt_id : Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    notification_id : int

    class Config:
        orm_mode = True
        from_attributes=True