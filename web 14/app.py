
from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3

app = Flask(__name__)
app.secret_key = "contact_form_secret"

# Create database and table
def create_table():

    conn = sqlite3.connect("contact.db")

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Display contact form
@app.route("/")
def home():

    return render_template("index.html")


# Handle form submission
@app.route("/submit", methods=["POST"])
def submit():

    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()

    # Validate input
    if not name or not email or not message:
        flash("Please fill in all fields.", "error")
        return redirect(url_for("home"))

    if "@" not in email or "." not in email:
        flash("Please enter a valid email address.", "error")
        return redirect(url_for("home"))

    # Store data in SQLite database
    conn = sqlite3.connect("contact.db")

    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        (name, email, message)
    )

    conn.commit()
    conn.close()

    flash("Your message has been submitted successfully!", "success")

    return redirect(url_for("home"))


if __name__ == "__main__":

    create_table()

    app.run(debug=True)
