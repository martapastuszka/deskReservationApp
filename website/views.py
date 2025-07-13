# importuję klasę Blueprint z modułu flask
from flask import Blueprint, render_template, request, flash, jsonify
from flask_cors import CORS
from flask_login import login_required, logout_user, current_user
# from .models import Booking
from .models import Desk
from . import db 
import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
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
    # if request.method == 'POST':
    #     note = request.form.get('note')

    #     if len(note) < 1:
    #         flash('Note is too short!', category = 'error')
    #     else:
    #         new_note = Note(data=note, user_id=current_user.id)
    #         flash('Note added!', category = 'success!')
    #         db.session.add(new_note)
    #         db.session.commit()

    # if request.method == 'POST':
    #     deskBookID = request.form.get('desk')
    #     new_book = Booking(user_id=current_user.id, desk_id=deskBookID)
    #     flash('Reservation successfull!')
    #     db.session.add(new_book)
    #     db.session.commit()
            
    return render_template("home.html", user = current_user)

# @views.route('/delete-note', methods=['POST'])
# def delete_note():
#     note = json.loads(request.data)
#     noteId = note['noteId']
#     note = Note.query.get(noteId)
#     if note:
#         if note.user_id == current_user.id:
#             db.session.delete(note)
#             db.session.commit()
#     return jsonify({})


# @views.route('/api/bookings', methods=['POST'])
# def create_booking():
#     data = request.get_json()

#     # Validate
#     for key in ['desk_id', 'start_time', 'end_time']:
#         if key not in data:
#             return jsonify({'success': False, 'error': f'Missing {key}'}), 400

#     try:
#         start_time = datetime.fromisoformat(data['start_time'])
#         end_time = datetime.fromisoformat(data['end_time'])
#     except ValueError:
#         return jsonify({'success': False, 'error': 'Invalid date format'}), 400

#     if end_time <= start_time:
#         return jsonify({'success': False, 'error': 'End date must be after start date'}), 400

#     booking = Booking(
#         desk_id=data['desk_id'],
#         start_time=start_time,
#         end_time=end_time,
#         description=data.get('description', '')
#     )

#     db.session.add(booking)
#     db.session.commit()

#     return jsonify({'success': True, 'booking_id': booking.id}), 201


# if __name__ == '__main__':
#     app.run(debug=True)

#pobieranie statusu biurek przy każdym załadowaniu strony
@views.route('/desks-status')
def desks_status():
    data = [
        {"desk_id": d.desk_id, "reserved": d.reserved}
        for d in Desk.query.all()
    ]
    return jsonify(data)

# Rezerwacja biurka
@views.route('/reserve-desk', methods=['POST'])
def reserve_desk():
    data = request.get_json(silent=True) or {}
    desk_id = data.get('desk_id')
    print(desk_id)
    # if not desk_id:
    #     return jsonify(success=False, message='Brak desk_id'), 400
    
    # desk = Desk.query.filter_by(desk_id=desk_id).first()

    # if not desk:
    #     return jsonify(success=False, message='Biurko nie istnieje'), 404

    # if desk.reserved:
    #     return jsonify(success=False, message='Biurko już jest zarezerwowane'), 409
    
    # # Rezerwujemy biurko
    # desk.reserved = True
    # db.session.commit()
    return jsonify(success=True)

#Usuwanie rezerwacji
@views.route('/cancel-reservation', methods=['POST'])
def cancel_reservation():
    data = request.get_json(silent=True) or {}
    desk_id = data.get('desk_id')

    if not desk_id:
        return jsonify(success=False, message='Brak desk_id'), 400

    desk = Desk.query.filter_by(desk_id=desk_id).first()
    if not desk:
        return jsonify(success=False, message='Biurko nie istnieje'), 404

    if not desk.reserved:
        # Nic do anulowania
        return jsonify(success=False, message='Biurko nie było zarezerwowane'), 409

    # Anulujemy rezerwację
    desk.reserved = False
    db.session.commit()

    return jsonify(success=True, message='Rezerwacja anulowana'), 200

@views.route('/pic')
def picture():
    return render_template("picture.html", user = current_user)

@views.route('/test')
def test():
    return render_template("test.html", user = current_user)
