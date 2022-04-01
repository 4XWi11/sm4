#!/usr/bin/env python
# -*- coding: utf-8 -*-
from sm4 import encrypt, decrypt
from flask import Flask, request, redirect, url_for, render_template, Response, jsonify, make_response, send_from_directory
from werkzeug.utils import secure_filename
import os
import hashlib

filename_g = ''

app = Flask(__name__, template_folder='template')
app.config['JSON_AS_ASCII'] = False
app.config['UPLOAD_FOLDER'] = 'download/'


def after_request(resp):
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "GET":
        return render_template("index.html")


@app.route('/progress', methods=['GET', 'POST'])
def get_progress():
    if request.method == "POST":
        pwd = request.form.get('pwd')
        _h = bytes.fromhex(hashlib.sha256(pwd.encode()).hexdigest())
        key, iv = _h[:16], _h[16:]
        file_type = request.form.get('type')
        if file_type == "enc":
            encrypt('download/'+filename_g, key, iv)
        elif file_type == "dec":
            decrypt('download/'+filename_g, key, iv)
        return jsonify({"status": "success", "filename": filename_g})
    return jsonify({"status": "fail"})


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        global filename_g
        filename_g = f.filename
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename_g)))
        return filename_g


@app.route("/download/<path:filename>", methods=['GET', 'POST'])
def downloader(filename):
    if request.method == "GET":
        dir_path = os.path.join(app.root_path, 'download')
        return send_from_directory(dir_path, filename, as_attachment=True)


if __name__ == '__main__':
    app.after_request(after_request)
    app.run(debug=True, host='127.0.0.1', port=5000)
