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
