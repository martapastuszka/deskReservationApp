from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, String, UniqueConstraint
from datetime import datetime

#sprawdzić rodzaje relacji
#np. one to many, many to one, one to one, itp

# class Note(db.Model):
#    id = db.Column(db.Integer, primary_key = True)
#    data = db.Column(db.String(10000))
#    date = db.Column(db.DateTime(timezone=True), default=func.now())
#    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) 

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150))
    #hashowanie haseł
    password = db.Column(db.String(150))
    #dodać nullable i unique
    first_name = db.Column(db.String(150))
    # notes = db.relationship('Note')

    __table_args__ = (
        UniqueConstraint('email', name='uq_user_email'),
    )

class Booking(db.Model):
    __tablename__ = 'booking'
    id = db.Column(db.Integer, primary_key=True)
    desk_id = db.Column(db.Integer, db.ForeignKey('desk.id'), nullable=False)
    day = db.Column(db.DateTime, nullable=False)
    # end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Relacje z innymi tabelami
    desk = db.relationship('Desk', backref=db.backref('bookings', lazy=True))
    user = db.relationship('User', backref=db.backref('bookings', lazy=True))

    __table_args__ = (
    # UniqueConstraint('desk_id', 'start_time', 'end_time', name='uq_booking_desk_time'),
    UniqueConstraint('desk_id', name='uq_booking_desk_time'),

    )

    # def __init__(self, desk_id, start_time, end_time, user_id):
    #     self.desk_id = desk_id
    #     self.start_time = start_time
    #     self.end_time = end_time
    #     self.user_id = user_id

    def __init__(self, desk_id, day):
        self.desk_id = desk_id
        self.day = day

    def __repr__(self):
        return f'<Booking {self.id}>'


class Desk(db.Model):
    __tablename__ = 'desk'
    id = db.Column(db.Integer, primary_key=True)
    desk_id = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    reserved = db.Column(db.Boolean, default=False)

    __table_args__ = (
        UniqueConstraint('desk_id', name='uq_desk_desk_id'),
    )

    def __init__(self, desk_id, location, reserved=False):
        self.desk_id = desk_id
        self.location = location
        self.reserved = reserved

    def __repr__(self):
        return f'<Desk {self.desk_id}>'

