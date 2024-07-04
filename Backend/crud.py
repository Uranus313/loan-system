from datetime import timedelta
from enum import Enum
from sqlalchemy import inspect
from sqlalchemy.orm import Session
import models, schemas, hashing



def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email.lower()).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username.lower()).first()

def get_user_by_IDNumber(db: Session, IDNumber: int):
    return db.query(models.User).filter(models.User.IDNumber == IDNumber).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_users(db: Session, skip: int, limit: int):
    return db.query(models.User).order_by(models.User.user_id).offset(skip).limit(limit).all()

def register_user(db: Session, user: schemas.UserCreate):
    hashed_user_password = hashing.get_password_hash(user.password)
    db_user = models.User(username=user.username.lower() ,email=user.email.lower(), firstName=user.firstName, middleName=user.middleName,
                          lastName=user.lastName ,password=hashed_user_password, dateOfBirth=user.dateOfBirth, IDNumber=user.IDNumber)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_by_email(db: Session, email: str, password: str):
    db_user = get_user_by_email(db, email)
    if db_user and hashing.verify_password(password, db_user.password):
        return db_user
    
def login_by_username(db: Session, username: str, password: str):
    db_user = get_user_by_username(db, username)
    if db_user and hashing.verify_password(password, db_user.password):
        return db_user

def validate_user(db: Session, user_id: int, password: str):
    db_user = get_user_by_id(db, user_id)
    if db_user and hashing.verify_password(password, db_user.password):
        return db_user

def update_user(db: Session, user_id: int, updated_user: schemas.UserUpdate):
    if updated_user.email:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.email: updated_user.email.lower()})

    if updated_user.username:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.username: updated_user.username.lower()})

    if updated_user.password:
        hashed_password = hashing.get_password_hash(updated_user.password)
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.lastName: hashed_password})

    if updated_user.firstName:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.firstName: updated_user.firstName})

    if updated_user.middleName:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.middleName: updated_user.middleName})

    if updated_user.lastName:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.lastName: updated_user.lastName})

    if updated_user.dateOfBirth:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.dateOfBirth: updated_user.dateOfBirth})

    if updated_user.IDNumber:
        db.query(models.User).filter(models.User.user_id == user_id).update({models.User.IDNumber: updated_user.IDNumber})

    db.commit()
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def delete_user(db: Session, user_id: int):
    db_user = get_user_by_id(db, user_id)
    db.query(models.User).filter(models.User.user_id == user_id).delete()
    db.commit()
    return db_user

def model_to_dict(model):
    """Convert SQLAlchemy model instance to dictionary."""
    return {c.key: getattr(model, c.key) for c in inspect(model).mapper.column_attrs}

def get_user_loan(db: Session, user_id: int):

    class BankType(str, Enum):
        default = "default"
        custom = "custom"

    results =  db.query(models.Loan, models.Bank, models.CustomBank).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
        outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.bank_id).\
            filter(models.Loan.receiver_id == user_id).all()

    loans = []
    for loan, bank, customBank in results:
        loan_dict = model_to_dict(loan)
        loan_dict['bank'] = bank if bank and loan.bankType==BankType.default else None
        loan_dict['customBank'] = customBank if customBank and loan.bankType==BankType.custom else None

        debts = db.query(models.Debt).filter(models.Debt.loan_id == loan.loan_id).all()

        loan_dict['debts'] = [(debt) for debt in debts] if debts else []
        loans.append(loan_dict)

    return loans

def register_loan(db: Session, user_id: int, loan:schemas.LoanCreate):

    class BankType(str, Enum):
        default = "default"
        custom = "custom"

    endDate = loan.startDate + timedelta(days=loan.debtNumber*30)

    db_loan = models.Loan(receiver_id=user_id, **loan.model_dump(), endDate=endDate)
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)

    deadline = loan.startDate
    amount = float(loan.amount/loan.debtNumber) * (100 + loan.interest)/100
    for _ in range(loan.debtNumber):
        deadline += timedelta(days=30)
        db_debt = models.Debt(loan_id=db_loan.loan_id, amount=amount, deadline=deadline)
        db.add(db_debt)
        db.commit()
        db.refresh(db_debt)

    result = db.query(models.Loan, models.Bank, models.CustomBank).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
            outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.bank_id).\
            filter(models.Loan.receiver_id == user_id).filter(models.Loan.loan_id == db_loan.loan_id).first()
    
    debts = db.query(models.Debt).filter(models.Debt.loan_id == db_loan.loan_id).all()

    loan, bank, customBank = result
    loan_dict = model_to_dict(loan)
    loan_dict['bank'] = bank if bank and loan.bankType==BankType.default else None
    loan_dict['customBank'] = customBank if customBank and loan.bankType==BankType.custom else None
    loan_dict['debts'] = [debt for debt in debts] if debts else []

    return loan_dict

def get_user_banks(db: Session, user_id: int):
    
    banks = db.query(models.Bank).all()
    customBanks = db.query(models.CustomBank).filter(models.CustomBank.user_id == user_id).all()

    banks_dict = {}
    banks_dict['banks'] = [bank for bank in banks] if banks else []
    banks_dict['customBanks'] = [customBank for customBank in customBanks] if customBanks else []

    return banks_dict
