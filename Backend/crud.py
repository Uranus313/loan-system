from datetime import timedelta, date
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

def get_users(db: Session, skip: int | None=None, limit: int | None=None):
    return db.query(models.User).order_by(models.User.user_id).offset(skip).limit(limit).all()

def get_admins(db: Session, skip: int | None=None, limit: int | None=None):
    return db.query(models.User).filter(models.User.isAdmin == True).\
        order_by(models.User.user_id).offset(skip).limit(limit).all()

def register_user(db: Session, user: schemas.UserCreate):
    hashed_user_password = hashing.get_password_hash(user.password)
    db_user = models.User(username=user.username.lower() ,email=user.email.lower(), isAdmin=user.isAdmin, firstName=user.firstName, middleName=user.middleName,
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

def get_user_loans(db: Session, user_id: int):
    results =  db.query(models.Loan, models.Bank, models.CustomBank).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
        outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.customBank_id).\
            filter(models.Loan.receiver_id == user_id).order_by(models.Loan.loan_id).all()

    loans = []
    for loan, bank, customBank in results:
        loan_dict = model_to_dict(loan)
        loan_dict['bank'] = bank if bank else None
        loan_dict['customBank'] = customBank if customBank else None

        debts = db.query(models.Debt).filter(models.Debt.loan_id == loan.loan_id).order_by(models.Debt.debt_id).all()

        loan_dict['debts'] = [(debt) for debt in debts] if debts else []
        loans.append(loan_dict)

    return loans

def get_user_debt_loan(db: Session, user_id: int, debt_id: int):
    db_debt = db.query(models.Debt).filter(models.Debt.debt_id == debt_id).first()

    if not db_debt:
        return None

    result = db.query(models.Loan, models.Bank, models.CustomBank).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
            outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.customBank_id).\
            filter(models.Loan.receiver_id == user_id).filter(models.Loan.loan_id == db_debt.loan_id).first()
    
    if not result:
        return None

    loan, bank, customBank = result
    loan_dict = model_to_dict(loan)
    loan_dict['bank'] = bank if bank else None
    loan_dict['customBank'] = customBank if customBank else None

    return loan_dict

def get_loans(db: Session):
    results =  db.query(models.Loan, models.User, models.Bank, models.CustomBank).\
        outerjoin(models.User, models.User.user_id == models.Loan.receiver_id).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
        outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.customBank_id).order_by(models.Loan.loan_id).all()

    loans = []
    for loan, user, bank, customBank in results:
        loan_dict = model_to_dict(loan)
        if user:
            user_dict = model_to_dict(user)
            user_dict.pop('password')
            loan_dict['user'] = user_dict
        else:
            loan_dict['user'] = None

        loan_dict['bank'] = model_to_dict(bank) if bank else None
        loan_dict['customBank'] = model_to_dict(customBank) if customBank else None

        debts = db.query(models.Debt).filter(models.Debt.loan_id == loan.loan_id).order_by(models.Debt.debt_id).all()

        loan_dict['debts'] = [(debt) for debt in debts] if debts else []
        loans.append(loan_dict)

    return loans

def validate_user_loan(db: Session, loan_id: int, user_id: int|None=None):
    if user_id:
        return db.query(models.Loan).filter(models.Loan.receiver_id == user_id, models.Loan.loan_id == loan_id).first()
    return db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()

def register_user_loan(db: Session, user_id: int, loan:schemas.LoanCreate):
    endDate = loan.startDate + timedelta(days=loan.debtNumber*30)

    db_loan = models.Loan(receiver_id=user_id, **loan.model_dump(), endDate=endDate)
    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)

    deadline = loan.startDate
    amount = float(loan.amount/loan.debtNumber) * (100 + loan.interest)/100
    for _ in range(loan.debtNumber):
        deadline += timedelta(days=30)
        debt = schemas.DebtCreate(loan_id=db_loan.loan_id, amount=amount, deadline=deadline)
        db_debt = models.Debt(**debt.model_dump())
        db.add(db_debt)
        db.commit()
        db.refresh(db_debt)

    result = db.query(models.Loan, models.Bank, models.CustomBank).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
            outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.customBank_id).\
            filter(models.Loan.receiver_id == user_id).filter(models.Loan.loan_id == db_loan.loan_id).first()
    
    debts = db.query(models.Debt).filter(models.Debt.loan_id == db_loan.loan_id).all()

    loan, bank, customBank = result
    loan_dict = model_to_dict(loan)
    loan_dict['bank'] = bank if bank else None
    loan_dict['customBank'] = customBank if customBank else None
    loan_dict['debts'] = [debt for debt in debts] if debts else []

    return loan_dict

def get_user_banks(db: Session, user_id: int):
    banks = db.query(models.Bank).all()
    customBanks = db.query(models.CustomBank).filter(models.CustomBank.user_id == user_id).all()

    banks_dict = {}
    banks_dict['banks'] = [bank for bank in banks] if banks else []
    banks_dict['customBanks'] = [customBank for customBank in customBanks] if customBanks else []

    return banks_dict

