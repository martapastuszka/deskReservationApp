from website import create_app, db
from website.models import Desk

app = create_app()

with app.app_context():
    desk1 = Desk(desk_id='d1', location='Lokalizacja 1')
    desk2 = Desk(desk_id='d2', location='Lokalizacja 2')
    desk3 = Desk(desk_id='d3', location='Lokalizacja 3')

    db.session.add_all([desk1, desk2, desk3])
    db.session.commit()

    print("Biurka zostały dodane do bazy danych.")