#%reset -f
import time, random, pickle
import numpy as np
import pandas as pd
from sys import argv

if __name__ == '__main__':

	if(len(argv)==7):
		df = pd.read_csv(argv[1])
		selectedTask = int(argv[2])
		algorithms = int(argv[3])
		totalTimeLimit = int(argv[4])
		modelType = int(argv[5])
		criterion = int(argv[6])
		
		startTime = time.time()
		while int((time.time() - startTime) / 60.0) < totalTimeLimit:
			randomSec = random.randint(1, 20)
			time.sleep(float(randomSec) - ((time.time() - startTime) % float(randomSec)))
			print(str(random.random()) + ' ' + str(0) + ' ' + str(time.time() - startTime))
		print(str(random.random()) + ' ' + str(1) + ' ' + str(time.time() - startTime))
		with open('currentModel.mdl', 'wb') as modelFile:
			pickle.dump(df, modelFile)
		
'''
python myScript.py data.csv 1 2 30 1 2
which means: 
argv[0] scriptName
argv[1] pathToUploadedData
argv[2] selectedTask (here 1=RUL prediction)
argv[3] algorithms (here 2=all algorithms)
argv[4] totalTimeLimit (in minutes)
argv[5] modelType (here 1=black box model)
argv[6] criterion (here 2=Accuracy)

script will return 3 numbers (float, int, float): performance, isProcessingFinished, noOfSecondsFromStart
Where isProcessingFinished can be 0 (not finished) or 1 (finished, which means that model is saved in a file ‘currentModel.mdl’)
'''
