from typing import Annotated
from fastapi import Body, Depends, FastAPI, HTTPException, Request, Response, status
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
import crud, models, schemas, tokens, re



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


@app.get("/")
def read_root():
    return {"Hello": "World"}

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