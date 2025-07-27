# importuję klasę Blueprint z modułu flask
from flask import Blueprint, render_template, request, flash, jsonify
from flask_cors import CORS
from flask_login import login_required, logout_user, current_user
from .models import Booking
from .models import Desk
from .models import User
from . import db 
import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, exists, func
from sqlalchemy.orm import joinedload
from flask import Flask
from datetime import date, timedelta



#tworzę nową instację Blueprint i przypisuje do zmiennej views
# 'views' nazwa blueprintu
# __name__ wskazuje na nazwe modułu w którym Blueprint jest definiowany
# To standardowy sposób przekazywania kontekstu lokalizacji
# co pomaga Flaskowi znaleźć zasoby związane z blueprintem takie jak szablony i pliki statyczne
views = Blueprint('views', __name__)
CORS(views)
#po zdefiniowaniu views mogę dodawać do niego trasy URL:
@views.route('/', methods=['GET', 'POST'])
@login_required
def home():            
    return render_template("home.html", user = current_user)


@views.route('/desk-status', methods=['POST'])
def desk_status():
    try:
        data = request.get_json(silent=True) or {}
        desk_id = data.get('desk_id')
        date    = data.get('date')

        if not desk_id or not date:
            return jsonify(success=False, message='No desk_id or date'), 400

        date_obj = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')

        booking = (
            db.session.query(Booking)
            .filter(Booking.desk_id == desk_id, Booking.day == date_obj)
            .first()
        )

        desk_count = (
            db.session.query(func.count(Booking.id))
            .filter(Booking.user_id == current_user.id,
                    func.date(Booking.day) == date_obj.date())
            .scalar()
        )

        response_payload = {
            'success': True,
            'reserved': bool(booking),
            'user_name': booking.user.first_name if booking else None,
            'user_role': current_user.role,         
            'bookedByMe': booking.user_id == current_user.id if booking else False,
            'my_desk_count': desk_count
        }
        return jsonify(response_payload), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500



@views.route('/get-bookings', methods=['POST'])
def get_bookings():
    try:
        data = request.get_json(silent=True) or {}
        date = data.get('date')

        if not date:
            return jsonify(success=False, message='No date'), 400
        
        date_object = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")

        bookings = (
            db.session.query(Booking.desk_id, Booking.user_id)
            .filter(Booking.day == date_object)  # remove desk_id filter → all desks that day
            .all()
        )
        results = [
            {"desk_id": desk_id, "user_id": user_id} for desk_id, user_id in bookings
        ]

        return jsonify({
            "success": True,
            "desks": results        # keeps desk/user info under a dedicated key
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500


@views.route('/reserve-desk', methods=['POST'])
def reserve_desk():
    try:
        data = request.get_json(silent=True) or {}
        desk_id = data.get('desk_id')
        date = data.get('date')
    
        if not desk_id or not date:
            return jsonify(success=False, message='No desk_id or date'), 400
        
        date_object = datetime.strptime(date, "%Y-%m-%d %H:%M:%S").date()
        new_booking = Booking(desk_id=desk_id, day=date_object, user_id=current_user.id)
        db.session.add(new_booking)
        db.session.commit()
        return jsonify(success=True, reserved=True), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500


@views.route('/cancel-reservation', methods=['POST'])
def cancel_reservation():
    try: 
        data = request.get_json(silent=True) or {}
        desk_id = data.get('desk_id')
        date = data.get('date')
    
        if not desk_id or not date:
            return jsonify(success=False, message='No desk_id or date'), 400
        
        date_object = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
        booking = Booking.query.filter_by(desk_id=desk_id, day=date_object).first()
        if booking:
            db.session.delete(booking)
            db.session.commit()
            return jsonify(success=True, reserved=False), 200
        else:
            return jsonify(success=False, message='Desk was not booked'), 400
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500


# 
# from flask import jsonify
# from sqlalchemy import func
@views.route('/occupancy-data', methods=['GET'])
def occupancy_data():
    try:
        today       = date.today()
        window_size = 14
        window      = [today + timedelta(days=i) for i in range(window_size)]

        # Sub-query: count bookings by *calendar* date in the window
        rows = (
            db.session
            .query(
                func.date(Booking.day).label('day'),  # strip time component
                func.count(Booking.id).label('bookings')
            )
            .filter(
                Booking.day >= today,
                Booking.day <  today + timedelta(days=window_size)
            )
            .group_by(func.date(Booking.day))
            .all()
        )

        # rows -> { '2023-09-28': 12, ... }
        raw_counts = { str(r.day): r.bookings for r in rows }

        labels = [d.isoformat() for d in window]
        data   = [raw_counts.get(lbl, 0) for lbl in labels]

        return jsonify({
            'labels': labels,
            'data'  : data,
            'success': True
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500



@views.route('/pic')
def picture():
    return render_template("picture.html", user = current_user)


@views.route('/test')
def test():
    return render_template("test.html", user = current_user)
