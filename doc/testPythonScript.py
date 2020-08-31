import sys
import time
import random

def hello(number):
	for i in range(int(number)):
		print("porcessing",i,random.random(),0)
		time.sleep(1)
	
	
	
if __name__ == '__main__':
	gpus = sys.argv[1]
	hello(gpus)
	print(random.random(),1)
	print("DONE!!!!!!!")