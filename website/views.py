# importuję klasę Blueprint z modułu flask
from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, logout_user, current_user
from .models import Note
from . import db 
import json


#tworzę nową instację Blueprint i przypisuje do zmiennej views
# 'views' nazwa blueprintu
# __name__ wskazuje na nazwe modułu w którym Blueprint jest definiowany
# To standardowy sposób przekazywania kontekstu lokalizacji
# co pomaga Flaskowi znaleźć zasoby związane z blueprintem takie jak szablony i pliki statyczne
views = Blueprint('views', __name__)

#po zdefiniowaniu views mogę dodawać do niego trasy URL:
@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Note is too short!', category = 'error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
            flash('Note added!', category = 'success!')
            db.session.add(new_note)
            db.session.commit()
            
    return render_template("home.html", user = current_user)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    return jsonify({})

# @views.route('/plan')
# def plan():
#     with open("static/images/plan.svg", "r", encoding="utf-8") as f:
#         svg_content = f.read()
#     return render_template("index.html", svg_content=svg_content)

@views.route('/pic')
def picture():
    return render_template("picture.html", user = current_user)

@views.route('/test')
def test():
    return render_template("test.html", user = current_user)
