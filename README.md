
# Slot Machine Game

### Running configuration:
There are a few steps to take before running the game when deploying on new server

##### Machines number and probabilities:
in backend/GameLogic.js file you can change the number of machines and their probabilities.

##### Choosing algorithm:
in frontend/src/views/Game.js file you can change the algorithm used to choose the machine by setting the variable "this.adviceAlgo"

##### Running on prolific:
1. Put the correct completion code in frontend/src/views/Answers.js file
2. Put the correct ip address in frontend/src/config/config.js file
3. Run the ```npm start``` in frontend folder and backend folder

##### Show statistics:
add your new db file to picks_statistics.py and rune to see the results