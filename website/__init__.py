# importuje klase Flask z modulu Flask
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()
DB_NAME = "database.db"



# funkcja create_app() zwykle 
# konfiguruje aplikacje i jej komponenty,
# takie jak konfiguracja, rejestracja blueprintów, podpięcie baz danych itp.
def create_app():
    app = Flask(__name__) #tworzy instacje aplikacji Flask. __name__ uzywane do określenia kontekstu aplikacji
    app.config['SECRET_KEY'] = 'secretKey'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    

    # importowanie views
    from .views import views
    from .auth import auth

    # rejestrowanie views w aplikacji
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User

    create_database(app)
    #sprawdzić czy działa to:
    # with app.app_context():
    #   db.create_all()

    login_manager = LoginManager() 
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.app_context():
            db.create_all()
    print('Created Database!')