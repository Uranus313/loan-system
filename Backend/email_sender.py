import smtplib, os, crud, schemas
from email.mime.text import MIMEText
from dotenv import load_dotenv
from database import SessionLocal
from datetime import date, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger



load_dotenv("./config.env")
email_password = os.getenv("Email_Password")
s = smtplib.SMTP('smtp.gmail.com',587)



def job_function():
    db = SessionLocal()
    loans = crud.get_loans(db)
    db_user_emails = []
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

                    db_user_emails.append(crud.get_user_by_id(db, loan['receiver_id']).email)

    if db_user_emails:
        msg = MIMEText(db_notification.text)
        msg['Subject'] = db_notification.title
        msg['From'] = "loansystem313@gmail.com"

        s.starttls()
        s.login("loansystem313@gmail.com", email_password)
        s.sendmail("loansystem313@gmail.com", [db_user_emails], msg.as_string())
        s.quit()


sched = BackgroundScheduler()
trigger = CronTrigger(
        year="*",
        month="*",
        day="*",
        hour="12"
    )
sched.add_job(job_function, trigger= trigger)
sched.start()