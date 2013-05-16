osascript -e 'tell application "Terminal" to do script "sudo mongod --dbpath Documents/workspace/DungeonCity/data --nssize 2 --smallfiles --noprealloc --port 12345"'

osascript -e 'tell application "Terminal" to do script "sudo node Documents/workspace/DungeonCity/app.js"'

compass watch public