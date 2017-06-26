from flask import Flask, render_template, request, redirect, url_for
import requests
import json
import os.path
app = Flask(__name__, static_url_path='/static')


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


@app.route('/', methods=['POST', 'GET'])
def root_page():
    act_page = request.args.get('page')
    if act_page is None:
        act_page = '1'
    print('PAGE: ' + act_page)

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
    return render_template('index.html', planets=planets, but_next=but_next, but_prev=but_prev)


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
