# Project Name: MuscleStory

## Overview
Fitness Tracker with RPG Style Progression
A web app that will allow users to record their workouts and track their progress. Once users register and sign in, they will have access to a list that they can use to add details of their exercise, such as number of repetitions performed, sets, and weight.
There will also be a personalized character feature, which will grow alongside the user. Hopefully, the avatar's growth will reflect the transformation that the user will be experiencing as they improve their fitness. The purpose of this app is to provide a fun way to help users stay on track on their physical fitness journey.

## Data Model
The application will store Users, Lists, and Items.
Users can have multiple lists (via references).
Each list will have the following fields: user, exercise, repetitions, sets, weight, date, RPE (rate of perceived exertion) (by embedding).

# Example User

```
{
  username: "goku",
  hash: //password hash
  lists: //array of references to list documents
}
```

# Example List with Embedded Items
```
{
  user: { //reference to a user object
	name: "Arnold",
	weight: 250, //weight in LB
	height: 190 //height in CM
	avatar:
		{
		 level: 10
			}
				}  
  exercise: [{name: "Bench Press", reps: 10, sets: 4, weight: 500, rpe: 9, date: 11-06-2018, type: "lifting"}] //any exercise
 // reps:  //float type to allow for partial reps
 // sets:  //float to allow for partial sets, ie. 3.5
 // weight: //float to allow for half pounds/kg
 // RPE:  //float between 1-10
 // date: //MM-DD-YYYY Format
}
```


[Link to Database Schema](src/db.js)

## User Story

1. As a non-registered user, I can register a new account with the site.
2. As a user, I can log into the site.
3. As a user, I can create a workout list.
4. As a user, I can add to my workout list.
5. As a user, I can view any workout list given a date.
6. As a user, I can view a page which will show my progress so far.

## Research Topics
Integrate User Authentication: passport.js
* What: authentication **middleware** for Node.js
* Why: use to configure backend authentication
* How: define schema and create model, import into app.js.
* Pros: flexible and modular, can easily be integrated into any Express-based web app
* Alternatives: Google/FB/Twitter login? Not sure...


Database: MongoDB with mongoose
* What: NoSQL database with **JSON-like** documents
* Why: scalable with strong performance
* Pros: I already know this from class, so it will be less work. Query language is JS instead of SQL.
* Alternatives: CouchDB (Document)

## Usage Instructions:
* First, make an account by clicking on the "Register" tab.
* Now, you are logged in. Next, click on "Add Workout" and enter your values.
* Click the progress tab to see your recorded workouts and player statistics.
* Optionally, go to User Details to add your height, weight, and goal weight. This will populate new fields in your progress tab, including BMI and caloric requirements for weight gain/loss. 

## Higher Order Functions:
[Link](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/tranvk-final-project/blob/5791f0a67375f75b3d100916445d21d77c7ac339/src/app.js#L278)

* Reduce to calculate the total number of reps performed.
* Reduce to calculate the total number of sets performed.
* Reduce to calculate the total amount of weight lifted in a day.
* Reduce to calculate the total volume of weight lifted.

## Bootstrap
[Link to CSS](src/public/css/site.css)


## Gulp + ESLint
[Link to screen capture](src/public/images/gulp.png)
[Link to build configuration - Gulp](gulpfile.js)
[Link to build configuration - ESLint](.eslintrc.js)


## JS Libraries - External API
* Validate JS - 1 point

[Link to use of API](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/tranvk-final-project/blob/1f23df30fe5acfeca774ee02eed30b35281bcd98/src/app.js#L54)

[Link to use of API](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/tranvk-final-project/blob/1f23df30fe5acfeca774ee02eed30b35281bcd98/src/app.js#L188)

[Link to demonstration](documents/validateDemonstration.gif)
## Notes:
* Disconnecting logs out user
