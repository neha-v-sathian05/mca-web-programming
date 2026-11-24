from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Connect to database
def get_db():
    conn = sqlite3.connect("employees.db")
    conn.row_factory = sqlite3.Row
    return conn

# Create employee table
def create_table():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            department TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Display and search employees
@app.route("/")
def index():
    search = request.args.get("search", "").strip()
    conn = get_db()

    if search:
        employees = conn.execute("""
            SELECT * FROM employees
            WHERE CAST(id AS TEXT) = ? OR name LIKE ?
            ORDER BY id DESC
        """, (search, "%" + search + "%")).fetchall()
    else:
        employees = conn.execute(
            "SELECT * FROM employees ORDER BY id DESC"
        ).fetchall()

    conn.close()
    return render_template("index.html", employees=employees, search=search)

# Add employee
@app.route("/add", methods=["POST"])
def add():
    name = request.form["name"].strip()
    email = request.form["email"].strip()
    department = request.form["department"].strip()

    if name and email and department:
        conn = get_db()
        conn.execute(
            "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)",
            (name, email, department)
        )
        conn.commit()
        conn.close()

    return redirect(url_for("index"))

# Update employee
@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit(id):
    conn = get_db()

    if request.method == "POST":
        name = request.form["name"].strip()
        email = request.form["email"].strip()
        department = request.form["department"].strip()

        if name and email and department:
            conn.execute("""
                UPDATE employees
                SET name = ?, email = ?, department = ?
                WHERE id = ?
            """, (name, email, department, id))
            conn.commit()

        conn.close()
        return redirect(url_for("index"))

    employee = conn.execute(
        "SELECT * FROM employees WHERE id = ?", (id,)
    ).fetchone()
    conn.close()

    if employee is None:
        return redirect(url_for("index"))

    return render_template("edit.html", employee=employee)

# Delete employee
@app.route("/delete/<int:id>", methods=["POST"])
def delete(id):
    conn = get_db()
    conn.execute("DELETE FROM employees WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for("index"))

if __name__ == "__main__":
    create_table()
    app.run(debug=True)