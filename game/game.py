import numpy as np
import copy

class Player:
    def __init__(self,name,mark) -> None:
        self.name=name
        self.mark=mark
        self.steps=[]

    def add_step(self,step:list):
        self.steps.append(step)

class ServerPlayer(Player):
    def __init__(self,mark=1) -> None:
        super().__init__("server",mark)
    
    def predict(self,board:list):
        print("PRE CALL")
        grade=[]
        for column in range(8):
            temp_board=copy.deepcopy(board)
            temp_result=None
            for row in range(7,-1,-1):
                if temp_board[row][column]==2:
                    temp_board[row][column]=self.mark
                    temp_result=Game.judge(temp_board,[row,column])
                    if temp_result[0]:
                        grade.append(100)
                    else:
                        grade.append(temp_result[1])

                    temp_board[row][column]=self.mark^1
                    temp_result=Game.judge(temp_board,[row,column])
                    if temp_result[0]:
                        grade[-1]+=10
                    else:
                        grade[-1]+=temp_result[1]
                    if row>0:
                        temp_board[row-1][column]=self.mark^1
                        temp_result=Game.judge(temp_board,[row-1,column])
                        grade[-1]-=temp_result[0]*10
                    break
        print(grade)
        return np.argmax(grade)

class Game:
    def __init__(self,player0:Player,player1:Player) -> None:
        self.player0=player0
        self.player1=player1
        self.board=[[2 for i in range(8)] for j in range(8)]
        self.steps=[]
        self.turn=0


    def make_step(self,step:int) -> bool:
        print("MS CALL")
        valid=False
        if self.turn==0:
            for i in range(7,-1,-1):
                if self.board[i][step]==2:
                    valid=True
                    self.board[i][step]=0
                    self.player0.add_step([i,step])
                    self.steps.append([i,step])
                    if self.judge(self.board,[i,step])[0]:
                        return True
                    break
        else:
            for i in range(7,-1,-1):
                if self.board[i][step]==2:
                    valid=True
                    self.board[i][step]=1
                    self.player1.add_step([i,step])
                    self.steps.append([i,step])
                    if self.judge(self.board,[i,step])[0]:
                        return True
                    break
        if valid:
            self.turn^=1
        return False
        
    @staticmethod
    def judge(board,step):
        print("===================")
        print("JUDGE")
        print(step)
        for i in board:
            print(i) 
        result=False
        maximum=1
        mark=board[step[0]][step[1]]
        for i in [[1,0],[1,1],[0,1],[1,-1]]:
            count_pos=1
            count_neg=1
            while (0<=(step[0]+count_pos*i[0])<=7)&(0<=(step[1]+count_pos*i[1])<=7):
                if (board[step[0]+count_pos*i[0]][step[1]+count_pos*i[1]]==mark):
                    count_pos+=1
                else:
                    break
            while (0<=(step[0]-count_neg*i[0])<=7)&(0<=(step[1]-count_neg*i[1])<=7):
                if (board[step[0]-count_neg*i[0]][step[1]-count_neg*i[1]]==mark):
                    count_neg+=1
                else:
                    break
            maximum=max(count_pos+count_neg-1,maximum)
            if count_neg+count_pos-1>3:
                result=True
                break
        print(result)
        print(maximum)
        print("===================")
        return result,maximum