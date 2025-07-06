from website import create_app


#zweryfikowac sposob pobierania bootstrap - nowsze wersje potrzebne

app = create_app()


"""
if __name__ == '__main__'::

if __name__ == '__main__':: Sprawdza, czy skrypt jest uruchamiany bezpośrednio (nie jako importowany moduł). W Pythonie, zmienna __name__ jest ustawiana na '__main__' tylko wtedy, gdy skrypt jest uruchamiany bezpośrednio, a nie importowany. To jest typowy sposób na uruchamianie kodu, który powinien być wykonywany tylko wtedy, gdy skrypt działa jako główny program.
"""
#tylko gdy zrobimy run '__main__' ( a nie tylko importujmey, wykona sie ponizszy kod)
# chodzi o to, że mozesz przypadkiem zaimportowac __main__ z innego pliku, a nie chcesz
# wtedy uruchomic web servera
if __name__ == '__main__':
    """
    app.run(debug = True):

app.run(debug = True): Uruchamia serwer deweloperski Flask na lokalnym hoście. Argument debug=True włącza tryb debugowania, który jest bardzo przydatny podczas tworzenia aplikacji, ponieważ:
Automatycznie restartuje serwer po dokonaniu zmian w kodzie.
Dostarcza szczegółowe informacje o błędach i wyjątki, które mogą wystąpić podczas działania aplikacji.
    """
    # wystartuje Flask aplikation i uruchomi web server
    # przy każdej zmianie w kodzie pythona automatycznie re-runs web server
    # na produkcji ustawia się ten parametr na False
    app.run(debug = True)

    