from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.shortcuts import render
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt

def game(request):
    return render(request,'game.html',{})

@csrf_exempt
def game_make_step(request):
    from . import game
    column=request.GET.get('column',None)
    print(column)
    print("====================")
    vic=False
    winner=None
    next_step=None
    if request.method=='POST':
        game_status=None
        if column=='NG':
            print("NG entered")
            print("=============")
            game_status=game.Game(game.Player('p0',0),game.ServerPlayer(1))
            print(game_status.board)
            cache.set('game_status',game_status,timeout=None)
            return JsonResponse({'STATUS':'OK'})
        elif column is not None:
            game_status:game.Game=cache.get('game_status',game.Game)
            vic=game_status.make_step(int(column))
            if vic:
                winner='C'
            if not vic:
                next_step=game_status.player1.predict(game_status.board)
                vic=game_status.make_step(next_step)
                if vic:
                    winner='S'
            for i in game_status.board:
                print(i)
        cache.set('game_status',game_status,timeout=None)
    if vic:
        return JsonResponse({'STATUS':'VIC','P':str(winner)})
    return JsonResponse({'STATUS':"CON",'COLUMN':str(next_step)})