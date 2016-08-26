#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <vector>

// probably want half int..

   int Board[20000][20000]; 



void updateBoard(){
	for(int i = 0; i < 20000; i++){
		for(int j = 0; j < 20000; j++){
			Board[i][j] +=30;
		}
	}
}

int main(){
	srandom(5);
	printf("Updating board at 60 fps\n");
	double millis;
	clock_t start = clock(), diff;
	int milliPerFrame = 1000/60;
	unsigned long elapsed = 0;
	int numFrames = 0;

/*	while(true){
	//	updateBoard();
		diff = clock() - start;
		millis = diff * 1000.0/CLOCKS_PER_SEC;
		elapsed+=millis;
		start+=millis;
		if(elapsed > 1000){
			printf("The frames per second are : %d\n",numFrames);
			numFrames = 0;
			elapsed = 0;
		}
		numFrames++;		


	}

*/
	std::vector<int *> holder;
	holder.push_back(new int[10000]);
	holder.push_back(new int[1000000]);


		
	

}
