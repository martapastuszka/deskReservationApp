# importuję klasę Blueprint z modułu flask
from flask import Blueprint, render_template, request, flash, jsonify
from flask_cors import CORS
from flask_login import login_required, logout_user, current_user
from .models import Booking
from .models import Desk
from . import db 
import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, exists
from flask import Flask



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


@views.route('/reserve-desk', methods=['POST'])
def reserve_desk():
    try:
        data = request.get_json(silent=True) or {}
        desk_id = data.get('desk_id')
        date = data.get('date')
    
        if not desk_id or not date:
            return jsonify(success=False, message='No desk_id or date'), 400
        
        date_object = datetime.strptime(date, "%Y-%m-%d %H:%M:%S").date()
        new_booking = Booking(desk_id=desk_id, day=date_object)
        db.session.add(new_booking)
        db.session.commit()
        return jsonify(success=True, reserved=True), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500


@views.route('/cancel-reservation', methods=['POST'])
def cancel_reservation():
    try: 
        # data = request.get_json(silent=True) or {}
        # desk_id = data.get('desk_id')
        # print('DEBUG desk_it', desk_id)

        # if not desk_id:
        #     return jsonify(success=False, message='Brak desk_id'), 400
        
        # desk = Desk.query.filter_by(desk_id=desk_id).first()
        # print('DEBUG desk:', desk)

        # if not desk:
        #     return jsonify(success=False, message='Biurko nie istnieje'), 404
        
        # if not desk.reserved:
        #     return jsonify(success=False, message='Biurko nie jest obecnie zarezerwowane'), 409
        
        # desk.reserved = False
        # db.session.commit()
        # return jsonify(success=True, reserved=False), 200
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


@views.route('/desk-status', methods=['POST'])
def desk_status():
    try:
        data = request.get_json(silent=True) or {}
        desk_id = data.get('desk_id')
        date = data.get('date')

        if not desk_id or not date:
            return jsonify(success=False, message='No desk_id or date'), 400

        date_object = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
        print(desk_id)
        print(date_object)
        desk_reserved = (
            db.session.query(exists().where(
                and_(Booking.desk_id == desk_id, Booking.day == date_object)
            ))
            .scalar()  # returns True / False instead of a model instance
        )
        if desk_reserved:
            return jsonify(success=True, reserved=True), 200
        else:
            return jsonify(success=True, reserved=False), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify(success=False, message=str(e)), 500


@views.route('/pic')
def picture():
    return render_template("picture.html", user = current_user)


@views.route('/test')
def test():
    return render_template("test.html", user = current_user)
