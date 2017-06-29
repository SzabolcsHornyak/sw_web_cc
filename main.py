from flask import Flask, render_template, request, redirect, url_for, session, escape, jsonify
import requests
from datetime import datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash
from db_handling import execute_sql_statement

app = Flask(__name__, static_url_path='/static')
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 'ad76ad987ad98aud98adu9qeqeqadqew'


def is_int(val):
    try:
        int(val)
        return True
    except ValueError:
        return False


def format_thousands(value, afters):
    if is_int(value):
        return "{:,.0f}{}".format(int(value), afters)
    else:
        return value


def user_login(username, password):
    user_pass_from_db = execute_sql_statement("SELECT password FROM users where username='" + username + "'")[0][0]
    if (check_password_hash(user_pass_from_db, password)):
        if username in session:
            pass
        else:
            session['username'] = username
    else:
        return redirect(url_for('bad'))


@app.route('/logout')
def logout():
    if session.get('username'):
        session.pop('username', None)
    return redirect(url_for('root_page'))


@app.route('/bad')
def bad():
    return render_template('bad.html')


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        u_name = request.form['uname']
        u_pass = request.form['psw']
        user_login(u_name, u_pass)
    return redirect(url_for('root_page'))


@app.route('/vote_stats')
def vote_stats():
    stat = execute_sql_statement("SELECT count(*), planet_name FROM planet_votes group by planet_name")
    vote_json = []
    for i in range(len(stat)):
        temp_tupl = {}
        temp_tupl['count'] = stat[i][0]
        temp_tupl['planet'] = stat[i][1]
        vote_json.append(temp_tupl)
    return json.dumps(vote_json)


@app.route('/vote', methods=['GET', 'POST'])
def vote_page():
    vote_datas = json.loads(request.form['myData'])
    Planet_id = vote_datas['P_id']
    Planet_name = vote_datas['Planet']
    sub_time = datetime.now()
    User_id = execute_sql_statement("SELECT id FROM users where username='" + session['username'] + "'")[0][0]
    have_vote = execute_sql_statement("SELECT count(*) FROM planet_votes where planet_name='" + Planet_name + "' and user_id=" + str(User_id))[0][0]
    if (have_vote > 0):
        print('Have vote for this planet')
    else:
        execute_sql_statement("""INSERT INTO planet_votes (planet_id, planet_name, user_id, submission_time) VALUES (%s, %s, %s, %s)""", (Planet_id, Planet_name, User_id, sub_time.replace(microsecond=0)))
    return redirect(url_for('root_page'))


@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        u_name = request.form['uname']
        u_pass = request.form['psw']
        hash_pw = generate_password_hash(u_pass)
        users = execute_sql_statement("""SELECT username FROM users""")
        if (len(users) > 0):
            if (u_name in users[0]):
                return redirect(url_for('bad'))
            else:
                execute_sql_statement("""INSERT INTO users (username, password) VALUES (%s, %s)""", (u_name, hash_pw))
        else:
            execute_sql_statement("""INSERT INTO users (username, password) VALUES (%s, %s)""", (u_name, hash_pw))
    return redirect(url_for('root_page'))


@app.route('/', methods=['POST', 'GET'])
def root_page():
    # check user logged in
    logged_user = ''
    if session.get('username'):
        logged_user = session['username']

    act_page = request.args.get('page')
    if act_page is None:
        act_page = '1'

    response = requests.get('http://swapi.co/api/planets/?page=' + act_page).json()
    planets = response['results']

    # pageing
    if response['next'] is not None:
        but_next = str(response['next']).split('=', 1)[1]
    else:
        but_next = None
    if response['previous'] is not None:
        but_prev = str(response['previous']).split('=', 1)[1]
    else:
        but_prev = None

    planets = response['results']

    # Formating planet datas
    for i in range(len(planets)):
        planets[i]['diameter'] = format_thousands(planets[i]['diameter'], ' km')
        planets[i]['surface_water'] = format_thousands(planets[i]['surface_water'], '%')
        planets[i]['population'] = format_thousands(planets[i]['population'], ' people')
        planets[i]['url'] = planets[i]['url'].split('/')[5]
    return render_template('index.html', planets=planets, but_next=but_next, but_prev=but_prev, act_page=act_page, logged_user=logged_user)


def main():
    app.run(debug=True)

if __name__ == '__main__':
    main()
