from typing import Annotated
from fastapi import Body, Depends, FastAPI, HTTPException, Request, Response, status
from datetime import timedelta, date
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import crud, models, schemas, tokens, re

# import smtplib
# Import the email modules we'll need
# from email.mime.text import MIMEText

# msg = MIMEText("hello")
# # me == the sender's email address
# # you == the recipient's email address
# msg['Subject'] = 'The contents of goodbye' 
# msg['From'] = "mehrbodmh82@gmail.com"
# msg['To'] = "mehrbodmh14@gmail.com"

# # Send the message via our own SMTP server, but don't include the
# # envelope header.
# s = smtplib.SMTP('smtp.gmail.com',587)
# s.starttls()  # Enable TLS
# s.login("loansystem313@gmail.com", "ukuv mosa hczv autq")
# s.sendmail("loansystem313@gmail.com", ["mehrbodmh14@gmail.com"], msg.as_string())
# s.quit()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
    expose_headers = ["*"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def job_function():
    db = SessionLocal()

    loans = crud.get_loans(db)
    for loan in loans:
        for debt in loan['debts']:
            deadlineDate = date.today() +timedelta(days=3)

            if not debt.paidDate and deadlineDate >= debt.deadline and debt.deadline >= date.today():
                notifications = crud.get_loan_notifications(db, loan['loan_id'])

                checker = False
                for notification in notifications:
                    if notification.debt_id == debt.debt_id:
                        checker = True
                        break

                if not checker:
                    if loan['bank']:
                        bankName = loan['bank'].name
                    else:
                        bankName = loan['customBank'].name

                    db_notification = schemas.NotificationCreate(title="Debt Reminder", text=f"Your debt deadline from loan received in {loan['startDate']} from {bankName} bank is in {debt.deadline}", sendDate=date.today(), isRead=False, user_id=loan['receiver_id'], debt_id=debt.debt_id)
                    crud.register_notification(db, db_notification)


sched = BackgroundScheduler()
trigger = CronTrigger(
        year="*",
        month="*",
        day="*",
        hour="12"
    )
sched.add_job(job_function, trigger= trigger)
sched.start()


@app.get("/")
def read_root():
    return {"hello": "world"}

@app.post("/user/login", response_model=schemas.User)
async def login_for_access_token(response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                db: Session = Depends(get_db)):

    def check_email_format(input):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        return re.fullmatch(regex, input)

    try:
        if check_email_format(form_data.username):
            user = crud.login_by_email(db, form_data.username, form_data.password)
        else:
            user = crud.login_by_username(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email/username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=tokens.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = tokens.create_access_token(
            data={"sub": user.user_id}, expires_delta=access_token_expires
        )

        response.headers["auth-token"] = access_token
        return user
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.post("/user/", response_model=schemas.User)
def register_user(response: Response, user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = crud.get_user_by_username(db, user.username)
        if db_user:
            raise HTTPException(status_code=400, detail="User by this username already registered")
        db_user = crud.get_user_by_email(db, user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="User by this email already registered")
        db_user = crud.get_user_by_IDNumber(db, user.IDNumber)
        if db_user:
            raise HTTPException(status_code=400, detail="User by this IDNumber already registered")
        else:
            db_user = crud.register_user(db, user)
            access_token_expires = timedelta(minutes=tokens.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = tokens.create_access_token(
                data={"sub": db_user.user_id}, expires_delta=access_token_expires
            )

            response.headers["auth-token"] = access_token
            return db_user
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/user/", response_model=schemas.User)
def read_user_profile(current_user: Annotated[models.User, Depends(tokens.get_current_user)], db: Session = Depends(get_db)):
    try:
        user = crud.get_user_by_id(db, current_user.user_id)
        return user
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.put("/user/", response_model=schemas.User)
def update_user_profile(current_user: Annotated[models.User, Depends(tokens.get_current_user)], updated_user: schemas.UserUpdate,
                        password: Annotated[str | None, Body()] = None, db: Session = Depends(get_db)):
    try:
        if not any(updated_user.model_dump().values()):
            raise HTTPException(status_code=400, detail="All attributes are empty")

        if updated_user.username:
            if current_user.username == updated_user.username.lower():
                raise HTTPException(status_code=400, detail="This is already your username")

            db_user = crud.get_user_by_username(db, updated_user.username)
            if db_user:
                raise HTTPException(status_code=400, detail="User by this username already registered")

        if updated_user.email:
            if current_user.email == updated_user.email.lower():
                raise HTTPException(status_code=400, detail="This is already your email")
            
            db_user = crud.get_user_by_email(db, updated_user.email)
            if db_user:
                raise HTTPException(status_code=400, detail="User by this email already registered")

        if updated_user.IDNumber:
            if current_user.IDNumber == updated_user.IDNumber:
                raise HTTPException(status_code=400, detail="This is already your IDNumber")

            db_user = crud.get_user_by_IDNumber(db, updated_user.IDNumber)
            if db_user:
                raise HTTPException(status_code=400, detail="User by this IDNumber already registered")
        
        if updated_user.password:
            db_user = crud.validate_user(db, current_user.user_id, password)
            if db_user:
                if password == updated_user.password:
                    raise HTTPException(status_code=400, detail="This is already your Password")
            else:
                raise HTTPException(status_code=400, detail="Incorrect current password")

        return crud.update_user(db, current_user.user_id, updated_user)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.delete("/user/", response_model=schemas.User)
def delete_user(request: Request, current_user: Annotated[models.User, Depends(tokens.get_current_user)],
                db: Session = Depends(get_db)):
    try:
        password = request.headers["password"]
        db_user = crud.validate_user(db, current_user.user_id, password)
        if db_user:
            return crud.delete_user(db, db_user.user_id)
        raise HTTPException(status_code=400, detail="Incorrect password")
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/user/loans")
def get_loan(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
             db: Session = Depends(get_db)):
    try:
        return crud.get_user_loans(db, current_user.user_id)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.post("/user/loans")
def register_loan(current_user: Annotated[models.User, Depends(tokens.get_current_user)], loan: schemas.LoanCreate,
             db: Session = Depends(get_db)):
    try:
        if not loan.bank_id and not loan.customBank_id:
            raise HTTPException(status_code=400, detail="Bank_id or customBank_id shoud be not null")
        return crud.register_user_loan(db, current_user.user_id, loan)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
@app.delete("/user/loans/{loan_id}")
def delete_loan(current_user: Annotated[models.User, Depends(tokens.get_current_user)], loan_id: int,
             db: Session = Depends(get_db)):
    try:
        db_loan = crud.validate_user_loan(db, loan_id, current_user.user_id)
        if not db_loan:
            raise HTTPException(status_code=400, detail="This loan does not belong to this user")
        
        return crud.delete_loan(db,  loan_id)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.put("/user/loans")
def update_debts(current_user: Annotated[models.User, Depends(tokens.get_current_user)],loan_id: Annotated[int, Body()],
            paidDate: Annotated[date, Body()], db: Session = Depends(get_db)):
    try:
        db_loan = crud.validate_user_loan(db=db, loan_id=loan_id)
        if not db_loan:
            raise HTTPException(status_code=400, detail="Loan not found")  
        db_loan = crud.validate_user_loan(db, loan_id, current_user.user_id)
        if not db_loan:
            raise HTTPException(status_code=400, detail="This loan does not belong to this user")
        if not loan_id or not paidDate:
            raise HTTPException(status_code=400, detail="Loan_id or PaidDate shoud not be null")
        db_loan = crud.update_user_debts(db, current_user.user_id, loan_id, paidDate)
        if db_loan:
            return db_loan
        else:
            raise HTTPException(status_code=400, detail="All debts has already been paid")
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/user/debts/{debt_id}")
def get_debt_loan(current_user: Annotated[models.User, Depends(tokens.get_current_user)], debt_id: int, db: Session = Depends(get_db)):
    try:
        db_loan = crud.get_user_debt_loan(db, current_user.user_id, debt_id)
        if db_loan:
            return db_loan
        raise HTTPException(status_code=400, detail="This debt does not belong to this user")
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.put("/user/debts", response_model=schemas.Debt)
def update_debt(current_user: Annotated[models.User, Depends(tokens.get_current_user)], loan_id: Annotated[int, Body()],
            paidDate: Annotated[date, Body()], db: Session = Depends(get_db)):
    try:
        db_loan = crud.validate_user_loan(db=db, loan_id=loan_id)
        if not db_loan:
            raise HTTPException(status_code=400, detail="Loan not found")  
        db_loan = crud.validate_user_loan(db,loan_id, current_user.user_id )
        if not db_loan:
            raise HTTPException(status_code=400, detail="This loan does not belong to this user")
        if not loan_id or not paidDate:
            raise HTTPException(status_code=400, detail="Loan_id or PaidDate shoud not be null")
        db_debt = crud.update_user_debt(db, loan_id, paidDate)
        if db_debt:
            return db_debt
        else:
            raise HTTPException(status_code=400, detail="All debts has already been paid")
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/user/banks")
def get_banks(current_user: Annotated[models.User, Depends(tokens.get_current_user)], db: Session = Depends(get_db)):
    try:
        return crud.get_user_banks(db, current_user.user_id)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.post("/user/banks", response_model=schemas.CustomBank)
def register_customBanks(current_user: Annotated[models.User, Depends(tokens.get_current_user)], customBank: schemas.CustomBankCreate,
                         db: Session = Depends(get_db)):
    try:
        if not customBank.name:
            raise HTTPException(status_code=400, detail="Name should not be null")
        return crud.register_user_customBank(db, current_user.user_id, customBank)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.delete("/user/banks", response_model=schemas.CustomBank)
def delete_customBanks(request: Request, current_user: Annotated[models.User, Depends(tokens.get_current_user)],
                       db: Session = Depends(get_db)):
    try:
        bank_id = request.headers["bank_id"]
        return crud.delete_user_customBank(db, current_user.user_id, bank_id)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/user/notifications", response_model=list[schemas.Notification])
def get_notifications(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
                       db: Session = Depends(get_db)):
    try:
        return crud.get_user_notifications(db, current_user.user_id)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.put("/user/notifications", response_model=list[schemas.Notification])
def update_notification(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
                        updated_notifications: list[schemas.NotificationUpdate], db: Session = Depends(get_db)):
    try:
        for updated_notification in updated_notifications:
            db_notification = crud.validate_user_notification(db, current_user.user_id, updated_notification.notification_id)
            if not db_notification:
                raise HTTPException(status_code=400, detail="Some of These notifications do not belong to this user")
        return crud.update_user_notifications(db, updated_notifications)
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.post("/user/notifications", response_model=schemas.Notification)
def update_notification(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
                        notification: schemas.NotificationCreate , db: Session = Depends(get_db)):
    try:
        if current_user.isAdmin:
            return crud.register_notification(db, notification,current_user.user_id)
        raise HTTPException(status_code=400, detail="You don't have permission")     

    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/users", response_model=list[schemas.User])
def get_users(current_user: Annotated[models.User, Depends(tokens.get_current_user)], db: Session = Depends(get_db)):
    try:
        if current_user.isAdmin:
            db_users = crud.get_users(db)
            return db_users
        raise HTTPException(status_code=400, detail="You don't have permission")     
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/user/{user_id}", response_model=schemas.User)
def get_user(current_user: Annotated[models.User, Depends(tokens.get_current_user)], user_id: int,
            db: Session = Depends(get_db)):
    try:
        if current_user.isAdmin:
            db_user = crud.get_user_by_id(db, user_id)
            if db_user:
                return db_user
            raise HTTPException(status_code=400, detail="User not found") 
        raise HTTPException(status_code=400, detail="You don't have permission")     
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.post("/admin/user", response_model=schemas.User)
def register_user(current_user: Annotated[models.User, Depends(tokens.get_current_user)], user: schemas.User,
                    db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission") 
        db_user = crud.register_user(db, user)
        return db_user  
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.put("/admin/user", response_model=schemas.User)
def uodate_user(current_user: Annotated[models.User, Depends(tokens.get_current_user)], updated_user: schemas.UserUpdate,
                        user_id: Annotated[str | None, Body()] = None, db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission") 
        db_user = crud.get_user_by_id(db, user_id)
        if db_user:
            db_user = crud.update_user(db, user_id, updated_user)
            return db_user
        raise HTTPException(status_code=400, detail="User not found")     
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.delete("/admin/user/{user_id}", response_model=schemas.User)
def remove_user(user_id : int, current_user: Annotated[models.User, Depends(tokens.get_current_user)],
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission") 
        db_user = crud.get_user_by_id(db, user_id)
        if db_user:
            if db_user.isAdmin:
                raise HTTPException(status_code=400, detail="Can't remove admin")     
            db_user = crud.delete_user(db, user_id)
            return db_user
        raise HTTPException(status_code=400, detail="User not found")     
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/admins", response_model=schemas.User)
def get_admins(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission") 
        db_admins = crud.get_admins(db)
        return db_admins    
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    
@app.post("/admin/admin/{user_id}", response_model=schemas.User)
def register_admin(current_user: Annotated[models.User , Depends(tokens.get_current_user)], user_id: int,
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission") 
        db_user = crud.get_user_by_id(db, user_id)
        if db_user:
            if db_user.isAdmin:
                raise HTTPException(status_code=400, detail="Already Admin") 
            db_user = crud.register_admin(db, user_id)
            return db_user
        raise HTTPException(status_code=400, detail="User not found")     
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.delete("/admin/admin/{user_id}", response_model=schemas.User)
def remove_admin(user_id : int, current_user: Annotated[models.User, Depends(tokens.get_current_user)],
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_user = crud.get_user_by_id(db, user_id)
        if db_user:
            if not db_user.isAdmin:
                raise HTTPException(status_code=400, detail="User not admin") 
            db_user = crud.remove_admin(db, user_id)
            return db_user
        raise HTTPException(status_code=400, detail="User not found")     
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/userLoans/")
def get_loans(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_loans = crud.get_loans(db)
        return db_loans   
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/userLoans/{user_id}")
def get_user_loans(current_user: Annotated[models.User, Depends(tokens.get_current_user)], user_id: int,
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_user = crud.get_user_by_id(db, user_id)
        if not db_user:
            raise HTTPException(status_code=400, detail="User not found") 
        db_loans = crud.get_user_loans(db, user_id)
        return db_loans   
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/notifications/", response_model=list[schemas.Notification])
def get_admin_notifications(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_notifications = crud.get_admin_notifications(db, current_user.user_id)
        return db_notifications   
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/notifications/{user_id}", response_model=list[schemas.Notification])
def get_admin_to_user_notifications(current_user: Annotated[models.User, Depends(tokens.get_current_user)], user_id: int,
              db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_user = crud.get_user_by_id(db, user_id)
        if not db_user:
            raise HTTPException(status_code=400, detail="User not found") 
        db_notifications = crud.get_admin_to_user_notifications(db, current_user.user_id, user_id)
        return db_notifications   
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.post("/admin/notifications", response_model=schemas.Notification)
def register_notification(current_user: Annotated[models.User, Depends(tokens.get_current_user)],
                   notification: schemas.NotificationCreate, db: Session = Depends(get_db)):
    try:
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_user = crud.get_user_by_id(db, notification.user_id)
        if not db_user:
            raise HTTPException(status_code=400, detail="User not found")
        db_notification = crud.register_notification(db, notification, current_user.user_id)
        return db_notification  
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

@app.get("/admin/userLoanDebts/{loan_id}", response_model=list[schemas.Debt])
def get_user_loan_debts(current_user: Annotated[models.User, Depends(tokens.get_current_user)], loan_id: int,
                   db: Session = Depends(get_db)):
    try:
        db_loan = crud.validate_user_loan(db=db, loan_id=loan_id)
        if not db_loan:
            raise HTTPException(status_code=400, detail="Loan not found")  
        if not current_user.isAdmin:
            raise HTTPException(status_code=400, detail="You don't have permission")
        db_debts = crud.get_loan_debts(db, loan_id)
        return db_debts
    except SQLAlchemyError as e:
        # Handle SQLAlchemy errors
        db.rollback()  # Rollback the transaction
        raise HTTPException(status_code=500, detail="Database error: " + str(e))