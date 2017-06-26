from flask import Flask, render_template, request, redirect, url_for
import csv
import os.path
app = Flask(__name__, static_url_path='/static')


@app.route('/', methods=['POST', 'GET'])
def root_page(story_id=None):
    return render_template('index.html')


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
