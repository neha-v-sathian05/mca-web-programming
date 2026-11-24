
from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
import secrets
import re
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Secret key for session management
app.secret_key = "change-this-to-a-long-random-secret-key"

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"


# Database connection
def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn


# Create users table
def create_table():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Generate CSRF token
def get_csrf_token():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(32)

    return session["csrf_token"]


@app.context_processor
def inject_csrf_token():
    return {"csrf_token": get_csrf_token}


# Validate submitted form token
def valid_csrf():
    submitted = request.form.get("csrf_token", "")
    stored = session.get("csrf_token", "")

    return bool(stored) and secrets.compare_digest(submitted, stored)


# Home page - redirect based on login status
@app.route("/")
def home():

    if "user_id" in session:
        return redirect(url_for("dashboard"))

    return redirect(url_for("login"))


# User registration
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        if not valid_csrf():
            flash("Invalid form submission. Please try again.", "error")
            return redirect(url_for("register"))

        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not username or not email or not password:
            flash("All fields are required.", "error")

        elif not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            flash("Please enter a valid email address.", "error")

        elif len(password) < 8:
            flash("Password must contain at least 8 characters.", "error")

        elif password != confirm_password:
            flash("Passwords do not match.", "error")

        else:
            # Hash password before storing
            hashed_password = generate_password_hash(password)

            conn = get_db()

            try:
                conn.execute(
                    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                    (username, email, hashed_password)
                )

                conn.commit()
                flash("Registration successful! Please log in.", "success")
                conn.close()

                return redirect(url_for("login"))

            except sqlite3.IntegrityError:
                conn.close()
                flash("Username or email already exists.", "error")

    return render_template("register.html")


# User login
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        if not valid_csrf():
            flash("Invalid form submission. Please try again.", "error")
            return redirect(url_for("login"))

        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        conn = get_db()

        user = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        conn.close()

        if user and check_password_hash(user["password"], password):

            session.clear()
            session["user_id"] = user["id"]
            session["username"] = user["username"]

            flash("Login successful!", "success")
            return redirect(url_for("dashboard"))

        else:
            flash("Invalid email or password.", "error")

    return render_template("login.html")


# Protected dashboard
@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        flash("Please log in first.", "error")
        return redirect(url_for("login"))

    return render_template(
        "dashboard.html",
        username=session["username"]
    )


# User logout
@app.route("/logout", methods=["POST"])
def logout():

    if not valid_csrf():
        flash("Invalid form submission.", "error")
        return redirect(url_for("dashboard"))

    session.clear()

    flash("You have logged out successfully.", "success")
    return redirect(url_for("login"))


if __name__ == "__main__":

    create_table()

    app.run(debug=True)
