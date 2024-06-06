from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gsa.db'
db = SQLAlchemy(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True,nullable=False)
    mobile = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

class Task(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(80), nullable=False)
     date_time = db.Column(db.String(80), nullable=False)
     assigned_to_user = db.relationship('User',backref=db.backref('tasks',lazy=True))

with app.app_context():
     db.create_all()

     @app.route('/')
     def index():
          return render_template('index.html')
     @app.route('/api/register',methods=['POST'])
     def Register():
          data=request.json
          new_user=User(
               name=data['name'],
               email=data['email'],
               mobile=data['mobile'],
               password=data['pass'],
               address=data['address'],
               latitude=data['latitude'],
               longitude=data['longitude']
          )
          db.session.add(new_user)
          db.session.commit()
          return jsonify({'message':'user registered successfully!'})
     
     
@app.route('/api/login',methods=['POST'])
def login():
     data=request.json
     user=User.query.filter_by(email=data['email'],password=data['pass'].first())
     if user:
          return jsonify({'message':'login successfully','user':user.id})
     else:
          return jsonify({'message':'invalid credentials..!'}),401

@app.route('/api/add-task',methods=['POST'])
def add_task():
     data=request.json
     new_task=Task(
          name=data['taskname'],
          data_time=data['data_time'],
          assigned_to=data['assigned_to'],
     )
     db.session.add(new_task)
     db.session.commit()
     return jsonify({'message':'Task added successfully!'})
     

@app.route('/api/tasks',methods=['GET'])
def get_tasks():
     tasks=Task.query.all()
     tasks_list=[
          {
               'id': task.id,
                'name':task.name,
                'dataTime':task.date_time,
                'assignedToName':task.assighned_to_user.name
          }
          for task in tasks
     ]
     return jsonify(tasks_list)


@app.route('/api/users',methods=['GET'])
def get_user():
     users=User.query.all()
     users_list=[{'id':user.id,'name':user.name}for user in users]
     return jsonify(users_list)

if __name__=='__main__':
     app.run(debug=True)