def register_user_customBank(db: Session, user_id: int, customBank: schemas.CustomBankCreate):
    db_customBank = models.CustomBank(user_id=user_id, **customBank.model_dump())
    db.add(db_customBank)
    db.commit()
    db.refresh(db_customBank)

    return db_customBank

def register_bank(db: Session, bank: schemas.bankCreate):
    db_bank = models.Bank(**bank.model_dump())
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)

    return db_bank

def delete_user_customBank(db: Session, user_id: int, bank_id: int):
    db_customBank = db.query(models.CustomBank).filter(models.CustomBank.user_id == user_id).\
        filter(models.CustomBank.bank_id == bank_id).first()

    db.query(models.CustomBank).filter(models.CustomBank.user_id == user_id).\
        filter(models.CustomBank.bank_id == bank_id).delete()
    db.commit()

    return db_customBank
def delete_loan(db: Session, loan_id: int):
    db_customBank = db.query(models.Loan).filter(models.Loan.loan_id == loan_id).first()

    db.query(models.Loan).filter(models.Loan.loan_id  == loan_id).delete()
    db.commit()

    return db_customBank
def get_loan_debts(db: Session, loan_id: int):
    return db.query(models.Debt).filter(models.Debt.loan_id == loan_id).all()

def update_user_debt(db: Session, loan_id: int, paidDebt: date):
    db_debt = db.query(models.Debt).filter(models.Debt.loan_id == loan_id, models.Debt.paidDate == None).\
        order_by(models.Debt.deadline).first()

    if db_debt:
        db_debt.paidDate = paidDebt

        db.query(models.Loan).filter(models.Loan.loan_id == loan_id).\
            update({models.Loan.paidDebtNumber: models.Loan.paidDebtNumber + 1})

        db.commit()

    return db_debt

def update_user_debts(db: Session, user_id: int, loan_id: int, paidDebt: date):
    db_debts = db.query(models.Debt).filter(models.Debt.loan_id == loan_id, models.Debt.paidDate == None).\
        order_by(models.Debt.deadline).all()
    
    if not db_debts:
        return None

    for db_debt in db_debts:
        db_debt.paidDate = paidDebt
        db.commit()

    db.query(models.Loan).filter(models.Loan.loan_id == loan_id).\
        update({models.Loan.paidDebtNumber: models.Loan.debtNumber})
    db.commit()
    
    result = db.query(models.Loan, models.Bank, models.CustomBank).outerjoin(models.Bank, models.Bank.bank_id == models.Loan.bank_id).\
            outerjoin(models.CustomBank, models.CustomBank.bank_id == models.Loan.customBank_id).\
            filter(models.Loan.receiver_id == user_id).filter(models.Loan.loan_id == loan_id).first()
    
    debts = db.query(models.Debt).filter(models.Debt.loan_id == loan_id).all()

    loan, bank, customBank = result
    loan_dict = model_to_dict(loan)
    loan_dict['bank'] = bank if bank else None
    loan_dict['customBank'] = customBank if customBank else None
    loan_dict['debts'] = [debt for debt in debts] if debts else []

    return loan_dict

def register_notification(db: Session, Notification: schemas.NotificationCreate, admin_id: int|None=None):
    db_notificationn = models.Notification(sender_id=admin_id, **Notification.model_dump())
    db.add(db_notificationn)
    db.commit()
    db.refresh(db_notificationn)

    return db_notificationn

def validate_user_notification(db: Session, user_id: int, notification_id: int):
    return  db.query(models.Notification).filter(models.Notification.user_id == user_id,
                                                 models.Notification.notification_id == notification_id).first()

def update_user_notifications(db: Session, updated_notifications: list[schemas.NotificationUpdate]):
    db_notifications = []

    for updated_notification in updated_notifications:
        db_notification = db.query(models.Notification).filter(models.Notification.notification_id == updated_notification.notification_id).first()
        db_notification.isRead = updated_notification.isRead
        db.commit()
        db_notifications.append(db_notification)

    return db_notifications

def get_user_notifications(db: Session, user_id: int):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.notification_id.desc()).all();l

def get_admin_notifications(db: Session, user_id: int):
    return db.query(models.Notification).filter(models.Notification.sender_id == user_id).order_by(models.Notification.notification_id.desc()).all()

def get_admin_to_user_notifications(db: Session, admin_id: int, user_id: int):
    return db.query(models.Notification).filter(models.Notification.sender_id == admin_id, models.Notification.user_id == user_id)\
        .order_by(models.Notification.notification_id).all()

def get_loan_notifications(db: Session, loan_id: int):
    debts = db.query(models.Debt).filter(models.Debt.loan_id == loan_id).all()

    notifications = []
    for debt in debts:
        notification = db.query(models.Notification).filter(models.Notification.debt_id == debt.debt_id).first()
        if notification:
            notifications.append(notification)
    
    return notifications

def register_admin(db: Session, user_id: int):
    db.query(models.User).filter(models.User.user_id == user_id).update({models.User.isAdmin: True})
    db.commit()

    return db.query(models.User).filter(models.User.user_id == user_id).first()

def remove_admin(db: Session, user_id: int):
    db.query(models.User).filter(models.User.user_id == user_id).update({models.User.isAdmin: False})
    db.commit()

    return db.query(models.User).filter(models.User.user_id == user_id).first()
